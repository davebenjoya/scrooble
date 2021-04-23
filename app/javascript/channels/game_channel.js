import { board } from "../components/board";
import consumer from "./consumer";
import lettersJSON from '../components/letters.json';
// import 'new_game.js';

let id;
let dataArray;
let moveId;

const initGameCable = () => {
  const messagesContainer = document.getElementById('messages');
  if (messagesContainer) {
    const id = messagesContainer.dataset.gameId;

    consumer.subscriptions.create({ channel: "GameChannel", id: id }, {
      received(data) {

      console.log('data ' , data);  // for submission 0 - message, 1 - player, 2- letters, 3 - score, 4 - move id
                                    // for acceptance 0 - message, 1- player, 2- score, 3 - 'acceptance'

        dataArray = data.split(":")

        if (dataArray[3].trim() != "acceptance") {    //  initial submission
          const delayLength = (dataArray[0].length * 80) + 600;
          const msgFirstWord = dataArray[0].split(" ")[0]
          const playerName  = dataArray[1]
          const letter_string = dataArray[2].replaceAll("↵", "")
          const letter_array  = letter_string.split(";");  // has extra empty element

          moveId =  dataArray[4]
          // console.log('msgFirstWord ' , msgFirstWord)


          console.log('letter_array   ' , letter_array);
          // document.querySelector('#messages').classList.add("messages-show");
          if (document.querySelector('.this-user').innerText.trim() != playerName.trim()) {
            updateBoard(letter_array);
            document.querySelector(".challenge-info").innerHTML = `${dataArray[0]}`;
            setTimeout( () => {
              document.querySelector('#challenge').classList.add('challenge-show');
            }, 4000 );

            // add listeners for dialog buttons
            document.querySelector('#challenge-btn').addEventListener('click', () => {
              console.log('click challenge');
            })
            document.querySelector('#accept-btn').addEventListener('click', acceptWords)

            // play submission alert sound
            document.querySelector('#btnAudio').src = '../../assets/dreamy.mp3';
            document.querySelector('#btnAudio').play();
          }
        } else {  // word(s) accepted

             document.querySelectorAll(".letter-provisional").forEach( (letter, index) => {
              letter.classList.remove("letter-provisional");
              letter.style=`transition-delay: ${1 + (.5 * index)}s`;
            })




            setTimeout(function () {

            // play acceptnce alert sound
            document.querySelector('#btnAudio').src = '../../assets/nutty.mp3';
            document.querySelector('#btnAudio').play();
            }, 4000);


            setTimeout(function () {

            // play acceptnce alert sound
              alert(`${dataArray[1]} scored ${dataArray[2]} points.`)
            }, 4500);

            updatePlayers(dataArray[1], dataArray[2]);

        }



      }

       });
  }
     // subscribe(id);
//   }

////////////////////////////////////////////////////////

function acceptWords() {

  const gId = document.querySelector(".edit-page-identifier").dataset.gameid
  const pId = document.querySelector(".edit-page-identifier").dataset.playerid
  const csrfToken = document.querySelector("[name='csrf-token']").content;

  const acceptData = {challenging: 'false', id:`${pId}`}
  fetch(`/players/${pId}`, {
    method: 'PATCH',
    headers: {
      'X-CSRF-Token': csrfToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(acceptData)
  })
  .then(response => response.json())
  .then(acceptObj => {
    console.log('acceptObj  ' + acceptObj.challenging);
    const moveAcceptData = {id: `${moveId}`}
    fetch(`/moves/${moveId}`, {
      method: 'PATCH',
      headers: {
      'X-CSRF-Token': csrfToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(moveAcceptData)
    })



    // updatePlayers(dataArray[2], dataArray[3]) // pass last player and last player's updated score






  });

  document.querySelector('#challenge').classList.remove('challenge-show');
}

  const updateBoard = (letter_array) => {
    letter_array.forEach( (letter, index) => {
      let char = letter.substring(0,1);
      let pos = parseInt(letter.substring(1));
      if (char[0] === "↵") {
       char = letter.substring(1,1);
       pos = parseInt(letter.substring(2));
      }
      if (pos) {
      document.querySelectorAll(".letter")[pos].innerText = char
      document.querySelectorAll(".letter")[pos].classList.add("letter-provisional");
      document.querySelectorAll(".letter")[pos].style=`transition-delay: ${.7 * index}s`;

      }
    })




    // const oldTiles = document.querySelectorAll(".tile");
    // const newGrid =  newString.trim().split(" ");
    //   newGrid.forEach( (char, index) => {
    //   if (char.trim() != "_") {
    //     if (char != oldTiles[index].querySelector(".letter").innerHTML) {
    //       oldTiles[index].querySelector(".letter").classList.add("letter-new");
    //       oldTiles[index].querySelector(".letter").innerHTML = char;
    //       setTimeout( function () {
    //         oldTiles[index].querySelector(".letter").classList.add("letter-new-show");
    //       }, index * .7)
    //       // find letter value
    //       Array.from(lettersJSON.letters).forEach( l => {
    //         if (l[char.trim()]) {
    //            oldTiles[index].querySelector(".board-value").innerHTML = l[char.trim()].value;
    //         }
    //       });
    //     }
    //   }
    // })
  }

  const updatePlayers = (lastPlayer, addedScore) => {
    const players =  document.querySelectorAll(".player")
    let player = "Morty"
    let newIndex;
    console.log("players.length ", players.length);
    console.log("players.length ", players.length);
    players.forEach( (plr, index)=> {
      if (plr.innerText.trim() === lastPlayer.trim()) {
        const oldScore = plr.parentNode.querySelector(".score").innerHTML
        const newScore = (parseInt(oldScore) + parseInt(addedScore)).toString();
        plr.parentNode.querySelector(".score").innerHTML = newScore;
        newIndex = index + 1;
        if (newIndex > players.length -1) {
          newIndex = 0;
        }
        console.log("newIndex ", newIndex);
        player = document.querySelectorAll(".player")[newIndex].innerHTML;
      }
    })

    document.querySelector("#navbar-game").querySelector(".nav-emp:last-child").innerHTML = `Up now: ${player}`;
    document.querySelector(".player-selected").classList.remove("player-selected");
    document.querySelectorAll(".player")[newIndex].parentNode.classList.add("player-selected");
    document.querySelector("#scores").setAttribute('data-current', newIndex);
  }






/////////////////////////////////////////////////

  function hide () {
          $('#exampleModalCenter').modal('hide');

  }

  function subscribe(id) {
    consumer.subscriptions.create({ channel: "GameChannel", id: id }, {
    received(data) {
      console.log("data" + data);
      messagesContainer.style.visible = "hidden";
      messagesContainer.insertAdjacentHTML('beforeend', data.replaceAll("&#39;", "'"));
      }
    });

  }

}

export { initGameCable };


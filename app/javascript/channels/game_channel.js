import { board } from "../components/board";
import consumer from "./consumer";
import lettersJSON from '../components/letters.json';
// import 'new_game.js';

let id

const initGameCable = () => {
  const messagesContainer = document.getElementById('messages');
  if (messagesContainer) {
    const id = messagesContainer.dataset.gameId;

    consumer.subscriptions.create({ channel: "GameChannel", id: id }, {
      received(data) {;

      console.log('data ' , data);
        const dataArray = data.split(":")
        const delayLength = (dataArray[0].length * 80) + 600;
        const msgFirstWord = dataArray[0].split(" ")[0]
        const letter_string = dataArray[1].replaceAll("↵", "")
        const letter_array  = letter_string.split(";");  // has extra empty element



// console.log('JSON.parse(data) ' , JSON.parse(data))


        console.log('letter_array   ' , letter_array);
        // document.querySelector('#messages').classList.add("messages-show");
        if (document.querySelector('.this-user').innerText != msgFirstWord) {
          document.querySelector(".challenge-info").innerHTML = `${dataArray[0]}`;
          document.querySelector('#challenge').classList.add('challenge-show');

          // setTimeout(function () {
          //   $('#message-modal').modal('hide');;
          // }, delayLength);
          console.log("document.querySelector('#challenge-btn') ", document.querySelector('#challenge-btn'));



          document.querySelector('#challenge-btn').addEventListener('click', () => {
            console.log('click challenge');
          })

          // accept words, set player.challenging to false
          document.querySelector('#accept-btn').addEventListener('click', acceptWords)
          document.querySelector('#btnAudio').src = '../../assets/dreamy.mp3';
          console.log(document.querySelector('#btnAudio').src);
          document.querySelector('#btnAudio').play();
      }


        updateBoard(letter_array);  // letter_array
        // updatePlayers(dataArray[2], dataArray[3]) // pass last player and last player's updated score
      },

       });
  }
     // subscribe(id);
//   }

////////////////////////////////////////////////////////

async function acceptWords() {

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
    console.log('acceptObj  ' + acceptObj.challenging)
  });
  document.querySelector('#challenge').classList.remove('challenge-show');
}

  const updateBoard = (letter_array) => {
    letter_array.forEach( letter => {
      let char = letter.substring(0,1);
      let pos = parseInt(letter.substring(1));
      if (char[0] === "↵") {
       char = letter.substring(1,1);
       pos = parseInt(letter.substring(2));
      }
      if (pos) {

      document.querySelectorAll(".letter")[pos].innerText = char
      document.querySelectorAll(".letter")[pos].classList.add("letter-provisional");

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
    // document.querySelectorAll(".player")[newIndex].parentNode.classList.add("player-selected");
    // document.querySelector("#scores").setAttribute('data-current', newIndex);
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


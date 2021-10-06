import  { board }  from "../components/board";
import consumer from "./consumer";
import lettersJSON from '../components/letters.json';
import { chooseLetters, restoreListenersAtAccept } from '../components/player_letters'
import { searchDictionary } from '../components/dictionary'
// import { restoreListenersAtAccept } from '../components/player_letters'
import '../components/board'

let id;
let dataArray = [];
let moveId;
let gId;
let pId;
let csrfToken;

const initGameCable = () => {
let playerName;
  const messagesContainer = document.getElementById('messages');
  if (messagesContainer) {
    const id = messagesContainer.dataset.gameId;
    consumer.subscriptions.create({ channel: "GameChannel", id: id }, {
      received(data) {
        gId = document.querySelector(".edit-page-identifier").dataset.gameid
        pId = document.querySelector(".edit-page-identifier").dataset.playerid
        csrfToken = document.querySelector("[name='csrf-token']").content;
        dataArray = data.split(":");
        console.log('data' , data);

         // console.log('dataArray.length ' , dataArray.length);
         // console.log('dataArray[0] ' , dataArray[1]);
         switch (dataArray[dataArray.length - 1].trim()) {

          case "real_words":
            // alert('dataArray', dataArray);
          break;
          case "end_game":
            alert(`${dataArray[0]}`);
            fetch(`/games/${gId}`, {
            method: 'GET',
            headers: {
              'X-CSRF-Token': csrfToken,
              'Content-Type': 'application/html',
            }
          })
          .then(response => {
            response.json()
          })
          .then(json => console.log(json));
            // $("#edit-page-identifier").load(window.location.href );
          break;
          case "challenge":
         const wordArray =  dataArray[2].split(',');
          console.log('challlllllenge');

            document.querySelector('#challenge-btn').style = "visibility: hidden";

            setTimeout(function () {
            // play challenge alert sound
            document.querySelector('#btnAudio').src = '../../assets/insistentHarp.mp3';
            document.querySelector('#btnAudio').play();
            }, 600);

          //   setTimeout(function () {
          //     document.querySelector('#challenge-info').innerHTML = `${dataArray[0]} is challenging ${dataArray[1]}.`;
          //     document.querySelector('#challenge').classList.add('challenge-show');

          // }, 2000);

            if (document.querySelector('.logged-in-as').innerHTML.split('as ')[1].trim() === document.querySelector(".nav-emp").innerText.split(':')[1].trim()) {
              searchDictionary(wordArray, moveId, playerName);
            }

          break;
          case "acceptance":
          console.log('accccccept');
             document.querySelectorAll(".letter-provisional").forEach( (letter, index) => {
              letter.classList.remove("letter-provisional");
              letter.style=`transition-delay: ${1 + (.5 * index)}s`;
            })

            setTimeout(function () {
            // play acceptance alert sound
            document.querySelector('#btnAudio').src = '../../assets/nutty2.mp3';
            document.querySelector('#btnAudio').play();
            }, 1600);
            // console.log('dataArray[1]' , dataArray[1])
            // console.log('dataArray[2]' , dataArray[2])

            showAccept()

            updatePlayers(dataArray[1], dataArray[2]);

            restoreListenersAtAccept();
            if (document.querySelector('.this-user').innerText.trim() === dataArray[1].trim()) {
              chooseLetters();
            }

          break;
          case "exchange":
            console.log('exchaaaaaaaaange');


            setTimeout(function () {
            // play acceptance alert sound
            document.querySelector('#btnAudio').src = '../../assets/nutty.mp3';
            document.querySelector('#btnAudio').play();
            }, 1600);

            setTimeout(function () {
              document.querySelector('.challenge-info').innerHTML = `${dataArray[0]}`;
              document.querySelector('#challenge').classList.add('challenge-show');
              document.querySelector('#challenge-btn').style.display = 'none';
              document.querySelector('#accept-btn').innerHTML = 'OK';
              document.querySelector('#accept-btn').addEventListener('click', () => {
                document.querySelector('#challenge').classList.remove('challenge-show');
              })
            }, 2000);

            updatePlayers(dataArray[1], 0);

            restoreListenersAtAccept();
            if (document.querySelector('.this-user').innerText.trim() === dataArray[1].trim()) {
              // chooseLetters();
            }

          break;
          default :
          console.log('submisssssßsion');

          moveId =  dataArray[4];

          document.querySelector(".edit-page-identifier").setAttribute('data-moveid', `${moveId}`);
          const delayLength = (dataArray[0].length * 80) + 600;
          // const msgFirstWord = dataArray[0].split(" ")[0]
          playerName  = dataArray[1]
          const letter_string = dataArray[2].replaceAll("↵", "")
          const letter_array  = letter_string.split(";");  // has extra empty element

          // console.log('msgFirstWord ' , msgFirstWord)


          console.log('dataArray[0]   ' , dataArray[0]);
          // document.querySelector('#messages').classList.add("messages-show");
          if (document.querySelector('.this-user').innerText.trim() != playerName.trim()) {
            updateBoard(letter_array);
            document.querySelector(".challenge-info").innerHTML = `${dataArray[0]}`;

            setTimeout( () => {
              document.querySelector('#challenge').classList.add('challenge-show');
              document.querySelector('#challenge-btn').style.display = 'block';
              document.querySelector('#challenge-btn').innerHTML = 'Challenge';
              document.querySelector('#accept-btn').innerHTML = 'Accept';
            }, ((letter_array.length * 1000) * .7) + .5 );

            // add listeners for dialog buttons
            document.querySelector('#challenge-btn').addEventListener('click', () => {
              console.log('click challenge');
              challengeWords()
            })
            document.querySelector('#accept-btn').addEventListener('click', acceptWords)

            // play submission alert sound
            document.querySelector('#btnAudio').src = '../../assets/nutty1.mp3';
            document.querySelector('#btnAudio').play();
          }
         }
        }

      });
  }
     // subscribe(id);
//   }

//




////////////////////////////////////////////////////////



function showAccept() {
  document.querySelector('#challenge-btn').style.display = 'none';
  document.querySelector('#accept-btn').innerHTML = 'OK';
  setTimeout(function () {
    // const name = dataArray[1];
    console.log(dataArray)
    document.querySelector('.challenge-info').innerHTML = `${dataArray[1]} scored ${dataArray[2]} points.`;
    document.querySelector('#challenge').classList.add('challenge-show');
    document.querySelector('#accept-btn').addEventListener('click', hideAccept)
  }, 2000);
}

function hideAccept() {
  document.querySelector('#challenge').classList.remove('challenge-show');
  document.querySelector('#accept-btn').removeEventListener('click', showAccept);
  // document.querySelector('#accept-btn').removeEventListener('click' hideAccept);
}


function challengeWords() {
  const challengeData = ({challenging: 'true'})

  fetch(`/players/${pId}`, {
    method: 'PATCH',
    headers: {
      'X-CSRF-Token': csrfToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(challengeData)
  })
  .then(response => {
    response.json()
  })
  .then(json => console.log(json))

  document.querySelector('#challenge').classList.remove('challenge-show');

}




////////////////////////////////////////////////////////

function acceptWords() {
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
    console.log('moveId  ' + moveId);
    const moveAcceptData = {id: `${moveId}`}
    fetch(`/moves/${moveId}`, {
      method: 'PATCH',
      headers: {
      'X-CSRF-Token': csrfToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(moveAcceptData)
    })
  });

  document.querySelector('#challenge').classList.remove('challenge-show');
   document.querySelector('#accept-btn').removeEventListener('click', acceptWords)
  // chooseLetters();
}

  const updateBoard = (letter_array) => {
    letter_array.forEach( (letter, index) => {
      let char = letter.substring(0,1);
      let pos = parseInt(letter.substring(1));
      let val;
      if (char[0] === "↵") {
       char = letter.substring(1,1);
       pos = parseInt(letter.substring(2));
      }


      Array.from(lettersJSON.letters).forEach( l => {
      if (l[char]) {
       val = l[char].value;
      }
    });




      if (pos) {

      document.querySelectorAll(".board-value")[pos].innerText = val;
      document.querySelectorAll(".letter")[pos].innerText = char
      document.querySelectorAll(".letter")[pos].classList.add("letter-provisional");
      document.querySelectorAll(".letter")[pos].style=`transition-delay: ${.7 * index}s`;

      }
    })

  }

  const updatePlayers = (lastPlayer, addedScore) => {
    const players =  document.querySelectorAll(".player")
    let player = "Morty"
    let newIndex = 0;
    console.log("players.length ", players.length);
    players.forEach( (plr, index)=> {
      if (plr.innerHTML.trim() === lastPlayer.trim()) {
        const oldScore = plr.parentNode.querySelector(".score").innerHTML
        const newScore = (parseInt(oldScore) + parseInt(addedScore)).toString();
        plr.parentNode.querySelector(".score").innerHTML = newScore;
        newIndex = index + 1;
        if (newIndex > players.length -1) {
          newIndex = 0;
        }
        console.log("newIndex ", newIndex);

        const yOff = newIndex * 26;
        document.querySelector(":root").setAttribute("bug-y-offset", `${yOff}px`);



        player = document.querySelectorAll(".player")[newIndex].innerHTML;
      }
    })

    document.querySelector("#navbar-game").querySelector(".nav-emp:last-child").innerHTML = `Up now: ${player}`;
    document.querySelector(".player-selected").classList.remove("player-selected");
    document.querySelectorAll(".player")[newIndex].parentNode.classList.add("player-selected");
    document.querySelector("#scores").setAttribute('data-current', newIndex);
    // console.log(document.querySelector(":root").getAttribute("--bug-y-offset"));
    // document.querySelector(":root").setAttribute("bug-y-offset", `${(newIndex * 26) + 3 }px`);

    if (document.querySelector(".this-user").parentNode.classList.contains("player-selected")) {
        document.querySelector('#exchange-btn').classList.remove('button-disabled');
    }
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


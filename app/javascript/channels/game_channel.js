import  { board }  from "../components/board";
import consumer from "./consumer";
import lettersJSON from '../components/letters.json';
import { chooseLetters, restoreListenersAtAccept } from '../components/player_letters'
import { searchDictionary } from '../components/dictionary'
// import { restoreListenersAtAccept } from '../components/player_letters'
import '../components/board'

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
                                   // for acceptance 0 - message, 1 - player, 2- score, 3 - 'acceptance'//
                                    // for challenge 0 - message, 1 - words, 2 - move id, 3- 'challenge'
                                  // for exchange 0 - message, 1 - player, 2 - 'exchange'

        dataArray = data.split(":")
         console.log('dataArray.length ' , dataArray.length);
         console.log('dataArray[0] ' , dataArray[0]);
         const wordArray =  dataArray[1].split(',');

         switch (dataArray[dataArray.length - 1].trim()) {
          case "challenge":
          console.log('challlllllenge');

              document.querySelector('#confirmation-btn').style = "visibility: hidden";

            setTimeout(function () {
            // play challenge alert sound
            document.querySelector('#btnAudio').src = '../../assets/insistentHarp.mp3';
            document.querySelector('#btnAudio').play();
            }, 1600);

            setTimeout(function () {
              document.querySelector('#confirmation-info').innerHTML = `${dataArray[0]}`;
              document.querySelector('#confirmation').classList.add('challenge-show');

          }, 2000);

            setTimeout(function () {
            // play challenge alert sound
            document.querySelector('#btnAudio').src = '../../assets/stub.mp3';
            document.querySelector('#btnAudio').play();

              const moveId = dataArray[2]
              const allWordsValid = searchDictionary(wordArray, moveId);
              // console.log('searchDictionary(wordArray, moveId) ', searchDictionary(wordArray, moveId))
              console.log('allWordsValid', allWordsValid)
            }, 6600);

            setTimeout(function () {
              document.querySelector('#confirmation-btn').style = "visibility: visible";
            }, 7300);

          // end setTimeout
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

            setTimeout(function () {
              document.querySelector('#confirmation-info').innerHTML = `${dataArray[1]} scored ${dataArray[2]} points.`;
              document.querySelector('#confirmation').classList.add('challenge-show');

            document.querySelector('#confirmation-btn').addEventListener('click', () => {
              document.querySelector('#confirmation').classList.remove('challenge-show');

            })
            }, 2000);

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
              document.querySelector('#confirmation-info').innerHTML = `${dataArray[0]}`;
              document.querySelector('#confirmation').classList.add('challenge-show');

            document.querySelector('#confirmation-btn').addEventListener('click', () => {
              document.querySelector('#confirmation').classList.remove('challenge-show');

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
          const msgFirstWord = dataArray[0].split(" ")[0]
          const playerName  = dataArray[1]
          const letter_string = dataArray[2].replaceAll("↵", "")
          const letter_array  = letter_string.split(";");  // has extra empty element

          // console.log('msgFirstWord ' , msgFirstWord)


          console.log('letter_array   ' , letter_array);
          // document.querySelector('#messages').classList.add("messages-show");
          if (document.querySelector('.this-user').innerText.trim() != playerName.trim()) {
            updateBoard(letter_array);
            document.querySelector(".challenge-info").innerHTML = `${dataArray[0]}`;

            setTimeout( () => {
              document.querySelector('#challenge').classList.add('challenge-show');
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


function challengeWords() {

  const pId = document.querySelector(".edit-page-identifier").dataset.playerid
  const csrfToken = document.querySelector("[name='csrf-token']").content;
  const challengeData = ({challenging: 'true'})

  fetch(`/players/${pId}`, {
    method: 'PATCH',
    headers: {
      'X-CSRF-Token': csrfToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(challengeData)
  })


  document.querySelector('#challenge').classList.remove('challenge-show');

}




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
    let newIndex;
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


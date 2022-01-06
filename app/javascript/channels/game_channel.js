import  { board }  from "../components/board";
import consumer from "./consumer";
import lettersJSON from '../components/letters.json';
import { chooseLetters, restoreListenersAtAccept, restoreLetters } from '../components/player_letters'
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
        if (document.querySelector(".edit-page-identifier").dataset.gameid) {
        gId = document.querySelector(".edit-page-identifier").dataset.gameid
        pId = document.querySelector(".edit-page-identifier").dataset.playerid
        csrfToken = document.querySelector("[name='csrf-token']").content;
        }
        dataArray = data.split(":");
         if (dataArray[dataArray.length - 2].toString().trim() === document.querySelector(".edit-page-identifier").dataset.gameid.toString().trim()) {

           switch (dataArray[dataArray.length - 1].toString().trim()) {

            case "real_words":
              console.log('real_words dataArray', dataArray);
              document.querySelector('.challenge-info').innerHTML = `Valid Move. ${dataArray[0]} misses a turn.`
              document.querySelector('#challenge-btn').style = "visibility: hidden";
              document.querySelector('#accept-btn').innerHTML = "OK";
              document.querySelector('#accept-btn').style = "visibility: visible";

              // fetch to add skip to challenger
              break;
            case "fake_words":
              document.querySelectorAll('.letter-provisional').forEach((ltr, index) => {
                ltr.classList.remove('letter-provisional')
                ltr.style = `transition-delay: ${1 + (.5 * index)}s`;
                ltr.innerHTML = ''
                ltr.parentNode.querySelector('.board-value').innerHTML = ''
              })
              document.querySelector('.challenge-info').innerHTML = dataArray[0]
              document.querySelector('#challenge-btn').style = "visibility: hidden";
              document.querySelector('#accept-btn').innerHTML = "OK";
              document.querySelector('#accept-btn').style = "visibility: visible";
              document.querySelector('#accept-btn').removeEventListener('click', acceptWords);
              document.querySelector('#accept-btn').addEventListener('click', hideFake);

              const lastPlayer = document.querySelector('.nav-emp').innerHTML.split(':')[1].trim()

              console.log('lastPlayer' , lastPlayer);
              updatePlayers(lastPlayer, 0);
              break;

            case "end_game":
            console.log('ennnnddddd   gaaammmmmme')
              // alert(`${dataArray[0]}`);
            //   fetch(`/games/${gId}`, {
            //   method: 'GET',
            //   headers: {
            //     'X-CSRF-Token': csrfToken,
            //     'Content-Type': 'application/html',
            //   }
            // })
            // .then(response => {
            //   response.json()
            // })
            // .then(json => console.log(json));
              // $("#edit-page-identifier").load(window.location.href );
            break;
            case "challenge":
              const wordArray =  dataArray[2].split(',');
              playerName =  dataArray[1];
              console.log('playerName ', playerName);
              setTimeout(function () {
              // play challenge alert sound
              document.querySelector('#btnAudio').src = '../../assets/insistentHarp.mp3';
              document.querySelector('#btnAudio').play();
              document.querySelector('.challenge-info').innerHTML = `${dataArray[0]} is challenging ${dataArray[1]}. Checking the dictionary...`;
              document.querySelector('#challenge').classList.add('challenge-show');
              document.querySelector('.challenge-body').classList.add('challenge-body-show');
              document.querySelector('#challenge-btn').style = "visibility: hidden";
              document.querySelector('#accept-btn').style = "visibility: hidden";
                document.querySelector('#challenge-btn').style.display = 'none';
                document.querySelector('#accept-btn').style.display = 'none';
              }, 600);

              setTimeout(function () {
                if (document.querySelector('.logged-in-as').innerHTML.split('as ')[1].trim() === document.querySelector(".nav-emp").innerText.split(':')[1].trim()) {
                  searchDictionary(wordArray, moveId, playerName);
                }

            }, 2000);


            break;
            case "acceptance":
            console.log('accccccept', dataArray[3]);
               document.querySelectorAll(".letter-provisional").forEach( (letter, index) => {
                letter.classList.remove("letter-provisional");
                letter.style = `transition-delay: ${1 + (.5 * index)}s`;
              })

              setTimeout(function () {
              // play acceptance alert sound
              document.querySelector('#btnAudio').src = '../../assets/nutty2.mp3';
              document.querySelector('#btnAudio').play();
              }, 1600);
              // console.log('dataArray[1]' , dataArray[1])
              // console.log('dataArray[2]' , dataArray[2])

              showAccept();

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
                document.querySelector('.challenge-body').classList.add('challenge-body-show');
                document.querySelector('#challenge-btn').style.display = 'none';
                document.querySelector('#accept-btn').innerHTML = 'OK';
                document.querySelector('#accept-btn').addEventListener('click', () => {
                document.querySelector('#challenge').classList.remove('challenge-show');
                document.querySelector('.challenge-body').classList.remove('challenge-body-show');
                })
              }, 2000);

              updatePlayers(dataArray[1], 0);

              restoreListenersAtAccept();
              if (document.querySelector('.this-user').innerText.trim() === dataArray[1].trim()) {
                // chooseLetters();
              }

            break;
            case 'pending':
              for (const charPos of dataArray[3].split(';')) {
                const char = (charPos.slice(0, 1));
                const pos = (charPos.slice(1));
                console.log(char);
                console.log(pos);
                if (char.length > 0) {
                  // document.querySelectorAll('.letter')[parseInt(pos)].classList.add('letter-provisional')
                }
              }

              document.querySelector(".challenge-info").innerHTML = dataArray[0];
              document.querySelector('#challenge').classList.add('challenge-show');
              document.querySelector('.challenge-body').classList.add('challenge-body-show');
              document.querySelector('#challenge-btn').style.display = 'block';
              document.querySelector('#challenge-btn').innerHTML = 'Challenge';
              document.querySelector('#accept-btn').innerHTML = 'Accept';

            console.log('dataArrrrrrrrrrrrray[0]', dataArray[0]);

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


            console.log('dataArray[0]   ' , dataArray[1]);
            // document.querySelector('#messages').classList.add("messages-show");
            if (document.querySelector('.this-user').innerText.trim() != playerName.trim()) {
              updateBoard(letter_array);
              document.querySelector(".challenge-info").innerHTML = `${dataArray[0]}`;

              setTimeout( () => {
                document.querySelector('#challenge').classList.add('challenge-show');
                document.querySelector('.challenge-body').classList.add('challenge-body-show');
                document.querySelector('#challenge-btn').style.visibility = 'visible';
                document.querySelector('#challenge-btn').style.display = 'block';
                document.querySelector('#challenge-btn').innerHTML = 'Challenge';
                document.querySelector('#accept-btn').innerHTML = 'Accept';
              }, ((letter_array.length * 1000) * .7) + .5 );

              // add listeners for dialog buttons
              document.querySelector('#challenge-btn').addEventListener('click', () => {
                challengeWords()
              })
                console.log('pId');
              document.querySelector('#accept-btn').addEventListener('click', acceptWords)

              // play submission alert sound
              document.querySelector('#btnAudio').src = '../../assets/nutty1.mp3';
              document.querySelector('#btnAudio').play();
            }
           }
         }
        }

      });
  }



////////////////////////////////////////////////////////



function showAccept() {
  if (document.querySelector('#challenge-btn')) {
  document.querySelector('#challenge-btn').style.display = 'none';

  }
  document.querySelector('#accept-btn').innerHTML = 'OK';
  document.querySelector('#accept-btn').style.visibility = 'visible';
  document.querySelector('#accept-btn').style.display = 'block';
  setTimeout(function () {
    // const name = dataArray[1];
    if (dataArray[3].length > 0) {
      console.log(dataArray[3])
    }
    document.querySelector('.challenge-info').innerHTML = `${dataArray[1]} scored ${dataArray[2]} points.`;
    document.querySelector('#challenge').classList.add('challenge-show');
    document.querySelector('.challenge-body').classList.add('challenge-body-show');
    document.querySelector('#accept-btn').addEventListener('click', hideAccept)
  }, 2000);
}

function hideAccept() {
  document.querySelector('#challenge').classList.remove('challenge-show');
  document.querySelector('.challenge-body').classList.remove('challenge-body-show');
  document.querySelector('#accept-btn').removeEventListener('click', showAccept);
  // document.querySelector('#accept-btn').removeEventListener('click' hideAccept);
}

function hideFake() {
  document.querySelector('#challenge').classList.remove('challenge-show');
  document.querySelector('.challenge-body').classList.remove('challenge-body-show');
  document.querySelector('#accept-btn').removeEventListener('click', hideFake);
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
    // console.log('moveId  ' + moveId);
    const moveAcceptData = {id: `${moveId}`, provisional: false}
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
  document.querySelector('.challenge-body').classList.remove('challenge-body-show');

  document.querySelector('#accept-btn').removeEventListener('click', acceptWords)
  // chooseLetters();
}

  const checkJokerPos = (jokerArray) => {
    for (const jokerPos of jokerArray){

      console.log(jokerPos)
    }

    return false
  }

  const updateBoard = (letter_array) => {
      console.log ('letter_array ', letter_array);
    letter_array.forEach( (letter, index) => {
      let char = letter.substring(0,1);
      let pos
      let jokerPresent = false
      if (letter.substring(letter.length -1) === 'J') {
        pos = parseInt(letter.substring(1 ,letter.length -1));
        jokerPresent = true
      } else {
        pos = parseInt(letter.substring(1));
      }
      if (char[0] === "↵") {
       char = letter.substring(1,1);
       pos = parseInt(letter.substring(2));
      }

      let val;
      console.log ('jokerPresent ', jokerPresent);
      Array.from(lettersJSON.letters).forEach( l => {
        if (l[char]) {
          if (jokerPresent === true) {
            val = '0'
          } else {
            val = l[char].value;
          }
        }
      });

      if (pos) {
        if (jokerPresent === true) document.querySelectorAll(".tile")[pos].classList.add('tile-joker')
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
    let oldIndex = 0;
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
        const yOff = newIndex * 26;
        oldIndex = index;
        player = document.querySelectorAll(".player")[newIndex].innerHTML;
      }
    })

    document.querySelector("#navbar-game").querySelector(".nav-emp:last-child").innerHTML = `Up now: ${player}`;
    // document.querySelector(".player-selected").closest('.player').classList.remove('player-selected-name');
    document.querySelector(".player-selected").classList.remove("player-selected");

    document.querySelectorAll(".player")[newIndex].parentNode.classList.add("player-selected");
    // document.querySelectorAll(".player")[0].parentNode.classList.add('player-selected-name');
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


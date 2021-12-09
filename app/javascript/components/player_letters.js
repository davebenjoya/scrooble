  import lettersJSON from './letters.json';

// import 'new_game.js';
// import Sortable from "sortablejs";
import { Sortable, MultiDrag, Swap, OnSpill, AutoScroll } from "sortablejs";

import '../components/board'


if (document.querySelector(".edit-page-identifier")) {
  const current = document.querySelector("#dashboard").dataset.current;

}

 const myLettersDiv = document.getElementById("my-letters");
  let remainingLetters = [];
  const numOfBgs = 6;
  let currentBg = 0;
  let myLetters = [];
  let maxLetters = 7;
  const maxPlayers = 4;
  let selectedLetter = null;
  let buffer = [];
  let submitEscape = false;
  let exchange = false;

  let jokers = [];
  let jokerTile  = null;
  let currentPlayer;
  const clickSounds = ['m1', 'm2', 'm3', 'm4', 'm5', 'm6'];
  let currentClickSound = 0

  const dash = document.querySelector("#dashboard");

  function checkJoker() {
    return jokerTile != null

  }


  function validateJoker () {
      const val = document.querySelector("#replacement-input").value;
      if (!val.match(/[a-zA-Z]/)) {
        alert ("Enter a letter to replace Joker");
        document.querySelector("#replacement-input").value = ''
      } else {
        document.querySelector("#replacement-input").value = document.querySelector("#replacement-input").value.toUpperCase();
        oninput="this.value = this.value.toUpperCase()"
        document.querySelector("#challenge-btn").focus();
      }

  }




 function placeLetter () {
  console.log('exchange ', exchange);
    if (exchange === false) {

      if(event.target.querySelector('.letter').classList.contains("letter-provisional")) {
      // already a letter on square
        event.target.querySelector('.letter').classList.remove("letter-provisional");
        let restoreFlag = false;  // if player has more than one of the same letter, only restore one
        let searchLetter = ''

        if (event.target.querySelector('.board-value').innerHTML === '0') {
          event.target.classList.remove('tile-joker')
           searchLetter = '*'
        } else {
          searchLetter = event.target.querySelector('.letter').innerHTML
        }

        document.querySelectorAll(".letter-disabled").forEach (ltr => {
          if (searchLetter === ltr.querySelector('.my-letter').innerHTML ) {
            if (restoreFlag === false) {
              ltr.classList.remove("letter-disabled");
              ltr.addEventListener('click', toggleLetter);
              if (selectedLetter) selectedLetter.classList.remove("letter-selected")
              selectedLetter = null;
              restoreFlag = true;
            }
          }
        })

        event.target.querySelector('.letter').innerText = '';
        event.target.querySelector('.board-value').innerHTML = "";
        if (document.querySelectorAll(".letter-provisional").length < 1) {
          document.querySelector(".commit-btn").classList.add('button-disabled');
          document.querySelector(".cancel-btn").classList.add('button-disabled');
          document.querySelector(".exchange-btn").classList.remove('button-disabled');

        }
      } else {
        selectedLetter = document.querySelector('.letter-selected');
        if (selectedLetter) {
          let txt = selectedLetter.querySelector('.my-letter').innerHTML
          let val = selectedLetter.querySelector('.my-value').innerHTML;
          // replace joker
          if (txt === " ") {
              jokerTile = event.target;
              submitEscape = true;
              jokers.push(jokerTile);

              const cBtn = document.querySelector('#challenge-btn').cloneNode(true);
              const aBtn = document.querySelector('#accept-btn').cloneNode(true);
              document.querySelector('#challenge-btn').parentNode.replaceChild(cBtn, document.querySelector('#challenge-btn'));
              document.querySelector('#accept-btn').parentNode.replaceChild(aBtn, document.querySelector('#accept-btn'));

              document.querySelector("#replacement-input").value = '';

        document.querySelector('#replacement-input').style.visibility = 'visible';
              document.querySelector("#replacement-input").addEventListener('input', validateJoker)
              document.querySelector("#challenge-btn").addEventListener('click', placeJoker)
              // document.querySelector('#challenge-btn').style.display = 'block';
              document.querySelector("#accept-btn").addEventListener('click', hideDialog)

              document.querySelector('#challenge-btn').style = "visibility: visible";
              document.querySelector('#accept-btn').style = "visibility: visible";
              document.querySelector('.challenge-info').innerHTML = 'Change Joker to:';
              document.querySelector('#challenge-btn').innerHTML = 'Replace';
              document.querySelector('#accept-btn').innerHTML = 'Cancel';
              setTimeout(() => {

                document.querySelector('#challenge').classList.add('challenge-show');

                document.querySelector('#challenge-body').classList.add('challenge-body-show');


              }, 500)
          //      replacement = document.querySelector("#replace-joker").value.toUpperCase();
          // jokerTile.querySelector('.letter').innerHTML = replacement;
          // jokerTile.querySelector(".board-value").innerHTML = "0";
          // jokerTile.querySelector('.letter').classList.add("letter-provisional");
          // jokerTile.classList.add("joker-replaced");
          // buffer.push(replacement);
          // selectedLetter.classList.remove("letter-selected");
          // selectedLetter.classList.add("letter-disabled");
          // selectedLetter.removeEventListener('click', toggleLetter);
          // document.querySelector('.commit-btn').classList.remove("button-disabled");
          // document.querySelector('.cancel-btn').classList.remove("button-disabled");
          // document.querySelector('.exchange-btn').classList.add("button-disabled");
          // selectedLetter = null;
          // submitEscape = false;
          } else {
            populateTile()
          }
        }

         }
      } else {              // exchange === true
        // document.querySelector('#exchange-btn').removeEventListener('click', markLetters);
        // document.querySelector('#exchange-btn').classList.add('button-disabled');
        // if (selectedLetter) {
        //   let txt = selectedLetter.querySelector('.my-letter').innerHTML
        //   let val = selectedLetter.querySelector('.my-value').innerHTML;
        //   if (txt === " ") {
        //       const replacement = `Replace Joker with: <input id="replace-joker" maxlength = 1 type=text required>`
        //       document.querySelector(".modal-body").innerHTML = replacement;
        //       jokerTile = event.target;
        //       submitEscape = true;
        //       // jokers.push(jokerTile);
        //       $('#exampleModalCenter').modal('show');
        //   } else {
        //     submitEscape = false;
        //     event.target.querySelector('.letter').innerHTML = txt;
        //     event.target.querySelector('.letter').classList.add('letter-provisional');
        //     // event.target.style.backgroundImage = url('../images/tile01.jpg');
        //     buffer.push(txt);
        //     event.target.querySelector(".board-value").innerHTML = `${val}`;
        //     document.querySelector('#btnAudio').src = '../../assets/' + clickSounds[currentClickSound] + ".mp3";
        //     console.log(document.querySelector('#btnAudio').src);
        //     document.querySelector('#btnAudio').play();
        //     currentClickSound ++
        //     if (currentClickSound > clickSounds.length -1) currentClickSound = 0
        //     selectedLetter.classList.remove("letter-selected");
        //     selectedLetter.classList.add("letter-disabled");
        //     selectedLetter.removeEventListener('click', toggleLetter);
        //     document.querySelector('.commit-btn').classList.remove("button-disabled");
        //     document.querySelector('.cancel-btn').classList.remove("button-disabled");
        //     selectedLetter = null;
        //   }

        // if (document.querySelectorAll(".letter-disabled").length > 0 ) {
        //   document.querySelector("#commit-btn").classList.remove("button-disabled")
        //   document.querySelector("#cancel-btn").classList.remove("button-disabled")
        // }
        }


      }


  function hideDialog() {

  document.querySelector('#challenge').classList.remove('challenge-show');
  document.querySelector('.challenge-body').classList.remove('challenge-body-show');
   document.querySelector('#accept-btn').removeEventListener('click', hideDialog)

  }


function populateTile() {

  event.target.querySelector('.letter').innerText = selectedLetter.querySelector(".my-letter").innerText;
  event.target.querySelector('.board-value').innerHTML = selectedLetter.querySelector(".my-value").innerText;
  selectedLetter.classList.remove('letter-selected');
  selectedLetter.classList.add('letter-disabled');
  selectedLetter = null;
  event.target.querySelector('.letter').classList.add('letter-provisional');
  document.querySelector('.commit-btn').classList.remove('button-disabled');
  document.querySelector('.exchange-btn').classList.add('button-disabled');
  document.querySelector('.cancel-btn').classList.remove('button-disabled');
  document.querySelector('#btnAudio').src = `../../assets/${clickSounds[currentClickSound]}.mp3`;
   // document.querySelector('#btnAudio').src = `../../assets/m1.mp3`;
  document.querySelector('#btnAudio').play();
  currentClickSound ++ ;
  if (currentClickSound > clickSounds.length - 1) currentClickSound = 0;
}

function disableJoker() {
  selectedLetter.classList.remove('letter-selected');
  selectedLetter.classList.add('letter-disabled');
  selectedLetter = null;
  // event.target.querySelector('.letter').classList.add('letter-provisional');

        document.querySelector('#replacement-input').style.visibility = 'collapse';

  document.querySelector('.commit-btn').classList.remove('button-disabled');
  document.querySelector('.exchange-btn').classList.add('button-disabled');
  document.querySelector('.cancel-btn').classList.remove('button-disabled');
  document.querySelector('#btnAudio').src = `../../assets/${clickSounds[currentClickSound]}.mp3`;
   // document.querySelector('#btnAudio').src = `../../assets/m1.mp3`;
  document.querySelector('#btnAudio').play();
  currentClickSound ++ ;
  if (currentClickSound > clickSounds.length - 1) currentClickSound = 0;


}

function placeJoker() {
  if (document.querySelector("#replacement-input").value === '' ) {
    alert ("Pick a letter to replace the joker.")
  } else {
    jokerTile.querySelector('.letter').innerHTML = document.querySelector("#replacement-input").value
    jokerTile.querySelector('.letter').classList.add('letter-provisional')
    jokerTile.querySelector('.board-value').innerHTML = '0';
    jokerTile.classList.add('tile-joker');
    disableJoker();
    hideDialog();
  }
}

function checkExchange () {
  return exchange;
}

function restoreListenersAtAccept() {
  document.querySelectorAll('.tile').forEach(t => {
    t.addEventListener('click', placeLetter);
  })
  document.querySelectorAll('.my-tile').forEach(tile => {
    tile.addEventListener('click', toggleLetter);
  })
  // document.querySelector('#commit-btn').addEventListener('click', commitLetters);
  // document.querySelector('#cancel-btn').addEventListener('click', restoreLetters);
  // document.querySelector('#exchange-btn').addEventListener('click', markLetters);
  // document.querySelector('#end-btn').addEventListener('click', endGame);

  document.querySelector('#commit-btn').classList.add('button-disabled');
  document.querySelector('#cancel-btn').classList.add('button-disabled');
  // document.querySelector('#exchange-btn').addEventListener('click', markLetters);
  // document.querySelector('#end-btn').addEventListener('click', endGame);
}




  function chooseLetters() { // select my letters from available letters


    // document.addEventListener('keydown', pickLetter);

    if (document.querySelector("#dashboard")) {
      const remain = (document.querySelector("#dashboard").dataset.remaining.split(','));
      remainingLetters =  [];

      remain.forEach( ltr => {
        if (ltr.match(/[A-Z] | */) && ltr.length === 1 ) {
          remainingLetters.push(ltr) ;
        }
      });
    }

     const letters = document.querySelector("#my-letters").dataset.playerLetters;
    // console.log('letters ' + letters);
    myLetters = [];
    let numNewLetters = 0;
    const tiles = document.querySelectorAll('.my-tile')
    tiles.forEach(tile => {
      if (tile.classList.contains("letter-disabled")) {
        numNewLetters ++;
        tile.remove();
      } else {
        myLetters.push(tile.querySelector(".my-letter").innerText)
      }
    })

    const gId = document.querySelector(".edit-page-identifier").dataset.gameid
    console.log('gId ', gId);

    const pId = document.querySelector(".edit-page-identifier").dataset.playerid
    const csrfToken = document.querySelector("[name='csrf-token']").content;

    if (remainingLetters.length > 0 ) {
      let maxLettersLocal = maxLetters
      if (remainingLetters.length < maxLettersLocal - myLetters.length) {
        maxLettersLocal = myLetters.length + remainingLetters.length;
      }

      while (myLetters.length < maxLettersLocal ) {
        const ind = Math.floor(Math.random() * remainingLetters.length);
        const ran = remainingLetters[ind];
        myLetters.push(ran);

        remainingLetters.splice(ind, 1);

      }

        // console.log('remainingLetters string ?', remainingLetters.toString());
 // console.log("remainingLetters array ?", remainingLetters)


    console.log("myLetters ", myLetters)
    appendMyLetters(numNewLetters);

    let myLetterString = ``
    myLetters.forEach(ltr => {
      myLetterString += ltr;
    });
    const playerData = ({player_letters: myLetterString})

  fetch(`/players/${pId}`, {
    method: 'PATCH',
    headers: {
      'X-CSRF-Token': csrfToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(playerData)
  })



    }  // end if remainingLetters.length > 0

  }



  function restoreLetters () {
    if (!document.querySelector(".cancel-btn").classList.contains("button-disabled")) {
      document.querySelector(".cancel-btn").classList.add("button-disabled");
      if (exchange) {
        document.querySelectorAll('.marked-for-exchange').forEach( ltr => {
          ltr.classList.remove("marked-for-exchange");
          // ltr.addEventListener('click', toggleLetter);
        });

      } else {  // not in exchange mode
        document.querySelector(".commit-btn").classList.add("button-disabled");
        document.querySelector(".exchange-btn").classList.remove("button-disabled");
        document.querySelector('#exchange-btn').addEventListener('click', markLetters);
        document.querySelectorAll('.letter-disabled').forEach( ltr => {
          ltr.classList.remove("letter-disabled");
          ltr.classList.remove("letter-selected");
          ltr.addEventListener('click', toggleLetter);
        });
        document.querySelectorAll('.letter-provisional').forEach( ltr => {
          ltr.classList.remove("letter-provisional");
          ltr.parentNode.classList.remove("joker-replaced");
          ltr.innerHTML = "";
          ltr.parentNode.querySelector(".board-value").innerHTML = "";
        });
        buffer = [];
          selectedLetter = null;
      }
    }
    restoreListenersAtAccept();
  }




function setLetterValues() {
    const tiles = document.querySelectorAll('.tile')
      tiles.forEach((tile, index) => {
      let boardVal = ``;
      if (tile.querySelector(".letter")) {
        const letter = tile.querySelector(".letter").innerText
        Array.from(lettersJSON.letters).forEach( l => {
          if (l[letter]) {
             boardVal = l[letter].value;
          }
        });
        tile.querySelector(".board-value").innerText = boardVal;
        // tile.querySelector(".board-value").style = 'letter-spacing: .7px !important'
      }
    });
  }



const pickLetter = () => {   // using keyboard
  const thisUser = document.querySelector(".this-user");
  if (thisUser) {
    if (thisUser.parentNode.classList.contains("player-selected")) {
      if (submitEscape === false ) {  // replace joker and challenge dialogue not visible
        switch (event.key) {
          case "Enter":
            commitLetters();
            break;
          case "Escape":
            restoreLetters();
            break;
          default: null;
          };
        const tiles = Array.from(document.querySelectorAll(".my-tile"));
        tiles.reverse().forEach( tile => {
          if (tile.querySelector(".my-letter").innerHTML === event.key.toUpperCase()) {
            if (exchange) {
              tile.classList.toggle("marked-for-exchange");
            } else {
            if (tile != selectedLetter && !tile.classList.contains("letter-disabled")) {
              if (selectedLetter) selectedLetter.classList.remove("letter-selected");
                tile.classList.add("letter-selected");
                selectedLetter =  tile;
              } else {
                tile.classList.remove("letter-selected");
                selectedLetter =  null;
              }
            }

            }
        });

    }

    } else { // replace joker dialogue visible
      if (event.key === "Enter") {
        // commitLetters();
      }
    }
  } else {
      // alert ("It's not your turn!");
      myLetters.forEach(ltr => {
        if (ltr.toLowerCase() === event.key.toLowerCase()) {
          const currentUserName = document.querySelectorAll(".name-score")[current].querySelector(".name").innerHTML;
          alert (`It's ${currentUserName}'s turn. You can rearrange your tiles while you wait.`);
        }
      });
  }
}


  function markLetters() {

    exchange = true;
    if (selectedLetter) {
      selectedLetter.classList.remove('letter-selected')
      selectedLetter = null;
    }

    document.querySelector('#exchange-btn').classList.add("exchange-btn-active");
    document.querySelector('#commit-btn').classList.remove("button-disabled");
    document.querySelector('#exchange-btn').removeEventListener('click', markLetters);
    document.querySelector('#exchange-btn').addEventListener('click', unmarkLetters);
    console.log("mark lettttttters");
  }

  function unmarkLetters() {
    exchange = false;
    document.querySelectorAll(".marked-for-exchange").forEach( marked => {
      marked.classList.remove("marked-for-exchange");
    })
    document.querySelector('#exchange-btn').classList.remove("exchange-btn-active");
    document.querySelector('#commit-btn').classList.add("button-disabled");
    document.querySelector('#cancel-btn').classList.add("button-disabled");
    document.querySelector('#exchange-btn').addEventListener('click', markLetters);
    document.querySelector('#exchange-btn').removeEventListener('click', unmarkLetters);
  }

  function appendMyLetters(num) {
    let val;
    for (let d = (maxLetters - num); d < maxLetters; d++ ) {
      const ltr = myLetters[d];
      // console.log("ltr ", ltr);
      Array.from(lettersJSON.letters).forEach( l => {
        if (l[ltr]) {
         val = l[ltr].value;
        }
      });

      const myLettersDiv = document.getElementById("my-letters");
      let bgClass = ``;
      const leading  = currentBg < 10 ? "0" : "";
      bgClass = `tile` + leading + (currentBg + 1).toString();
      currentBg ++ ;
      if (currentBg > numOfBgs - 1 ) currentBg = 0;
      const tileHtml = `<div class='my-tile ${bgClass}'><div class="my-letter">${ltr}</div><div class="my-value">${val}</div></div>`
      myLettersDiv.insertAdjacentHTML('beforeend', tileHtml);
      myLettersDiv.lastChild.addEventListener('click', toggleLetter);
        // console.log('tileHtml ' + tileHtml);
    console.log('myLetters   ', myLetters);
    }
   return myLetters;
  }

  function toggleLetter() {
    const thisUser = document.querySelector(".this-user");
    if (thisUser.parentNode.classList.contains("player-selected")) {  // current user's turn
      if (exchange === true) {
        event.currentTarget.classList.toggle('marked-for-exchange');


              if (event.currentTarget.classList.contains("marked-for-exchange")) {
                document.querySelector('#btnAudio').src = `../../assets/voices1.mp3`;
              } else {
                document.querySelector('#btnAudio').src = `../../assets/voices2.mp3`;
              }
              document.querySelector('#btnAudio').play();


        const marked = document.querySelector(".marked-for-exchange");
        if (marked) {
          // document.querySelector(".commit-btn").classList.remove("button-disabled")
          document.querySelector(".cancel-btn").classList.remove("button-disabled")
        } else {
          // document.querySelector(".commit-btn").classList.add("button-disabled")
          document.querySelector(".cancel-btn").classList.add("button-disabled")
        }
      } else {
        console.log('exchange === false');
        if (selectedLetter) {
          selectedLetter.classList.remove('letter-selected')
          if (selectedLetter != event.target) {
            event.target.classList.add('letter-selected');
            selectedLetter = event.target
          } else {
            event.target.classList.remove('letter-selected')
            selectedLetter = null;
          }
        } else {
          event.target.classList.add('letter-selected');
          selectedLetter = event.target
        }

      }

    } else {

  const current = parseInt(document.querySelector("#dashboard").dataset.current);
      const currentUserName = document.querySelectorAll(".name-score")[current].querySelector(".player").innerHTML
      alert (`It's ${currentUserName}'s turn. You can rearrange your tiles while you wait.`);
    }
  }

  document.querySelectorAll(".my-tile").forEach(tile => {
    tile.addEventListener('click', toggleLetter)
  });


export { checkExchange, toggleLetter, placeLetter, chooseLetters, restoreLetters, setLetterValues, appendMyLetters, restoreListenersAtAccept, markLetters, unmarkLetters, checkJoker }

  import lettersJSON from './letters.json';

// import 'new_game.js';
// import Sortable from "sortablejs";
import { Sortable, MultiDrag, Swap, OnSpill, AutoScroll } from "sortablejs";

import '../components/board'


if (document.querySelector(".edit-page-identifier")) {

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

  let currentPlayer;
  // let gameForm;
  // let addedScore = 0;
  // remainingLetters = [];
  // let titleString = '';
  // let submitEscape = false;
  // let replacement;


  function chooseLetters() { // select my letters from available letters
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
    console.log("remainingLetters array ?", remainingLetters)

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

    const oldPlayer = document.querySelector('#dashboard').dataset.current;
    const numPlayers = document.querySelectorAll('name-score').length;
    let newPlayer = oldPlayer + 1 ;
    if (newPlayer > numPlayers -1) newPlayer = 0;

    const gId = document.querySelector(".edit-page-identifier").dataset.gameid
    const pId = document.querySelector(".edit-page-identifier").dataset.playerid
    const csrfToken = document.querySelector("[name='csrf-token']").content;

    const remainingData = { id: gId, my_letters: myLetters, remaining_letters: remainingLetters.toString(), current_player: newPlayer}
    const url  = `/games/${gId}`;
    console.log('url ', url);
    fetch(`/games/${gId}`, {
      method: 'PATCH',
      headers: {
        'X-CSRF-Token': csrfToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(remainingData)
    })

    console.log("myLetters ", myLetters)
    appendMyLetters(numNewLetters);
    }  // end if remainingLetters.length > 0
  }


  function restoreLetters () {
    if (!document.querySelector(".cancel-btn").classList.contains("button-disabled")) {
      document.querySelector(".cancel-btn").classList.add("button-disabled");
      if (exchange) {
        myLettersDiv.querySelectorAll('.marked-for-exchange').forEach( ltr => {
          ltr.classList.remove("marked-for-exchange");
          // ltr.addEventListener('click', toggleLetter);
        });

      } else {  // not in exchange mode
        document.querySelector(".commit-btn").classList.add("button-disabled");
        document.querySelector(".exchange-btn").classList.remove("button-disabled");
        document.querySelector('#exchange-btn').addEventListener('click', markLetters);
        myLettersDiv.querySelectorAll('.letter-disabled').forEach( ltr => {
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
      }
    });
  }





  function appendMyLetters(num) {

    let val;
    for (let d = 0; d < num; d++ ) {
      const ltr = Object.values(myLetters)[d];
      console.log("ltr ", ltr);
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
      console.log('tileHtml ' + tileHtml);
    }
  }

  function showMyLettersInit() {
    myLetters.splice(maxLetters)
    let val;
    myLetters.forEach((ltr, index) => {

    Array.from(lettersJSON.letters).forEach( l => {
      if (l[ltr]) {
       val = l[ltr].value;
      }
    });
    // use multiple bg images in tiles
    let bgClass = ``;
    const leading  = currentBg < 10 ? "0" : "";
    bgClass = `tile` + leading + (currentBg + 1).toString();
    currentBg ++ ;
    if (currentBg > numOfBgs - 1 ) currentBg = 0;

    const tileHtml = `<div class='my-tile ${bgClass}'><div class="my-letter">${ltr}</div><div class="my-value">${val}</div></div>`
      // setTimeout(addLetterDelayed, 800 + (360 * index), tileHtml)
    myLettersDiv.insertAdjacentHTML('beforeend', tileHtml);
    });

 const myLettersDiv = document.getElementById("my-letters");
    const min = myLettersDiv.getBoundingClientRect().height
    // console.log(min);
    myLettersDiv.style = `min-height: ${min}px;`
  }

  function toggleLetter() {
    const thisUser = document.querySelector(".this-user");
    if (thisUser.parentNode.classList.contains("player-selected")) {  // current user's turn
      if (exchange == true) {
        event.currentTarget.classList.toggle('marked-for-exchange');
        const marked = document.querySelector(".marked-for-exchange");
        if (marked) {
          // document.querySelector(".commit-btn").classList.remove("button-disabled")
          document.querySelector(".cancel-btn").classList.remove("button-disabled")
        } else {
          // document.querySelector(".commit-btn").classList.add("button-disabled")
          document.querySelector(".cancel-btn").classList.add("button-disabled")
        }
      } else {
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
      const currentUserName = document.querySelectorAll(".name-score")[current].querySelector(".player").innerHTML
      alert (`It's ${currentUserName}'s turn. You can rearrange your tiles while you wait.`);
    }
  }

  document.querySelectorAll(".my-tile").forEach(tile => {
    tile.addEventListener('click', toggleLetter)
  });


export { chooseLetters, restoreLetters, setLetterValues, appendMyLetters, showMyLettersInit }

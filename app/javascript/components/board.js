import letters from './letters.json';

const board = () => {
  const editGame = document.querySelector(".edit-page-identifier");

  const showGame = document.querySelector(".show-page-identifier");

  const boardDiv = document.getElementById("board");
  const myLettersDiv = document.getElementById("my-letters");
  let myLetters = [];
  const maxLetters = 7;
  let selectedLetter = null;
  let allLetters = [];
  let buffer = [];
  let currentPlayer = "Dave";

    // element = this;

  if (editGame) {
   const form = document.getElementById("update-game")
    form.addEventListener("submit", sendAJAX )
    letters.letters.forEach( ltr => {
      const l = Object.keys(ltr)[0];
      const f = parseInt(Object.values(ltr)[0].frequency);
      for (let r = 0; r < f; r++) {
        allLetters.push(l);
      };
    });
  }

  if (editGame || showGame) {
    showScores();
  }

  let remainingLetters = allLetters;

  if (boardDiv) {
    let boardHtml = ``
    const arr = boardDiv.dataset.letterGrid.split(" ");
    arr.forEach(tile => {
      if (tile) {
        if (tile.trim() === "_") {
          tile = " ";
        } else {
          const i = remainingLetters.indexOf(tile);
          remainingLetters.splice(i, 1);
        }
        boardHtml += `<div class='tile'><div class="letter">${tile}</div></div>`
      }
    });
    boardDiv.insertAdjacentHTML('beforeend', boardHtml);

    document.querySelectorAll('.tile').forEach(tile => {
      if (tile.querySelector('.letter').innerHTML === " ") {
        tile.addEventListener('click', placeLetter);
      }
    });
  }

  if (myLettersDiv) {
    chooseLetters();
    showMyLettersInit();
    document.querySelector('#cancel-btn').addEventListener('click', restoreLetters);
    document.querySelector('#commit-btn').addEventListener('click', commitLetters);
  }


  function showScores() {
    const scores = document.querySelector("#scores").dataset.scores;

    const arr = scores.replaceAll(/\[|\]|\{|\}|\:|"/g, "").split(',');
    arr.forEach((player, index) => {
      const name = player.split("=>")[0];
      const score = parseInt(player.split("=>")[1]);
      let playerSelected = "";

       if (editGame) {
          const current = document.querySelector("#scores").dataset.current;
          console.log(current);
          if (current == index) {
            playerSelected = " player-selected"
          }
       }

      const nameScoreHtml = `<div class="name-score${playerSelected}"><div class="name">${name}</div><div class="score">${score}</div></div>`
      document.querySelector("#scores").innerHTML += nameScoreHtml;

    })

  }

  function placeLetter () {
    if (selectedLetter) {
      const txt = selectedLetter.querySelector('.my-letter').innerHTML
      event.target.querySelector('.letter').innerHTML = txt;
      event.target.querySelector('.letter').classList.add("letter-provisional");
      buffer.push(txt);
      selectedLetter.classList.add("letter-disabled");
      selectedLetter.removeEventListener('click', toggleLetter);
      selectedLetter = null;
    }
  }

  function chooseLetters() {

    while (myLetters.length < maxLetters ) {
      const ind = Math.floor(Math.random() * remainingLetters.length)
      const ran = remainingLetters[ind]
      myLetters.push(ran);
       // const ind = remainingLetters.indexOf(selectedLetter.querySelector('.my-letter').innerHTML);
      remainingLetters.splice(ind, 1);
    }
  }

  function restoreLetters () {
    myLettersDiv.querySelectorAll('.letter-disabled').forEach( ltr => {
      ltr.classList.remove("letter-disabled");
      ltr.classList.remove("letter-selected");
      ltr.addEventListener('click', toggleLetter);
    });
    document.querySelectorAll('.letter-provisional').forEach( ltr => {
      ltr.classList.remove("letter-provisional");
      ltr.innerHTML = "";
    });
    buffer = [];

        selectedLetter = null;
  }


  function commitLetters () {
    // const allTiles
     myLettersDiv.querySelectorAll('.letter-disabled').forEach( ltr => {
      const ind = myLetters.indexOf(ltr.querySelector(".my-letter").innerHTML);
      myLetters.splice(ind, 1);
      ltr.remove();
    });

      let addedScore = 0;
     document.querySelectorAll('.letter-provisional').forEach( ltr => {
      ltr.classList.remove("letter-provisional");
       Array.from(letters.letters).forEach( l => {
      // console.log(ltr.innerHTML)
      if (l[ltr.innerHTML]) {
       addedScore += parseInt(l[ltr.innerHTML].value);
      // console.log(l[ltr.innerHTML])
      }
      // ltr.innerHTML = "";

    });
     });

    // form.submit();




    let alertString = `${currentPlayer} added ${addedScore} `
    addedScore == 1  ? alertString += `point.` :  alertString += `points.`
    alert (alertString);



    buffer = [];
    selectedLetter = null;
    const num  =  maxLetters - myLetters.length;
    chooseLetters();
    appendMyLetters(num);
  }

  function sendAJAX () {

      console.log('form' + event.target);
     $.ajax({
        type: 'PATCH',
        url: event.target.url,
        data: event.target,
        dataType: 'JSON'
    }).done(function (data) {
        alert(data.notice);
    }).fail(function (data) {
        alert(data.alert);
    });



  }


  function appendMyLetters(num) {
    let val;
    for (let d = 0; d < num; d++ ) {
      const ltr = myLetters[d]
    Array.from(letters.letters).forEach( l => {
      if (l[ltr]) {
       val = l[ltr].value;
      }
    });
      const tileHtml = `<div class='my-tile'><div class="my-letter">${ltr}</div><div class="my-value">${val}</div></div>`
      setTimeout(addLetterDelayed, 900 + (360 * d), tileHtml)
    }
  }

  function addLetterDelayed(tileHtml) {
    // console.log('delayed' + thing)
      myLettersDiv.insertAdjacentHTML('beforeend', tileHtml);
      myLettersDiv.lastChild.addEventListener('click', toggleLetter);
  }

  function showMyLettersInit() {
    let val;
    myLetters.forEach((ltr, index) => {

    Array.from(letters.letters).forEach( l => {
      if (l[ltr]) {
       val = l[ltr].value;
      }
    });

    const tileHtml = `<div class='my-tile'><div class="my-letter">${ltr}</div><div class="my-value">${val}</div> </div>`
      setTimeout(addLetterDelayed, 800 + (360 * index), tileHtml)
    // myLettersDiv.insertAdjacentHTML('beforeend', tileHtml);
    });
    const min = myLettersDiv.getBoundingClientRect().height
    // console.log(min);
    myLettersDiv.style = `min-height: ${min}px;`
  }

  function toggleLetter() {
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

  document.querySelectorAll(".my-tile").forEach(tile => {
    tile.addEventListener('click', toggleLetter)
  });

}



export { board }

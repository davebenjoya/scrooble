import letters from './letters.json';

const board = () => {
  const boardDiv = document.getElementById("board");
  const myLettersDiv = document.getElementById("my-letters");
  let myLetters = [];
  const maxLetters = 7;
  let selectedLetter = null;
  let allLetters = [];
  let buffer = [];

   letters.letters.forEach( ltr => {

    const l = Object.keys(ltr)[0];
    const f = parseInt(Object.values(ltr)[0].frequency);

    for (let r = 0; r < f; r++) {
      allLetters.push(l);
    }

  });

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
    showScores();
    chooseLetters();
    showMyLetters();

    document.querySelector('#cancel-btn').addEventListener('click', restoreLetters)

  }


  function showScores() {
    const scores = document.querySelector("#scores").dataset;
    console.log(scores);


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
      ltr.classList.remove("letter-disabled")
      ltr.classList.remove("letter-selected")
      ltr.addEventListener('click', toggleLetter);
    });
    document.querySelectorAll('.letter-provisional').forEach( ltr => {
      ltr.classList.remove("letter-provisional");
      ltr.innerHTML = "";
    });
    buffer = [];
  }

  function showMyLetters() {
    myLetters.forEach(ltr => {
    const tileHtml = `<div class='my-tile'><div class="my-letter">${ltr}</div></div>`
    myLettersDiv.insertAdjacentHTML('beforeend', tileHtml);
    });
    const min = myLettersDiv.getBoundingClientRect().height
    console.log(min);
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

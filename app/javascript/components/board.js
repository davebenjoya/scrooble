import letters from './letters.json';

const board = () => {
  const boardDiv = document.getElementById("board");
  const myLettersDiv = document.getElementById("my-letters");
  let myLetters = []
  const maxLetters = 7
  let selectedLetter = null;
  let allLetters = []

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

      console.log(tile.querySelector('.letter').innerHTML == " ");
       if (tile.querySelector('.letter').innerHTML === " ") {
        tile.addEventListener('click', placeLetter);

       }
    });
  }

  if (myLettersDiv) {
    showScores();
    chooseLetters();
    showMyLetters();
  }

  function showScores() {
    const scores = document.querySelector("#scores").dataset;
    console.log(scores);


  }

  function placeLetter () {
    if (selectedLetter) {
      event.target.querySelector('.letter').innerHTML = selectedLetter.querySelector('.my-letter').innerHTML;
      const ind = remainingLetters.indexOf(selectedLetter.querySelector('.my-letter').innerHTML);
      remainingLetters.splice(ind, 1);
      selectedLetter.remove();
      selectedLetter = null;
    }
  }

  function chooseLetters() {

    while (myLetters.length < maxLetters ) {

      const ran = remainingLetters[Math.floor(Math.random() * remainingLetters.length)]
      myLetters.push(ran);
    }
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

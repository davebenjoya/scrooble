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
  let form;

    // element = this;

  if (editGame || showGame) {
    showScores();
    if (editGame) {
      form = document.getElementById("update-game")
      form.addEventListener("submit", sendAJAX )
    }
  }

  let remainingLetters = allLetters;

  if (boardDiv) {
    letters.letters.forEach( ltr => {
        const l = Object.keys(ltr)[0];
        const f = parseInt(Object.values(ltr)[0].frequency);
        for (let r = 0; r < f; r++) {
          allLetters.push(l);
        };
      });
    let boardHtml = ``
      console.log('boardDiv.dataset.letterGrid ' + boardDiv.dataset.letterGrid.length);
    if (boardDiv.dataset.letterGrid.length > 0) {
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
    } else {  // no existing letter grid, ie, a new game
      for (let n = 1; n < 226; n ++) {

          boardHtml += `<div class='tile'><div class="letter"> </div></div>`
      }

    }




    boardDiv.insertAdjacentHTML('beforeend', boardHtml);



     boardDiv.querySelectorAll('.letter').forEach((ltr, index) => {
        let nums = letters.tw.map(Number);
        const tripleWords = nums.filter(num => num == index + 1)
          if (tripleWords.length > 0) {
            ltr.parentNode.classList.add("triple-word");
          }
        nums = letters.dw.map(Number);
        const doubleWords = nums.filter(num => num == index + 1)
        if (doubleWords.length > 0) {
          ltr.parentNode.classList.add("double-word");
        }

        nums = letters.tl.map(Number);
        const tripleLetters = nums.filter(num => num == index + 1)
        if (tripleLetters.length > 0) {
          ltr.parentNode.classList.add("triple-letter");
        }


        nums = letters.dl.map(Number);
        const doubleLetters = nums.filter(num => num == index + 1)
        if (doubleLetters.length > 0) {
          ltr.parentNode.classList.add("double-letter");
        }



        });


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
            currentPlayer = name;
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


  function commitLetters () {  // ltrP = provisonal; ltrB = on board
    // const allTiles
      let adjToBoardTiles = false;
      let wordOrientation = null;
      document.querySelectorAll('.letter').forEach( (ltrP, indexP) => {
            if (ltrP.classList.contains("letter-provisional")) {
                    console.log ("indexP " + indexP);

              document.querySelectorAll('.letter').forEach( (ltrB, indexB) => {
                    // console.log ("ltrB.innerHTML " + ltrB.innerHTML.trim().length);
                    const notBlank = ltrB.innerHTML.trim().length > 0;
                    const notProv  = !ltrB.classList.contains("letter-provisional");
              if (notBlank && notProv) {
                    // console.log ('notBlank ', notBlank);
                    // console.log ("notProv ", notProv);
                if ( indexP == indexB + 1 || indexP == indexB - 1 || indexP == indexB + 15  || indexP == indexB - 15){
                    adjToBoardTiles = true;
                }
              }
            });
            }
      });

      if (adjToBoardTiles == false) {
        alert("New words must be include letters already on the board");
        restoreLetters();
      } else {
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



    const curr = document.querySelector("#scores").dataset.current;
    console.log('current' + curr);

    const scores = document.querySelector("#scores").dataset.scores;



    // form.submit();


    //  $.ajax({
    //     type: 'PATCH',
    //     url: event.target.url,
    //     data: event.target,
    //     dataType: 'JSON'
    // }).done(function (data) {
    //     alert(data.notice);
    // }).fail(function (data) {
    //     alert(data.alert);
    // });




    let alertString = `${currentPlayer} added ${addedScore} `
    addedScore == 1  ? alertString += `point.` :  alertString += `points.`
    alert (alertString);

    buffer = [];
    selectedLetter = null;
    const num  =  maxLetters - myLetters.length;
    chooseLetters();
    appendMyLetters(num);

      }

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

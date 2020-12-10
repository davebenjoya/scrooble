import lettersJSON from './letters.json';

const board = () => {
  const editGame = document.querySelector(".edit-page-identifier");

  const showGame = document.querySelector(".show-page-identifier");

  const boardDiv = document.getElementById("board");
  const scoresDiv = document.getElementById("scores");
  const myLettersDiv = document.getElementById("my-letters");
  let myLetters = [];
  const maxLetters = 7;
  let selectedLetter = null;
  let allLetters = [];
  let buffer = [];
  let currentPlayer = "Dave";
  let form;
  let addedScore = 0;
  let remainingLetters = [];
const titleString = document.querySelector("#dashboard").dataset.name;

document.querySelector("#navbar-game").insertAdjacentHTML('afterbegin',titleString)

    // console.log(document.querySelector("#scores"));
    const players = document.querySelector("#scores").dataset.players;
    const formattedStr = players.replaceAll("},", "}@@@").replaceAll("=>", ": ")
                        .replaceAll("[", "").replaceAll("]", "").replaceAll(" :" , " ")
                        .replaceAll("{:" , "{");
    const playersArray = formattedStr.split("@@@");
    let current = document.querySelector("#scores").dataset.current;

    // element = this;


  if (editGame || showGame) {
    showScores();
    if (editGame) {
      form = document.getElementById("update-game")
      // form.addEventListener("submit", sendAJAX )
    }
  }


  if (boardDiv) {
    lettersJSON.letters.forEach( ltr => {
        const l = Object.keys(ltr)[0];
        const f = parseInt(Object.values(ltr)[0].frequency);
        for (let r = 0; r < f; r++) {
          allLetters.push(l);
        };
      });
    remainingLetters = allLetters;
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
        let nums = lettersJSON.tw.map(Number);
        const tripleWords = nums.filter(num => num == index + 1)
          if (tripleWords.length > 0) {
            ltr.parentNode.classList.add("triple-word");
          }
        nums = lettersJSON.dw.map(Number);
        const doubleWords = nums.filter(num => num == index + 1)
        if (doubleWords.length > 0) {
          ltr.parentNode.classList.add("double-word");
        }

        nums = lettersJSON.tl.map(Number);
        const tripleLetters = nums.filter(num => num == index + 1)
        if (tripleLetters.length > 0) {
          ltr.parentNode.classList.add("triple-letter");
        }


        nums = lettersJSON.dl.map(Number);
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


const pickLetter = () => {   // using keyboard
  const tiles = Array.from(document.querySelectorAll(".my-tile"));
  tiles.reverse().forEach( tile => {
    if (tile.querySelector(".my-letter").innerHTML === event.key.toUpperCase()) {
      if (tile != selectedLetter && !tile.classList.contains("letter-disabled")) {
        if (selectedLetter) selectedLetter.classList.remove("letter-selected");
        tile.classList.add("letter-selected");
        selectedLetter =  tile;
      } else {
        tile.classList.remove("letter-selected");
        // selectedLetter =  null;

      }
    }
  });
}


  if (myLettersDiv) {
    document.addEventListener('keydown', pickLetter);
    console.log(myLetters);
    if (myLetters.length < 1 ) {  // myLetters has not been populated from DB
      chooseLetters();
    } else {

    }
      showMyLettersInit();
    document.querySelector('#cancel-btn').addEventListener('click', restoreLetters);
    document.querySelector('#commit-btn').addEventListener('click', commitLetters);
  }


  function showScores() {
    document.querySelector("#scores").innerHTML = ``
    playersArray.forEach((player, index) => {


      let playerSelected = "";
      let thisUser = "";

      const props = player.split(",");
      const name   = props[0].split(":")[1].replaceAll('"', '');

      const score   = parseInt(props[1].split(":")[1].replaceAll('"', ''));
      const playerLetters = props[2].split(":")[1].replaceAll(/[\"}]/g, '').trim();


      // console.log("document.querySelector('#scores').dataUsername " + document.querySelector('#scores').dataset.username);

      for (let x of playerLetters) {
        const k = remainingLetters.indexOf(x);
        remainingLetters.splice(k,1);

        if (name.trim() === document.querySelector('#scores').dataset.username.trim()) {
          myLetters.push(x);
          thisUser = " this-user"
        }

      }

       if (editGame) {
          if (current == index) {
            currentPlayer = name;
            playerSelected = " player-selected"  // add selected class to this player
          }
       }

      const nameScoreHtml = `<div class="name-score${playerSelected}"><div class="name${thisUser}">${name}</div><div class="score">${score}</div></div>`
      document.querySelector("#scores").innerHTML += nameScoreHtml;
    });

    document.querySelector(".this-user").parentNode.dataToggle= "tooltip";
      document.querySelector(".this-user").parentNode.title= "You!";

    document.querySelector(".player-selected").dataToggle= "tooltip";
    if (document.querySelector(".this-user").parentNode.classList.contains("player-selected")) {
      document.querySelector(".player-selected").title= "It's your turn!";

    } else {
      document.querySelector(".player-selected").title= "Current Player";
    }

  }

  function placeLetter () {
    console.log('placeLetter' + selectedLetter);
    if (selectedLetter) {
      const txt = selectedLetter.querySelector('.my-letter').innerHTML
      event.target.querySelector('.letter').innerHTML = txt;
      event.target.querySelector('.letter').classList.add("letter-provisional");
      buffer.push(txt);
      selectedLetter.classList.remove("letter-selected");
      selectedLetter.classList.add("letter-disabled");
      selectedLetter.removeEventListener('click', toggleLetter);
      selectedLetter = null;
    }
  }



  function chooseLetters() { // select my letters from available letters

    // console.log(remainingLetters.length);
    while (myLetters.length < maxLetters ) {
      const ind = Math.floor(Math.random() * remainingLetters.length)
      console.log(ind);
      const ran = remainingLetters[ind]
      myLetters.push(ran);
       // const ind = remainingLetters.indexOf(selectedLetter.querySelector('.my-letter').innerHTML);
      remainingLetters.splice(ind, 1);
    }
    // console.log(remainingLetters.length);
    console.log ("_____________________")
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

  function checkOrientation(arr){
    if (arr.length > 1 ) {
      let topRow =[]
      let leftColumn = []

      for (let k = 0; k < 15; k++) {
       topRow.push(k);
       leftColumn.push(k * 15);
      }

      const tile1Column = arr[0] % 15
      let tile1Row = 0
      leftColumn.forEach(num => {
        if  (arr[0] >= num + 15) {
          tile1Row ++
        }
      });
      const tile2Column = arr[1] % 15
      let tile2Row = 0
      leftColumn.forEach(num => {
        if  (arr[1] >= num + 15) {
          tile2Row ++
        }
      });
      if (tile1Column == tile2Column) return "vertical";
      if (tile1Row == tile2Row) return "horizontal";
    }
  }


  function commitLetters () {  // ltrP = provisonal; ltrB = on board
    const firstTwoProvisionals = [];
    let adjToBoardTiles = null;
    let wordOrientation = null;

    /////////////  V A L I D A T I O N /////////////////////////////////////////

    //  check that at least one letter is adjacent to existing tiles
    document.querySelectorAll('.letter').forEach( (ltrP, indexP) => {
      if (ltrP.classList.contains("letter-provisional")) {
      console.log("firstTwoProvisionals " + firstTwoProvisionals)
      if (firstTwoProvisionals.length < 2) firstTwoProvisionals.push(indexP);
        document.querySelectorAll('.letter').forEach( (ltrB, indexB) => {
          const notBlank = ltrB.innerHTML.trim().length > 0;
          const notProv  = !ltrB.classList.contains("letter-provisional");
          if (notBlank && notProv) {
            if ( indexP == indexB + 1 || indexP == indexB - 1 || indexP == indexB + 15  || indexP == indexB - 15){
              adjToBoardTiles = true;
            }
          }
        });
      }

    });

    //    check orientation if more than one new letter, otherwise assign "neutral"
    wordOrientation = firstTwoProvisionals.length > 1 ? checkOrientation(firstTwoProvisionals) :  "neutral";

    //////////////////////////////////// end validation ///////////////////////////////


    if (!wordOrientation) {
      alert("New words must be in a single row or column.");
      restoreLetters();
    } else if (!adjToBoardTiles) {
      alert("New letters must be adjacent to existing letters.");
      restoreLetters();
    } else {
      ///  pass orientation and first letter to caluclateScore
      // console.log("firstTwoProvisionals " + firstTwoProvisionals);
      calculateScore(wordOrientation, firstTwoProvisionals[0]);
      ////// remove used letters from myLetters
      myLettersDiv.querySelectorAll('.letter-disabled').forEach( ltr => { // 'disabled' means it's been placed on the board
        const ind = myLetters.indexOf(ltr.querySelector(".my-letter").innerHTML);
        myLetters.splice(ind, 1);
        ltr.remove();
      });
      buffer = [];
      selectedLetter = null;
      const num  =  maxLetters - myLetters.length;
      // pick new letters
      chooseLetters();
      // append new letters to my letters
      appendMyLetters(num);
    }

    let newGrid = ""
    document.querySelectorAll('.letter').forEach(ltr => {
      if (ltr.innerHTML.trim() === "") {
        newGrid += "_";
      } else {
        newGrid += ltr.innerHTML;
      };
      newGrid += " ";
    });

    current ++
    if (current > playersArray.length - 1) current = 0

    const me = playersArray.filter(player => player.includes(document.querySelector('#scores').dataset.username.trim()));


    const oldLetters = me[0].split(",")[2].replaceAll(/current_letters:|\"|\}/g, "" ).trim();
    const oldScore =  parseInt(me[0].split(",")[1].replaceAll(/score:|\"/g, "" ));
    const newScore = oldScore + addedScore;

    let newLetters = "";
    myLetters.forEach(letter => {
      newLetters += letter
    })

    const newMe =  Object.values(me)[0].replace(oldScore, newScore).replace(oldLetters, newLetters);


    console.log('me  ' + me);
    console.log('newMe  ' + newMe);

    const oldPlayers = players.replaceAll(":", "").replaceAll(/=>/g, ": ");


    const newPlayers = oldPlayers.replace(me, newMe);

    console.log('newPlayers  ', newPlayers);

    // document.querySelector('#update-players').value = newPlayers;
    document.querySelector('#update-grid').value = newGrid;
    document.querySelector('#update-current').value = current;



    // form.submit();
  }


const findHorizontalWord = (firstProvisional) => {
  let allPositions = [];
  for (let b = firstProvisional -1; b >= (firstProvisional - (firstProvisional % 15 )); b --) { // from first provisional letter to left edge
    if (document.querySelectorAll('.letter')[b].innerHTML != " ") {  //a character to the left?
      allPositions.unshift(b);
    } else {  // blank tile to the left
      break;
    }
  } ;
  console.log('allPositions ' + allPositions);
  for (let c = firstProvisional; c < firstProvisional + (15 - (firstProvisional % 15 )); c ++ ) { // from first provisional letter to right edge
    if (document.querySelectorAll('.letter')[c].innerHTML != " " && (c + 1) % 15 != 0) {  //a character to the right and not in last column
      allPositions.push(c);
    } else {  // blank tile to the right
      break;
    }
  };
  return allPositions;
}


const findVerticallWord = (firstProvisional) => {
  console.log('firstProvisional ' + firstProvisional);
  let allPositions = [];
  for (let b = firstProvisional -15; b >= 0 ; b --) { // from first provisional letter to top edge
    if (document.querySelectorAll('.letter')[b].innerHTML != " ") {  //a character to the top?
      allPositions.unshift(b);
    } else {  // blank tile to the top
      break;
    }
  } ;
  console.log('allPositions ' + allPositions);
  for (let c = firstProvisional; c < 225; c += 15 ) { // from first provisional letter to bottom edge
    if (document.querySelectorAll('.letter')[c].innerHTML != " " && (c + 1) % 15 != 0) {  //a character to the bottom and not in last column
      allPositions.push(c);
    } else {  // blank tile to the bottom
      break;
    }
  };
  return allPositions;

}



  const calculateScore = (wordOrientation, firstProvisional) => {  // score for one word
    addedScore = 0;
    const tileDivs = document.querySelectorAll('.tile')
    const letterDivs = document.querySelectorAll('.letter')
    const provDivs = document.querySelectorAll('.letter-provisional')
    let firstLetterPosition = firstProvisional
    let lastLetterPosition = firstProvisional
    let wordMultiplier = 1;
    let newWord = "";
    let bonusString = ``;
    let horizontalWords = [];
    let verticalWords = [];
    let positions = []

        //////////////  H O R I Z O N T A L   W O R D   /////////////////////////////////
    if (wordOrientation == 'horizontal' || wordOrientation == 'neutral') {
      positions  =  findHorizontalWord(firstProvisional);
    } else {
      positions = findVerticallWord(firstProvisional);
    }

    firstLetterPosition = positions[0];
    lastLetterPosition = positions[positions.length - 1]

    //  append new word
    positions.forEach(position => {
      const ltr = letterDivs[position].innerHTML;
      newWord += ltr;

      // assign base value
      Array.from(lettersJSON.letters).forEach( (l , index) => {
        if (Object.keys(l).toString() === ltr) {
          let val =  parseInt(Object.values(Object.values(l)[0])[1]); // value is second property in embedded object
          console.log('val  ' + val);

          if (tileDivs[position].classList.contains("double-letter") && letterDivs[position].classList.contains("letter-provisional")) {
            val *= 2;
            if (bonusString.length > 0) bonusString += `; `;
            bonusString += ` ${ltr} Double Letter Score = ${val}`;
            console.log("double letter");
          }
          if (tileDivs[position].classList.contains("triple-letter") && letterDivs[position].classList.contains("letter-provisional")) {
            val *= 3;
            if (bonusString.length > 0) bonusString += `; `;
            bonusString += ` ${ltr} Triple Letter Score = ${val}`;
            console.log("triple letter");
          }
          if (tileDivs[position].classList.contains("double-word") && letterDivs[position].classList.contains("letter-provisional")) {
            wordMultiplier *= 2;
            console.log("double word");
          }
          if (tileDivs[position].classList.contains("triple-word") && letterDivs[position].classList.contains("letter-provisional")) {
            wordMultiplier *= 3;
            console.log("triple word");
          }

          addedScore += val;
          letterDivs[position].classList.remove("letter-provisional");
        }


      });
    });

    switch (wordMultiplier) {
      case 2:
       if (bonusString.length > 0) bonusString += `; `;
            bonusString += `Double Word Score`;
      break;
      case 3:
       if (bonusString.length > 0) bonusString += `; `;
            bonusString += `Triple Word Score`;
      break;
      case 4:
       if (bonusString.length > 0) bonusString += `; `;
            bonusString += ` Oh my god, 2 Double Word Scores.`;
      break;
      case 9:
       if (bonusString.length > 0) bonusString += `; `;
            bonusString += `Jesus Fucking Christ!! 2 Triple Word Scores!!!!!`;

      break
    }

    addedScore *= wordMultiplier;

    let alertString = `${currentPlayer} added ${addedScore} `
    alertString += addedScore === 1  ? `point.` :  `points.`
    alertString += `${bonusString}`
    alert (alertString);

    if (selectedLetter ) {
      selectedLetter.classList.remove('letter-selected')
      selectedLetter = null;
    }
    const num  =  maxLetters - myLetters.length;
      // pick new letters
      chooseLetters();
      // append new letters to my letters
      appendMyLetters(num);
      // console.log ('myLetters.length' + myLetters.length);
    // nextPlayer();
  }



  const nextPlayer = () => {
    current ++
    if (current > playersArray.length - 1) current = 0;
    // showScores();
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
    Array.from(lettersJSON.letters).forEach( l => {
      if (l[ltr]) {
       val = l[ltr].value;
      }
    });
      const tileHtml = `<div class='my-tile'><div class="my-letter">${ltr}</div><div class="my-value">${val}</div></div>`
      setTimeout(addLetterDelayed, 900 + (300 * d), tileHtml)
      // setTimeout(nextPlayer, 900 + (300 * num));
      addLetterDelayed(tileHtml);
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

    Array.from(lettersJSON.letters).forEach( l => {
      if (l[ltr]) {
       val = l[ltr].value;
      }
    });

    const tileHtml = `<div class='my-tile'><div class="my-letter">${ltr}</div><div class="my-value">${val}</div> </div>`
      // setTimeout(addLetterDelayed, 800 + (360 * index), tileHtml)
    myLettersDiv.insertAdjacentHTML('beforeend', tileHtml);
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

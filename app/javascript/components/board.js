import lettersJSON from './letters.json';
// import 'new_game.js';
// import Sortable from "sortablejs";
import { Sortable, MultiDrag, Swap, OnSpill, AutoScroll } from "sortablejs";

const board = () => {
  const newGame = document.querySelector(".new-page-identifier");
  const editGame = document.querySelector(".edit-page-identifier");
  const showGame = document.querySelector(".show-page-identifier");
  const boardDiv = document.getElementById("board");
  const scoresDiv = document.getElementById("scores");
  const myLettersDiv = document.getElementById("my-letters");

  let exchange = false;
  let jokers = '';
  let jokerTile  = null;

  let current =  ``;
  let form  = document.querySelector("form");
  let playersArray;
  let players = ``;
  let realWord = true;

  let boardHasLetters = false;

  let myLetters = [];
  const maxLetters = 7;
  const maxPlayers = 4;
  let selectedLetter = null;
  let allLetters = [];
  let buffer = [];
  let currentPlayer = "Dave";
  // let form;
  let addedScore = 0;
  let remainingLetters = [];
  let titleString = '';
  let submitEscape = false;
  let replacement;


  lettersJSON.letters.forEach( ltr => {
    const l = Object.keys(ltr)[0];
    const f = parseInt(Object.values(ltr)[0].frequency);
    for (let r = 0; r < f; r++) {
      allLetters.push(l);
    };
  });
remainingLetters = allLetters;



  if (newGame){
    document.querySelector("#new-game-btn").addEventListener('click', createNewGame)
    document.addEventListener("keyup", () => {
      switch (event.key) {
        case "Enter":
          createNewGame();
          break;
      }
    })
  }


if (editGame) {
  const targetNode = document.querySelector("#messages");

  let observer = new MutationObserver(callback);
  function callback (mutations) {
    console.log ("playersArray " + typeof playersArray);
    const newStr = document.querySelector("#messages").innerHTML;
    console.log ("newStr " + newStr);
    const newObj = new Object(newStr);
    console.log ("newObj " + newObj);
    playersArray = newObj;
  }


  let observerOptions = {
    childList: true,
    characterData: true
  };

  observer.observe(targetNode, observerOptions);

}
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
/////////////////////////      CREATE NEW GAME      //////////////////////////
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////


  function createNewGame () {


    lettersJSON.letters.forEach( ltr => {
        const l = Object.keys(ltr)[0];
        const f = parseInt(Object.values(ltr)[0].frequency);
        for (let r = 0; r < f; r++) {
          allLetters.push(l);
        };
      });
    remainingLetters = allLetters;
    let opponentArray = []
    // remainingLetters = allLetters
    let newPlayers  = []
    const firstPlayer = createPlayerString (document.querySelector("#players").dataset.username);
    newPlayers.push(firstPlayer);
    document.querySelectorAll(".opponent").forEach( oppo => {
     if (oppo.querySelector("input").checked) {
      const entry  =`${oppo.querySelector(".opponent-name").innerText},${oppo.querySelector(".opponent-name").dataset.email}`;
      const newPlayer = createPlayerString (oppo.querySelector(".opponent-name").innerText);

      newPlayers.push(newPlayer);
      opponentArray.push(oppo.querySelector(".opponent-name").innerHTML)
     }
    });
   if (newPlayers.length > maxPlayers || newPlayers.length < 2) {
    alert ("Pick 1 – 3 opponents")
   } else {
    const newArray = Object.entries(newPlayers);
    console.log('opponentArray ' +  Object.values(opponentArray));
    document.querySelector("#new-opponents").value  = Object.values(opponentArray);

    document.querySelector("#new-players").value = `${Array.from(newPlayers)}`;
    if (document.querySelector("#game-name").value) {
      document.querySelector("#new-name").value = document.querySelector("#game-name").value
    } else {
      const d = new Date();
      const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d);
      const mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d);
      const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d);
      const ho = new Intl.DateTimeFormat('en', { hour: 'numeric', hour12: false }).format(d);
      const mi = new Intl.DateTimeFormat('en', { minute: '2-digit' }).format(d);
      const wk = new Intl.DateTimeFormat('en', { weekday: 'short' }).format(d);
      console.log(`${da}-${mo}-${ye}`);

      document.querySelector("#new-name").value = `${wk}, ${da} ${mo}, ${ho}:${mi}`
    }
    // document.querySelector("#new-name").value = document.querySelector("#game-name").value
    console.log(document.querySelector("#new-name").value);
    document.querySelector("form").submit();


   }
  }

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////


  function createPlayerString (name) {
    console.log("remaining  " + remainingLetters);

    let ltrStr = '';
    myLetters = []
      chooseLetters();
      myLetters.forEach(ltr => {
        ltrStr += ltr;
      })
    return new Object(`{'name': '${name}', 'score': '0', 'current_letters': ${ltrStr}}`)

  }



  if (editGame || showGame) {
    players = document.querySelector("#scores").dataset.players;

    // console.log('document.querySelector("#dashboard").dataset.name  ' + document.querySelector("#dashboard").dataset.name)
    const formattedStr = players.replaceAll("} {", "}@@@{")
                                .replaceAll("},", "}@@@")
                                .replaceAll("=>", ": ")
                                .replaceAll(" :" , " ")
                                .replaceAll("{:" , "{");
    playersArray = formattedStr.split("@@@");

    const updateUrl = document.querySelector("#dashboard").dataset.url;
    // console.log('playersArray ' + typeof playersArray)
    const sortable = Sortable.create(myLettersDiv, {
      animation: 600,
      // easing: "cubic-bezier(1, 0, 0, 1)",
      ghostClass: "sortable-ghost", // Class name for the drop placeholder
      chosenClass: "sortable-chosen", // Class name for the chosen item
      dragClass: "sortable-drag"
    })
    current = document.querySelector("#scores").dataset.current;

    // element = this;

  if (document.querySelector("#dashboard").dataset) titleString = document.querySelector("#dashboard").dataset.name;

    document.querySelector("#navbar-game").insertAdjacentHTML('afterbegin',titleString)

    // console.log('playersArray [0]  '+ playersArray[0])
    showScores();
    if (editGame) {
      form = document.getElementById("update-game")
      // form.addEventListener("submit", updatePlayers);
      // form.addEventListener("submit", sendAJAX )

    }
  }


  if (boardDiv) {
    $("#exampleModalCenter").on('shown.bs.modal', function(){
      // console.log('submitEscape   ' + submitEscape)
      if (submitEscape === true) {
        document.querySelector("#replace-joker").focus();
        document.querySelector("#replace-joker").addEventListener('input', validateJoker)
       } else {
        $("#close-modal-btn").focus();
       }
      });

    $("#exampleModalCenter").on('hidden.bs.modal', function(){
        if (submitEscape === true) {
          replacement = document.querySelector("#replace-joker").value.toUpperCase();
          jokerTile.querySelector('.letter').innerHTML = replacement;
          jokerTile.querySelector(".board-value").innerHTML = "0";
          jokerTile.querySelector('.letter').classList.add("letter-provisional");
          jokerTile.classList.add("joker-replaced");
          buffer.push(replacement);
          selectedLetter.classList.remove("letter-selected");
          selectedLetter.classList.add("letter-disabled");
          selectedLetter.removeEventListener('click', toggleLetter);
          document.querySelector('.commit-btn').classList.remove("button-disabled");
          document.querySelector('.cancel-btn').classList.remove("button-disabled");
          document.querySelector('.mark-btn').classList.add("button-disabled");
          selectedLetter = null;
          submitEscape = false;
        } else {
          form.submit();
        }
      });


  function validateJoker () {
      const val = document.querySelector("#replace-joker").value;
      if (!val.match(/[a-zA-Z]/)) {
        alert ("Enter a letter to replace Joker");
      } else {
        document.querySelector("#close-modal-btn").focus();
      }

  }

setupBoard()




function setupBoard() {


    let boardHtml = ``
      // console.log('boardDiv.dataset.letterGrid ' + boardDiv.dataset.letterGrid.length);
    if (boardDiv.dataset.letterGrid.length > 0) {  //  edit existing grid
      const arr = boardDiv.dataset.letterGrid.split(" ");
      let boardVal = ""


      arr.forEach((tile, index) => {
        if (tile) {
          if (tile.trim() === "_") {
            tile = " ";
            boardVal = " "
          } else {


            boardHasLetters = true;
            const i = remainingLetters.indexOf(tile);
            remainingLetters.splice(i, 1);
            Array.from(lettersJSON.letters).forEach( l => {
              if (l[tile]) {
                 boardVal = l[tile].value;
              }    });

          }
          boardHtml += `<div class='tile tile-hide'><div class="letter">${tile}</div><div class="board-value">${boardVal}</div></board-v></div>`
        }
      });
    } else {  // no existing letter grid, ie, a new game
      for (let n = 1; n < 226; n ++) {

          boardHtml += `<div class='tile tile-hide'><div class="letter"> </div></div>`
      }

    }



    boardDiv.insertAdjacentHTML('beforeend', boardHtml);

    setTimeout(function() {
    document.querySelector("#board").classList.remove("board-hide");
    document.querySelector("#dashboard").classList.remove("dashboard-hide");
        document.querySelectorAll('.tile-hide').forEach(tile => {
  tile.classList.add("tile-show");

    }, 500);
});


    boardDiv.querySelectorAll('.letter')[112].parentNode.classList.add("center-tile");
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


      const jays = document.querySelector("#dashboard").dataset.jokers
      if (jays.length > 0) {
        const jArray = jays.split(',');
        jArray.forEach(jkr => {
          const jokerPos = parseInt(jkr)
          console.log('document.querySelectorAll(".tile") ' + document.querySelectorAll(".tile").length)
          if (jokerPos) {
            document.querySelectorAll(".tile")[jokerPos].classList.add("joker-replaced");
            document.querySelectorAll(".tile")[jokerPos].querySelector(".board-value").innerHTML="0"

          }
        })
      }


}

const pickLetter = () => {   // using keyboard
  if (submitEscape === false ) {  // replace joker dialogue not visible
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

  } else { // replace joker dialogue visible
  if (event.key === "Enter") {
    // commitLetters();
  };

  }
}


  if (myLettersDiv) {
    document.addEventListener('keydown', pickLetter);
    // console.log(myLetters);
    if (myLetters.length < 1 ) {  // myLetters has not been populated from DB
      chooseLetters();
    } else {

    }
      showMyLettersInit();
    document.querySelector('#cancel-btn').addEventListener('click', restoreLetters);
    document.querySelector('#commit-btn').addEventListener('click', commitLetters);
    document.querySelector('#mark-btn').addEventListener('click', markLetters);
  }

  function markLetters(){
    const thisUser = document.querySelector(".this-user");
    if (thisUser.parentNode.classList.contains("player-selected")) {
      document.querySelector('#mark-btn').classList.add("mark-btn-active");
      document.querySelector('#commit-btn').classList.remove("button-disabled");
      exchange = true;
      document.querySelector('#mark-btn').removeEventListener('click', markLetters);
      document.querySelector('#mark-btn').addEventListener('click', unmarkLetters);

      if (selectedLetter) {
        selectedLetter.classList.remove('letter-selected')
        selectedLetter = null;
      }

    }

  }

  function unmarkLetters() {
    document.querySelectorAll(".marked-for-exchange").forEach( marked => {
      marked.classList.remove("marked-for-exchange");
    })
    document.querySelector('#mark-btn').classList.remove("mark-btn-active");
    document.querySelector('#commit-btn').classList.add("button-disabled");
    document.querySelector('#cancel-btn').classList.add("button-disabled");
    exchange = false;
    document.querySelector('#mark-btn').addEventListener('click', markLetters);
    document.querySelector('#mark-btn').removeEventListener('click', unmarkLetters);

  }


  function showScores() {
    document.querySelector("#scores").innerHTML = ``
    playersArray.forEach((player, index) => {
      let playerSelected = "";
      let thisUser = "";
      const props = player.split(",");

      const name   = props[0].split(":")[1].replaceAll('"', '').replaceAll("'", "").trim();

      const score   = props[1].split(":")[1].replaceAll('"', '').replaceAll(/\'/g, "");
      const playerLetters = props[2].split(":")[1].replaceAll(/\}/g, '').replaceAll(/\"|\'/g, "").trim()
      // props[2].split(":")[1].replaceAll(/[\"}]/g, '').replaceAll("'", "").trim();

      // console.log('props[2].split(":") '   + props[2]);
      if (playerLetters.length < maxLetters) {
        chooseLetters();
        // showMyLettersInit();
      }
      for (let x of playerLetters) {
        const k = remainingLetters.indexOf(x);

        remainingLetters.splice(k,1);

        if (name === document.querySelector('#scores').dataset.username.trim()) {
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

       const nameScoreHtml = `<div class="name-score${playerSelected}"><div class="name${thisUser}">${name}</div><div class="score">${parseInt(score)}</div></div>`

    // console.log('nameScoreHtml ' + nameScoreHtml);


      document.querySelector("#scores").innerHTML += nameScoreHtml;
    });
    console.log('document.querySelector(".this-user"). ' + document.querySelector(".this-user"))
    document.querySelector(".this-user").parentNode.dataToggle= "tooltip";
      document.querySelector(".this-user").parentNode.title= "You!";

    document.querySelector(".player-selected").dataToggle= "tooltip";
    if (document.querySelector(".this-user").parentNode.classList.contains("player-selected")) {
      document.querySelector(".player-selected").title= "It's your turn!";

    } else {
      document.querySelector(".player-selected").title= "Current Player";
    }


    const thisUser = document.querySelector(".this-user");
    if (thisUser.parentNode.classList.contains("player-selected")) {
      document.querySelector(".mark-btn").classList.remove("button-disabled");
    } else {
      document.querySelector(".mark-btn").classList.add("button-disabled");

    }

  }

  function placeLetter () {
    if (!exchange) {
      document.querySelector('#mark-btn').removeEventListener('click', markLetters);
      document.querySelector('#mark-btn').classList.add('button-disabled');
      if (selectedLetter) {
        let txt = selectedLetter.querySelector('.my-letter').innerHTML
        let val = selectedLetter.querySelector('.my-value').innerHTML;

        if (txt === "*") {
            const replacement = `Replace Joker with: <input id="replace-joker" maxlength = 1 type=text required>`
            document.querySelector(".modal-body").innerHTML = replacement;
            jokerTile = event.target;
            submitEscape = true;
            // jokers.push(jokerTile);
            $('#exampleModalCenter').modal('show');
        } else {
          submitEscape = false;
          event.target.querySelector('.letter').innerHTML = txt;
          event.target.querySelector('.letter').classList.add("letter-provisional");
          buffer.push(txt);

          event.target.querySelector(".board-value").innerHTML = `${val}`;

          selectedLetter.classList.remove("letter-selected");
          selectedLetter.classList.add("letter-disabled");
          selectedLetter.removeEventListener('click', toggleLetter);
          document.querySelector('.commit-btn').classList.remove("button-disabled");
          document.querySelector('.cancel-btn').classList.remove("button-disabled");
          selectedLetter = null;
        }
      }
    }
  }


  function chooseLetters() { // select my letters from available letters

    // console.log(remainingLetters.length);
    while (myLetters.length < maxLetters ) {
      const ind = Math.floor(Math.random() * remainingLetters.length)
      // console.log(ind);
      const ran = remainingLetters[ind]
      myLetters.push(ran);
       // const ind = remainingLetters.indexOf(selectedLetter.querySelector('.my-letter').innerHTML);
      remainingLetters.splice(ind, 1);
    }
    // console.log(remainingLetters.length);
    // console.log ("_____________________")
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
        document.querySelector(".mark-btn").classList.remove("button-disabled");
        document.querySelector('#mark-btn').addEventListener('click', markLetters);
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

  function checkOrientation(arr){
    if (arr.length > 1 ) {
      let topRow =[]
      let leftColumn = []

      for (let k = 0; k < 15; k++) {
       topRow.push(k);
       leftColumn.push(k * 15);
      }

      const tile1Column = arr[0] % 15
      let tile1Row = 0;
      leftColumn.forEach(num => {
        if  (arr[0] >= num + 15) {
          tile1Row ++
        }
      });
      const tile2Column = arr[1] % 15
      let tile2Row = 0;
      leftColumn.forEach(num => {
        if  (arr[1] >= num + 15) {
          tile2Row ++
        }
      });
      if (tile1Column == tile2Column) return "vertical";
      if (tile1Row == tile2Row) return "horizontal";
    }
  }


  /////////////////////////////////////////////////////////////////
  ///////////        COMMIT or REPLACE LETTERS    /////////////////
  /////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////

  function commitLetters () {  // ltrP = provisonal; ltrB = on board
    if (exchange === true ) {  // exchange chosen letters
      document.querySelectorAll(".my-letter").forEach( (letter, index)=> {
        if (letter.parentNode.classList.contains("marked-for-exchange")) {
          myLetters.splice(myLetters.indexOf(letter.innerHTML), 1);
          remainingLetters.push(letter.innerHTML);
          letter.parentNode.remove();
        }
      });
      // console.log(maxLetters);
      // console.log(myLetters.length);
      const numToReplace = maxLetters - myLetters.length
      chooseLetters();
      appendMyLetters(numToReplace);

      populateRailsForm();
      form.submit()

      // showMyLettersInit();
       // for (let x of myLetters) {
       //  const k = remainingLetters.indexOf(x);

       //  remainingLetters.splice(k,1);
       //  }

    } else {  //  new word
      if (document.querySelector(".letter-provisional")) {
        const firstTwoProvisionals = [];
        let adjToBoardTiles = null;
        let wordOrientation = null;
        let needsToUseCenter = true;
        /////////////  V A L I D A T I O N /////////////////////////////////////////
        document.querySelectorAll('.letter').forEach( (ltrP, indexP) => {
          if (ltrP.classList.contains("letter-provisional")) {
          // console.log("ltrP.classList " + ltrP.classList)
            if (firstTwoProvisionals.length < 2) firstTwoProvisionals.push(indexP);
              if (boardHasLetters) {
                needsToUseCenter = false;
        //  check that at least one new letter is adjacent to existing tiles
                document.querySelectorAll('.letter').forEach( (ltrB, indexB) => {
                  const notBlank = ltrB.innerHTML.trim().length > 0;
                  const notProv  = !ltrB.classList.contains("letter-provisional");
                  if (notBlank && notProv) {
                    if ( indexP == indexB + 1 || indexP == indexB - 1 || indexP == indexB + 15  || indexP == indexB - 15){
                      adjToBoardTiles = true;
                    }
                  }
                });
              } else {
        // if this is the first move of the game, there are no letters on the board
                // needsToUseCenter = true
                adjToBoardTiles = true;
                if (ltrP.parentNode.classList.contains("center-tile")) {
                  needsToUseCenter = false;
                }

              }
            }
          });

        if (needsToUseCenter === true) {
          alert ("First word must use the center tile.")
          restoreLetters();
        } else {
        //    check orientation if more than one new letter, otherwise assign "neutral"
        wordOrientation = firstTwoProvisionals.length > 1 ? checkOrientation(firstTwoProvisionals) :  "neutral";

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

        }
        // updatePlayers();







        }


      }



    }

}
// end commitLetters



    //////////////////////////////////// end validation ///////////////////////////////






//    findHorizontalWord

const findHorizontalWord = (firstProvisional) => {
  let allPositions = [];
  for (let b = firstProvisional -1; b >= (firstProvisional - (firstProvisional % 15 )); b --) { // from first provisional letter to left edge
    if (document.querySelectorAll('.letter')[b].innerHTML != " ") {  //a character to the left?
      allPositions.unshift(b);
    } else {  // blank tile to the left
      break;
    }
  } ;
  // console.log('allPositions ' + allPositions);
  for (let c = firstProvisional; c < firstProvisional + (15 - (firstProvisional % 15 )); c ++ ) { // from first provisional letter to right edge
    if (document.querySelectorAll('.letter')[c].innerHTML != " " && (c + 1) % 15 != 0) {  //a character to the right and not in last column
      allPositions.push(c);
    } else {  // blank tile to the right
      break;
    }
  };
  return allPositions;
}

//    findVerticallWord

const findVerticallWord = (firstProvisional) => {
  // console.log('firstProvisional ' + firstProvisional);
  let allPositions = [];
  for (let b = firstProvisional -15; b >= 0 ; b -= 15) { // from first provisional letter to top edge
    if (document.querySelectorAll('.letter')[b].innerHTML != " ") {  //a character to the top?
      allPositions.unshift(b);
    } else {  // blank tile to the top
      break;
    }
  } ;
  // console.log('allPositions ' + allPositions);
  for (let c = firstProvisional; c < 225; c += 15 ) { // from first provisional letter to bottom edge
    if (document.querySelectorAll('.letter')[c].innerHTML != " " && (c + 1) % 15 != 0) {  //a character to the bottom and not in last column
      allPositions.push(c);
    } else {  // blank tile to the bottom
      break;
    }
  };
  return allPositions;

}

//    calculateScore

  const calculateScore = (wordOrientation, firstProvisional) => {  // score for one word

              // console.log("jokers " + typeof jokers);
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


    letterDivs.forEach( (letter, index) => {
      if (letter.parentNode.classList.contains("joker-replaced")) {
        jokers += `${index.toString()},`;
      }
    });

    const jokersTrimmed = jokers.slice(0, jokers.length -1)

    console.log("jokersTrimmed " + jokersTrimmed);

    jokers = jokersTrimmed;


    if (wordOrientation == 'horizontal' || wordOrientation == 'neutral') {
      positions  =  findHorizontalWord(firstProvisional);
    } else {
      positions = findVerticallWord(firstProvisional);
    }
    // console.log('positions ' + positions);
    let contiguous  = true;
    letterDivs.forEach((letterDiv, index) => {
     if (letterDiv.classList.contains("letter-provisional")) {
        if (!positions.includes(index)) {
          contiguous = false;
        };
     };
    });

    if (contiguous === false) {
      alert ("All letters must be contiguous!");
      restoreLetters();
    } else {
    firstLetterPosition = positions[0];
    lastLetterPosition = positions[positions.length - 1]
    newWord = "";
    //  append new word
    positions.forEach(position => {
      const ltr = letterDivs[position].innerHTML;
      console.log(letterDivs[position].parentNode)
      newWord += ltr;


      // assign base value


      // console.log(ltr.parentNode)


      Array.from(lettersJSON.letters).forEach( (l , index) => {
        if (Object.keys(l).toString() === ltr) {
          console.log(`tileDivs[position].querySelector(".my-value") ` + tileDivs[position].parentNode.querySelector(".my-value"));
          let val =  parseInt(Object.values(Object.values(l)[0])[1]); // value is second property in embedded object

          if (tileDivs[position].classList.contains("joker-replaced")) val = 0;
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
        }
      });
    });
//const calculateScore
    searchDictionary(newWord).then (word => {
      if (word.error === "Not Found") {
        restoreLetters();
        alert (`${newWord} is not a real word.`);
      } else {
        document.querySelectorAll(".letter-provisional").forEach(pro => pro.classList.remove("letter-provisional"));
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
          break;
        }

        addedScore *= wordMultiplier;

        let alertString = `${currentPlayer} added ${addedScore} `
        alertString += addedScore === 1  ? `point.` :  `points.`
        alertString += `${bonusString}`
        let tileString = ``


        let val

        for (let char of newWord) {
          console.log (' char  ',  char)
//const calculateScore
        Array.from(lettersJSON.letters).forEach( l => {
          if (l[char]) {
           val = l[char].value;
          }
        });
        // if (pro.classList.contains("joker-replaced")) {
        //   val = 0;
        //   console.log("joker-replaced ")
        // }
        tileString += `<div class="my-tile"><div class="my-letter">${char}</div><div class="my-value">${val}</div> </div>`
        }
        const newWordTiles = `<span class='row pl-3'>${tileString}</span>`

        document.querySelector(".modal-body").innerHTML = newWordTiles + alertString;
        $('#exampleModalCenter').modal('show');

        if (selectedLetter ) {
          selectedLetter.classList.remove('letter-selected')
          selectedLetter = null;
        }
        // const num  =  maxLetters - myLetters.length; // how many tiles need to be replaced?
        // chooseLetters();
        // appendMyLetters(num);

      myLettersDiv.querySelectorAll('.letter-disabled').forEach( ltr => { // 'disabled' means it's been placed on the board
        const ind = myLetters.indexOf(ltr.querySelector(".my-letter").innerHTML);
        myLetters.splice(ind, 1);
        ltr.remove();
      });
      buffer = [];
      selectedLetter = null;
      const numToReplace  =  maxLetters - myLetters.length;
      chooseLetters();
      appendMyLetters(numToReplace);


    //const calculateScore
    populateRailsForm();

    }
  });
  }
}

function populateRailsForm() {
console.log('jokers ' +  jokers)

       document.querySelector("#update-jokers").value = jokers;

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
      const meIndex = playersArray.indexOf(me.toString());
      const oldLetters = me[0].split(",")[2].replaceAll(/current_letters:|\"|\}/g, "" ).replace(/'current_letters': /, "").trim();
      // const oldScore =  parseInt(me[0].split(",")[1].replaceAll(/score:|\"/g, "" ));
      const oldScore =  me[0].split(",")[1].replaceAll(/\'score\':|\"/g, "" ).replaceAll(/\'/g, "" );
      const newScore = parseInt(oldScore.replaceAll("'", "")) + addedScore;

      let newLetters = "'";
      myLetters.forEach(letter => {
        newLetters += letter
      })
      newLetters += "'"

      const newMe =  Object.values(me)[0].replace(oldScore.toString().trim(), newScore.toString().trim()).replace(oldLetters, newLetters);
      playersArray[meIndex] = newMe;
      const oldPlayers = players.replaceAll(":", "").replaceAll(/=>/g, ": ");

      let newPlayersStr = "";

      playersArray.forEach(player => {
      console.log('player  ' + player)
        const playerAddQuotes = player.toString()
        .replace("name","'name'")
        .replace("score","'score'")
        .replace("current_letters","'current_letters'")
        .replaceAll(/\'\'+/g, "'");

        // const playerAddQuotes = JSON.stringify(player);
        const obj = new Object(playerAddQuotes);
        // console.log('playerAddQuotes ' + playerAddQuotes);
        newPlayersStr += playerAddQuotes;
      });

      // newPlayersStr += "]"

      const newPlayers = newPlayersStr.replaceAll("}{", "}, {").replaceAll(/\'\'+/g, "'").replaceAll( /\"/g, "'");
      console.log('newPlayers ' +  newPlayers);
      document.querySelector('#update-players').value = newPlayers;
      document.querySelector('#update-grid').value = newGrid;
      document.querySelector('#update-current').value = current;




}

//////////////////////////////////////////////////////////////////////////////
//////////////////////// SEARCH DICTIONARY API ///////////////////////////////
///////////////////////      FOR NEW WORD      ///////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

/// url contains "@@@" which will be replaced with search term
const url = "https://api.wordnik.com/v4/word.json/@@@/definitions?limit=3&includeRelated=false&sourceDictionaries=all&useCanonical=false&includeTags=false&api_key=bws5w0ajrmgaqjxopiobxgwa1sr5cg78y8gzhgeqhrrp10le9";

async function searchDictionary (keyword)  {
  const newUrl = url.replace("@@@", keyword).toLowerCase();
  const response = await fetch(newUrl);
  const word = await response.json();
  return word;
}

////////////////////////////////////////////////////////////////////////////



  function appendMyLetters(num) {
      console.log('appendMyLetters ' + num);
    let val;
    for (let d = 0; d < num; d++ ) {
      const ltr = myLetters[d]
      Array.from(lettersJSON.letters).forEach( l => {
      if (l[ltr]) {
       val = l[ltr].value;
      }
    });
      const tileHtml = `<div class='my-tile'><div class="my-letter">${ltr}</div><div class="my-value">${val}</div></div>`
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

    const tileHtml = `<div class='my-tile'><div class="my-letter">${ltr}</div><div class="my-value">${val}</div></div>`
      // setTimeout(addLetterDelayed, 800 + (360 * index), tileHtml)
    myLettersDiv.insertAdjacentHTML('beforeend', tileHtml);
    });
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
      const currentUserName = document.querySelectorAll(".name-score")[current].querySelector(".name").innerHTML
      alert (`It's ${currentUserName}'s turn.`);
    }
  }

  document.querySelectorAll(".my-tile").forEach(tile => {
    tile.addEventListener('click', toggleLetter)
  });

}



export { board }

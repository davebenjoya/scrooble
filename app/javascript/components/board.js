import lettersJSON from './letters.json';
// import 'new_game.js';
// import Sortable from "sortablejs";
import { Sortable, MultiDrag, Swap, OnSpill, AutoScroll } from "sortablejs";
import   pLetters  from './player_letters'

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

  let current =  0;
  let newGameForm = document.querySelector("#new-game");
  let newPlayerForm =  document.querySelector("#new-player");
  let gameForm  = document.querySelector("#update-game");
  let playerForm  = document.querySelector("#update-player");
  let playersArray;
  let players = [];
  let realWord = true;

  let boardHasLetters = false;

  let myLetters = [];
  let maxLetters = 7;
  const maxPlayers = 4;
  let selectedLetter = null;
  let buffer = [];

  let currentPlayer;
  // let gameForm;
  let addedScore = 0;
  let remainingLetters = [];
  let titleString = '';
  let submitEscape = false;
  let replacement;

  // tile background images
  const numOfBgs = 6;
  let currentBg = 0;




  if (newGame){
    document.querySelectorAll(".toggle-stats").forEach(stat => {
      stat.addEventListener('click', function() {
        stat.parentNode.parentNode.querySelector(".stats").classList.toggle("stats-show");
        stat.parentNode.parentNode.querySelector(".stats-mask").classList.toggle("stats-mask-show");
        stat.parentNode.parentNode.querySelector(".stats-text").classList.toggle("stats-text-show");
        stat.parentNode.parentNode.querySelector(".stats-btn").classList.toggle("stats-btn-rotate");

      })
    })
    setTimeout( function() {
      newGame.classList.add("new-page-identifier-show");
    }, 200)
    // newGame.classList.add("new-page-identifier-show")
    document.querySelector("#new-game-btn").addEventListener('click', createNewGame)
    document.addEventListener("keyup", () => {
      switch (event.key) {
        case "Enter":
          createNewGame();
          break;
      }
    })
  }



//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

  if (editGame) {

// save order of player's letters on leaving page
    window.onbeforeunload = function(){
  // return 'Are you sure you want to leave?';
};

    // remainingLetters = document.querySelector("#dashboard").dataset.remaining;
    document.querySelector("#scores").addEventListener('click', function() {
      document.querySelector("#scores").classList.toggle("scores-show");
      // document.querySelector(".fa-arrow-circle-left").classList.toggle("arrow-btn-rotate");
    })
    currentPlayer = document.querySelector(".edit-page-identifier").dataset.playername;
    const remain = (document.querySelector("#dashboard").dataset.remaining);
    remainingLetters =  remain.split(',').splice(1, remain.length - 1);
    console.log("remainingLetters  ", remainingLetters);
    playersArray = document.querySelectorAll(".name-score");
    const letters = document.querySelector("#my-letters").dataset.playerLetters;
    // console.log('letters ' + letters);
    for (const letter of letters) {
      myLetters.push(letter)
    }

    const updateUrl = document.querySelector("#dashboard").dataset.url;
    // console.log('playersArray ' + typeof playersArray)
    const sortable = Sortable.create(myLettersDiv, {
      animation: 600,
      // easing: "cubic-bezier(1, 0, 0, 1)",
      ghostClass: "sortable-ghost", // Class name for the drop placeholder
      chosenClass: "sortable-chosen", // Class name for the chosen item
      dragClass: "sortable-drag",

      onUpdate: function (/**Event*/evt) {
       reorderLetters()
      }
    })
    current = parseInt(document.querySelector("#scores").dataset.current);

    // element = this;

  if (document.querySelector("#dashboard").dataset) titleString = document.querySelector("#dashboard").dataset.name;
    const ps =  document.querySelector(".player-selected").querySelector(".player").innerText;
    const navbarString = `<div class='nav-emp'>${titleString}</div> <div class = 'navbar-player'>Up now:  <span class='nav-emp'>${ps}</span></div>`;

    document.querySelector("#navbar-game").insertAdjacentHTML('afterbegin', navbarString)

    // showScores();
  }

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
/////////////////////////      CREATE NEW GAME      //////////////////////////
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////


  function createNewGame () {


    let opponentArray = []
    let newPlayers  = []
    const firstPlayer = createPlayerString (document.querySelector("#players").dataset.username);
    newPlayers.push(firstPlayer);
    document.querySelectorAll(".opponent").forEach( oppo => {
     if (oppo.querySelector("input").checked) {
      const newPlayer = createPlayerString (oppo.querySelector(".opponent-name").innerText);
      // console.log('newPlayer: ' + newPlayer)

      newPlayers.push(newPlayer);
      opponentArray.push(oppo.querySelector(".opponent-name").innerHTML)
     }
    });

   if (newPlayers.length > maxPlayers || newPlayers.length < 2) {
    alert ("Pick 1 – 3 opponents")
   } else {
    // console.log('opponentArray ' +  Object.values(opponentArray));
    document.querySelector("#players").value  = Object.values(opponentArray);

    // document.querySelector("#players").value = `${Array.from(newPlayers)}`;
    if (document.querySelector("#game-name").value) {  // game name field is filled out
      document.querySelector("#new-name").value = document.querySelector("#game-name").value
    } else {    //  no name entered, use faker-generated name from dataset
      const myGameName = document.querySelector(".new-page-identifier").dataset.defaultName
      document.querySelector("#new-name").value = myGameName;
    }

    let opponentsArray = [];
    document.querySelectorAll(".opponent").forEach(opponent => {
      if (opponent.querySelector("input[type=checkbox]").checked) {
        opponentsArray.push(opponent.dataset.userid) ;
      }
    })

    document.querySelector('#new-opponents').value = opponentsArray;

    remainingLetters = [];

  // short letter list
    lettersJSON.short.forEach( ltr => {

  // standard letter list
  // lettersJSON.letters.forEach( ltr => {
    const l = Object.keys(ltr)[0];
    const f = parseInt(Object.values(ltr)[0].frequency);
    for (let r = 0; r < f; r++) {
      remainingLetters.push(l);
      };
    });

    console.log('opponentsArray', opponentsArray);

    let lettersArray = []
    for (let p = 0; p < opponentsArray.length + 1; p++ ) {
      let myString = "";
      for (let i = 0; i < maxLetters; i ++ ) {
        const pos = Math.floor(Math.random() * remainingLetters.length);
        console.log("pos " , pos );
        myString += remainingLetters[pos];
        remainingLetters.splice(pos, 1);
      }
      lettersArray.push(myString);
    }


    console.log('lettersArray' + typeof lettersArray);
    document.querySelector('#new-player-letters').value = lettersArray;
    document.querySelector('#new-remaining').value = remainingLetters;
    console.log("remainingLetters ", remainingLetters);
        newGameForm.submit();


   }
  }

  function createPlayerString (name) {
    console.log("name  " + name);

    let ltrStr = '';
    myLetters = []
      // chooseLetters();
      myLetters.forEach(ltr => {
        ltrStr += ltr;
      })
    return new Object(`{'name': '${name}', 'score': '0', 'current_letters': '${ltrStr}'}`)

  }

  function reorderLetters() {
   let oldLetters = ``;
    myLetters.forEach(letter => {
      oldLetters += letter
    })

    let newLetters = ``;
    document.querySelectorAll(".my-tile").forEach( tile => {
      newLetters += tile.querySelector(".my-letter").innerHTML;
    })

    // const newPlayers = players.replace(oldLetters, newLetters);
    // console.log("oldLetters " + oldLetters);
    // console.log("newLetters " + newLetters);
    document.querySelectorAll(".player").forEach(player => {
      if (player.classList.contains("this-user")) {
        console.log("player " + player.parentNode.id)
    // fetchReorder (player.parentNode.id, newLetters);

      }
      })
  }

  async function fetchReorder (playerId, newLetters ) {
    // const obj = Object.create(newPlayers);
    // const id = document.querySelector("#dashboard").dataset.id;
    // console.log(" newPlayers " + newPlayers);
    // console.log(" newPlayers " + newPlayers.slice(1, newPlayers.length-1));
    await fetch(`/players/${playerId}`, {
      credentials: 'include',
      method: 'PATCH',
      body: JSON.stringify({
      player_letters: newLetters
      }),
      headers: {
      "Content-type": "application/json; charset=UTF-8"
      }
    })
    .then(response => response.text())
    .then(text => console.log(text))
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
          document.querySelector('.exchange-btn').classList.add("button-disabled");
          selectedLetter = null;
          submitEscape = false;
        } else {
          gameForm.submit();
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

setupBoard();




function setupBoard() {
  console.log(' set up')

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

      if (document.querySelector("#dashboard")) {
        // console.log('document.querySelector("#dashboard").dataset.completed   ' ,  document.querySelector("#dashboard").dataset.completed);
      if (document.querySelector("#dashboard").dataset.completed == "false") {
        document.querySelector("#dashboard").classList.remove("dashboard-hide");
      }

      }
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

    let jays = "";
      jays = document.querySelector("#board").dataset.jokers
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
  const thisUser = document.querySelector(".this-user");
  if (thisUser) {
    if (thisUser.parentNode.classList.contains("player-selected")) {
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
    document.querySelector('#exchange-btn').addEventListener('click', markLetters);
    document.querySelector('#end-btn').addEventListener('click', endGame);
    if (document.querySelector(".this-user").parentNode.classList.contains("player-selected")) {
        document.querySelector('#exchange-btn').classList.remove('button-disabled');
    }
    // const thisUser = document.querySelector(".this-user");
    // console.log(' document.querySelector(".this-user")' , document.querySelector(".this-user"));
  }

  function endGame() {
    document.querySelector('#update-player-completed').value = true;
    populateRailsForm();
    gameForm.submit();
  }



  function markLetters(){
        document.querySelector('#exchange-btn').classList.add("exchange-btn-active");
        document.querySelector('#commit-btn').classList.remove("button-disabled");
        exchange = true;
        document.querySelector('#exchange-btn').removeEventListener('click', markLetters);
        document.querySelector('#exchange-btn').addEventListener('click', unmarkLetters);

        if (selectedLetter) {
          selectedLetter.classList.remove('letter-selected')
          selectedLetter = null;
        }
  }

  function unmarkLetters() {
    document.querySelectorAll(".marked-for-exchange").forEach( marked => {
      marked.classList.remove("marked-for-exchange");
    })
    document.querySelector('#exchange-btn').classList.remove("exchange-btn-active");
    document.querySelector('#commit-btn').classList.add("button-disabled");
    document.querySelector('#cancel-btn').classList.add("button-disabled");
    exchange = false;
    document.querySelector('#exchange-btn').addEventListener('click', markLetters);
    document.querySelector('#exchange-btn').removeEventListener('click', unmarkLetters);

  }


  function placeLetter () {
    if (!exchange) {
      document.querySelector('#exchange-btn').removeEventListener('click', markLetters);
      document.querySelector('#exchange-btn').classList.add('button-disabled');
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
          // event.target.style.backgroundImage = url('../images/tile01.jpg');
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
    // remainingLetters = document.querySelector("#dashboard").dataset.remaining.replaceAll(/\,/g,"");

          // console.log('remainingLetters : ', remainingLetters);

      if (remainingLetters.length > 0 ) {
        let maxLettersLocal = maxLetters
        if (remainingLetters.length < maxLettersLocal - myLetters.length) {
          maxLettersLocal = myLetters.length + remainingLetters.length;
        }
        while (myLetters.length < maxLettersLocal ) {
          const ind = Math.floor((Math.random() * remainingLetters.length));
          console.log('ind', ind);
          const ran = remainingLetters[ind];
          // .replaceAll('"', '').replaceAll(' ', '').replaceAll(/\[/g, '').replaceAll(/\]/g, '')
          console.log('ran ' + ran);

          myLetters.push(ran);
           // const ind = remainingLetters.indexOf(selectedLetter.querySelector('.my-letter').innerHTML);
          const beginString = remainingLetters.slice(0, ind);
          const endString = remainingLetters.slice(ind + 1);
          remainingLetters = beginString + endString;

        }

        // console.log(' my   letteerrrrs'  , myLetters);
        // console.log(remainingLetters.length);
        // console.log ("_____________________")

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
     // remainingLetters = document.querySelector("#dashboard").dataset.remaining.replaceAll(/\,/g,"");

    if (exchange === true ) {  // exchange chosen letters
     if (remainingLetters.length < maxLetters) {
      alert (`There are fewer than ${maxLetters} remaining, so they cannot be exchanged` )
      restoreLetters();
    } else {
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
      gameForm.submit()
    };

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
              // if (boardHasLetters) {
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

              // }
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
      // console.log(letterDivs[position].parentNode)
      newWord += ltr;


      // assign base value

      Array.from(lettersJSON.letters).forEach( (l , index) => {
        if (Object.keys(l).toString() === ltr) {
          // console.log(`tileDivs[position].querySelector(".my-value") ` + tileDivs[position].parentNode.querySelector(".my-value"));
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

        document.querySelector(".modal-body").innerHTML = newWordTiles + alertString;
        // $('#exampleModalCenter').modal('show');
        gameForm.submit();

    }
  });
  }
}

function populateRailsForm() {

      let newGrid = ""
      document.querySelectorAll('.letter').forEach(ltr => {
      if (ltr.innerHTML.trim() === "") {
        newGrid += "_";
      } else {
        newGrid += ltr.innerHTML;
      };
        newGrid += " ";
      });

      console.log(typeof playersArray + " playersArray " + playersArray)
      current ++
      if (current > playersArray.length - 1) current = 0


      let newLetters = "'";  // put in single quotes
      myLetters.forEach(letter => {
        newLetters += letter
      })
      newLetters += "'"


    const thisUser = document.querySelector(".this-user");
      const newScore = parseInt(thisUser.parentNode.querySelector('.score').innerHTML) + addedScore;



      //  PLAYER FORM (this player)
      document.querySelector('#update-letters').value = newLetters;
      console.log (" new score " + newScore);
      document.querySelector('#update-score').value = newScore.toString();
      //  GAME FORM

      let lettersString = '';

      console.log( " newGrid " + newGrid)
      document.querySelector('#update-grid').value = newGrid;
      document.querySelector('#update-current').value = current;
      document.querySelector('#update-jokers').value = jokers;
      let remainingArray = Object.values(remainingLetters);
      let remainingString = ""
      remainingArray.forEach( (letter, index ) => {
        remainingString += letter
        if (index < remainingArray.length -1 ) remainingString += ","
      })
      console.log("remainingString  ", remainingString);
      document.querySelector('#update-remaining').value = remainingString;
      if (remainingLetters.length < 1 && myLetters.length < 1) {
        console.log("_________________________ ")
        console.log(" ")
        console.log("all letters used ")
        console.log("  ")
        console.log("_________________________ ")
        document.querySelector('#update-letters').value = "";
        document.querySelector('#update-player-completed').value = true;
        document.querySelector('#update-completed').value = true;
      }
      // document.querySelector('#update-letters').value = JSON.stringify(myLetters);


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

    let val;
    for (let d = 0; d < num; d++ ) {
      const ltr = Object.values(myLetters)[d]
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

}



export { board }

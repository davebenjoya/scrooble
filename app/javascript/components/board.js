import lettersJSON from './letters.json';
import { validateLetters } from './validation'
// import { calculateScore, findHorizontalWord, findVerticallWord } from './scoring';
// import 'new_game.js';
// import Sortable from "sortablejs";
import { Sortable, MultiDrag, Swap, OnSpill, AutoScroll } from "sortablejs";
import   pLetters  from './player_letters'
// import   calculateScore  from './scoring';

const board = () => {
  // calculateScore();
  // scoring.somting();

  const newGame = document.querySelector(".new-page-identifier");
  const editGame = document.querySelector(".edit-page-identifier");
  const showGame = document.querySelector(".show-page-identifier");
  const boardDiv = document.getElementById("board");
  const scoresDiv = document.getElementById("scores");
  const myLettersDiv = document.getElementById("my-letters");
  const dash = document.querySelector("#dashboard");

  let exchange = false;
  let jokers = '';
  let jokerTile  = null;

  let current =  0;
  let newGameForm = document.querySelector("#new-game");
  let newPlayerForm = document.querySelector("#new-player");
  let gameForm = document.querySelector("#update-game");
  let playerForm = document.querySelector("#update-player");
  let playersArray;
  let players = [];
  let realWord = true;

  const clickSounds = ['m1', 'm2', 'm3', 'm4', 'm5', 'm6'];
  let currentClickSound = 0


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
    if (dash) {
    const remain = (document.querySelector("#dashboard").dataset.remaining.split(','));
    remainingLetters =  [];
    remain.forEach( ltr => {
      if (ltr.match(/[A-Z] | */) && ltr.length === 1 ) {
        remainingLetters.push(ltr) ;
      }
    });
    // console.log("remainingLetters  ", remainingLetters);
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

      titleString = document.querySelector("#dashboard").dataset.name;

    } else {  // there is no dashboard
    titleString = editGame.dataset.name;

    }
    current = parseInt(document.querySelector("#scores").dataset.current);

    // element = this;
  // if (document.querySelector("#dashboard").dataset) titleString = document.querySelector("#dashboard").dataset.name;
    const ps =  document.querySelector(".player-selected").querySelector(".player").innerText;
    const navbarString = `<span class="navbar-scores">${titleString} <i class="fas fa-arrow-down score-arrow"></i></span> <span class = 'navbar-player'><span class='nav-emp'>Up now: ${ps}</span> </span>`;

    document.querySelector("#navbar-game").innerHTML =  navbarString;


    document.querySelector(".navbar-scores").addEventListener('click', function() {
      console.log (' click arrow');
      document.querySelector("#scores").classList.toggle("scores-show");
      // console.log(document.querySelector("#scores"));
      document.querySelector(".score-arrow").classList.toggle("score-arrow-rotate");
    })
    document.querySelector("#scores").addEventListener('click', function() {
      console.log (' click scoreboard')
      document.querySelector("#scores").classList.toggle("scores-show");
      document.querySelector(".score-arrow").classList.toggle("score-arrow-rotate");
      })
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
    // lettersJSON.short.forEach( ltr => {

  // standard letter list
  lettersJSON.letters.forEach( ltr => {
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
    //  REMAINING STRING    !!!!!
      let remainingString = ""
      remainingLetters.forEach( (letter, index ) => {
        remainingString += letter
        if (index < remainingLetters.length -1 ) remainingString += ","
      })
    document.querySelector('#new-remaining').value = remainingString;
    // console.log("remainingLetters ", remainingLetters);
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
  if (dash) {
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
  if (window.confirm("Do you really want to quit the game?")) {
     document.querySelector('#update-player-completed').value = true;
    populateRailsForm();
    gameForm.submit();
  }
}

  function endGameConfirm() {
    alert("Are you sure you want to quit the game? ")
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
      if(event.target.querySelector('.letter').classList.contains("letter-provisional")) {
        event.target.querySelector('.letter').classList.remove("letter-provisional")
        let enableFlag = false;  // if player has more than one of the same letter, only enable one
        document.querySelectorAll(".letter-disabled").forEach (ltr => {
          if (event.target.querySelector('.letter').innerHTML === ltr.querySelector('.my-letter').innerHTML ) {
            if (enableFlag === false) {
              ltr.classList.remove("letter-disabled");
              ltr.addEventListener('click', toggleLetter);
              if (selectedLetter) selectedLetter.classList.remove("letter-selected")
              selectedLetter = null;
              enableFlag = true;
            }
          }
        })
        event.target.querySelector('.letter').innerHTML = "";
        event.target.querySelector('.board-value').innerHTML = "";
    } else {
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
            document.querySelector('#btnAudio').src = '../../assets/' + clickSounds[currentClickSound] + ".mp3";
            console.log(document.querySelector('#btnAudio').src);
            document.querySelector('#btnAudio').play();
            currentClickSound ++
            if (currentClickSound > clickSounds.length -1) currentClickSound = 0
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
  }

  function chooseLetters() { // select my letters from available letters
    if (remainingLetters.length > 0 ) {
      let maxLettersLocal = maxLetters
      if (remainingLetters.length < maxLettersLocal - myLetters.length) {
        maxLettersLocal = myLetters.length + remainingLetters.length;
      }
      while (myLetters.length < maxLettersLocal ) {
        const ind = Math.floor((Math.random() * remainingLetters.length));
        console.log('ind', ind);
        if (remainingLetters[ind] === ",") {
          console.log("commmmaaa")
          ind --;
        }
        const ran = remainingLetters[ind];
        myLetters.push(ran);
         // const ind = remainingLetters.indexOf(selectedLetter.querySelector('.my-letter').innerHTML);
        const endString = remainingLetters.slice(ind + 2);
        const beginString = remainingLetters.slice(0, ind);

        remainingLetters = beginString + endString;
      }
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


  /////////////////////////////////////////////////////////////////

  ///////////        COMMIT or REPLACE LETTERS    /////////////////

  /////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////

  function commitLetters () {
    if (exchange === true ) {  // exchange chosen letters
      commitExchange();
    } else {  //  new word
      const added = validateLetters();
      if (added) {
        addedScore = added[0];
        console.log('addedScoreaddedScore ' , addedScore );

      document.querySelector('#update-msg').value = added[1];
        populateRailsForm()
        gameForm.submit();
      } else {
        restoreLetters();
      }
    }
  }

function commitExchange() {
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
  }


////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////            ////////////////////////
////////////////| |/////////////////  POPULATE  ////////////////////////
////////////////| |/////////////////            ////////////////////////
//////////////\     ////////////////  RAILS     ////////////////////////
///////////////\   /////////////////            ////////////////////////
////////////////\ //////////////////  FORM      ////////////////////////
////////////////////////////////////            ////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

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
      console.log (" newScore " + newScore);
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
        if (letter != ",") {
          remainingString += letter
          if (index < remainingArray.length -1 ) remainingString += ",";
        }
      })
      // console.log("remainingString  ", remainingString);
      document.querySelector('#update-remaining').value = remainingString;
      if (remainingLetters.length < 1 && myLetters.length < 1) {
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



export {board}

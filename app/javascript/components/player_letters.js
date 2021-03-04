  import lettersJSON from './letters.json';
// import 'new_game.js';
// import Sortable from "sortablejs";
import { Sortable, MultiDrag, Swap, OnSpill, AutoScroll } from "sortablejs";

const pLetters = () => {
    const something = 12;

  function initP () {


    const editGame = document.querySelector(".edit-page-identifier");
    const myLettersDiv = document.getElementById("my-letters");
    let myLetters = [];
    let maxLetters = 7;
    let selectedLetter = null;


    let submitEscape = false;
    // let buffer = [];

    // let remainingLetters = [];

    let currentPlayer;

    if (editGame) {
     remainingLetters = document.querySelector("#dashboard").dataset.remaining.trim().split(",");


      const letters = document.querySelector("#my-letters").dataset.playerLetters.replace(",", "");
      console.log('letters ' + letters);
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

////////////////////////////////////////////////////////////




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

//////////////////////////////////////////////////


  function restoreOne() {
    let enableFlag = false;
    document.querySelectorAll('.letter-disabled').forEach(ltr => {
        if (ltr.querySelector('.my-letter').innerHTML == event.target.querySelector('.letter').innerHTML) {
      if (enableFlag == false) {   // only enable one letter
        event.target.querySelector('.letter').innerHTML = ""
          ltr.classList.remove('letter-disabled')
          enableFlag = true;
        }
      }
    })
  }


///////////////////////////////////////////////



  function commitLetters () {  // ltrP = provisonal; ltrB = on board
     remainingLetters = document.querySelector("#dashboard").dataset.remaining.split(",");

    let adjToBoardTiles = false;


    // hide selected tiles
    document.querySelectorAll(".letter-disabled").forEach( (letter)=> {

          letter.parentNode.style = "opacity: 0;";

      });


    if (exchange === true ) {  // exchange chosen letters
     if (remainingLetters.length < maxLetters) {
      alert (`There are fewer than ${maxLetters} remaining, so they cannot be exchanged` )
      restoreLetters();
    } else {
      document.querySelectorAll(".my-letter").forEach( (letter, index)=> {
        if (letter.parentNode.classList.contains("marked-for-exchange")) {
          myLetters.splice(myLetters.indexOf(letter.innerHTML), 1);
          remainingLetters += letter.innerHTML;
          letter.parentNode.remove();
        }
      });
      // console.log(maxLetters);
      const numToReplace = maxLetters - myLetters.length
      chooseLetters();
      appendMyLetters(numToReplace);
      populateRailsForm();
      // gameForm.submit()
    };

    } else {  //  new word
      // if (document.querySelector(".letter-provisional")) {
      console.log('myLetters.length  ', myLetters.length);
        const firstTwoProvisionals = [];
        let wordOrientation = null;
        let needsToUseCenter = true;

        /////////////  V A L I D A T I O N /////////////////////////////////////////


        document.querySelectorAll('.letter').forEach( (ltrP, indexP) => {
          // not first move -- center tile is already occupied and adjToBoardTiles set to false
          if (ltrP.innerHTML.trim() != "" && !ltrP.classList.contains("letter-provisional")) {
            needsToUseCenter = false;
            // adjToBoardTiles = false;
          }

          // find positions of first 2 provisionals to determine orientation of main word
          if (ltrP.classList.contains("letter-provisional")) {
            if (firstTwoProvisionals.length < 2) firstTwoProvisionals.push(indexP); // add first 2 to array
            if (boardHasLetters == true) {  // not first move of the game
              console.log (" NOT first move ")
              //  check that at least one new letter is adjacent to existing tiles
              document.querySelectorAll('.letter').forEach( (ltrB, indexB) => {
                const notBlank = ltrB.innerHTML.trim().length > 0;
                const notProv  = !ltrB.classList.contains("letter-provisional");
                if (notBlank && notProv) {
                  if ( indexP == indexB + 1 || indexP == indexB - 1 || indexP == indexB + 15  || indexP == indexB - 15){
                    console.log ("indexP ", indexP);
                    adjToBoardTiles = true;
                  }
                }
              });

            } else {
              // if this is the first move of the game, there are no letters on the board
              // needsToUseCenter = true
              console.log (" first move ")
              adjToBoardTiles = true;
              if (ltrP.parentNode.classList.contains("center-tile")) {
                needsToUseCenter = false;
              }
            }
            }
          });



        console.log ("adjToBoardTiles ", adjToBoardTiles);


        if (needsToUseCenter === true) {  // first move, not using center
          alert ("First word must use the center tile.")
          restoreLetters();
        } else { // first move using center or subsequent move
        //   check orientation if more than one new letter, otherwise assign "neutral"
          wordOrientation = firstTwoProvisionals.length > 1 ? checkOrientation(firstTwoProvisionals) :  "neutral";

          if (!wordOrientation) { // checkOrientation returns null, new letters in different rows and columns
            alert("New words must be in a single row or column.");
            restoreLetters();
          } else {  // wordOrientation != null
            if (adjToBoardTiles == false) {
              alert("New letters must be adjacent to existing letters.");
              restoreLetters();
            } else {
            ///  pass orientation and first letter to caluclateScore
            calculateScore(wordOrientation, firstTwoProvisionals[0]);
            }
          }
        }
      }
    }


/////////////////////////////////////////////////////

  function endGame() {
    document.querySelector('#update-player-completed').value = true;
    populateRailsForm();
    gameForm.submit();
  }







///////////////////////////////////////////////////





  function chooseLetters() { // select my letters from available letters

          console.log('myLetters.length : ', myLetters.length);

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

//////////////////////////////////////////////////////////
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
      const currentUserName = document.querySelectorAll(".name-score")[current].querySelector(".player").innerHTML
      alert (`It's ${currentUserName}'s turn. You can rearrange your tiles while you wait.`);
    }
  }

  document.querySelectorAll(".my-tile").forEach(tile => {
    tile.addEventListener('click', toggleLetter)
  });




//////////////////////////////////////////////////////////


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

 }

}

export default pLetters;



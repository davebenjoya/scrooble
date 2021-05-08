import './board'
import { firstWordCommit, wordsCommit } from './scoring';

  const validateLetters = () =>{
    let valid = true;
    let alertString = ``;
    let boardHasLetters = false;
    let addToScore = 0;
    document.querySelectorAll(".letter").forEach (ltr => {
      if (ltr.innerHTML.trim() != "" && ltr.classList.contains("letter-provisional") === false) {
        boardHasLetters = true;
      }
    })

    let provisonals =  []  // array of numbers, positons on the board
    document.querySelectorAll(".letter").forEach( (letter, index) => {
      if (letter.classList.contains("letter-provisional")) {
        provisonals.push(index)
      }
    })

    if (boardHasLetters === false && document.querySelector(".center-tile").querySelector(".letter").innerText.trim() === "") {
      alertString += `The center tile must be used in the first move of the game. `
      valid = false;
    }

    if (provisonals.length < 2 ) {
      if (boardHasLetters) {
        addToScore = secondTurnValidation();
        console.log(' addToScore 30', addToScore);
        return addToScore;
      } else {
        alertString += `First play must contain at two letters. `;
        valid = false;
      }
    } else {  // > 1 provisional tiles
      let row = sameRow(provisonals);
      let col = sameColumn(provisonals);
      if (row === false && col === false) {
        alertString += `All new tiles must be in a single row or column. `
        valid = false;
      } else {
        if (row) {
          if (horizContig(provisonals) === false ) {
            alertString += `No blank tiles between letters. `;
            valid = false;
          }
        } else { // column === true
          if (vertContig(provisonals) === false ) {
            alertString += `No blank tiles between letters. `;
            valid = false;
          }
        } // end if (row)
      }  //  end if (row === false && col === false)

      //   end if (provisonals.length < 2)
          console.log('valid  ', valid  )

      if (valid === true) {
        if (boardHasLetters === false) {
          addToScore =  firstWordCommit();
        } else {
          addToScore = secondTurnValidation();
          console.log('addToScore   63' , addToScore);
        }
      } else {
        alert (alertString);
      }
      return addToScore;
          }


  // const addToScore = boardHasLetters ? secondTurnValidation() : firstTurnValidation();
  // console.log(' addToScore   ' , addToScore);

  // return true;

  function firstTurnValidation() {
    if (document.querySelector(".center-tile").querySelector(".letter").innerHTML.trim() === "") {
      alertString += `The center tile must be used in the first move of the game. `
    }
    const added = firstWordCommit();
    console.log(' added   ' , added);
    return added;
  }

  function secondTurnValidation() { // check that at least one provisional tile is adjacent to a tile on the board
    let adjacentToBoardTiles = false;
    let nsew = [-15, 15, 1, -1]
    provisonals.forEach( prov => {
      nsew.forEach( tileDiff => {
        if (document.querySelectorAll(".letter")[prov + tileDiff]) {
          if (document.querySelectorAll(".letter")[prov + tileDiff].innerHTML.trim() != "" &&
              document.querySelectorAll(".letter")[prov  + tileDiff].classList.contains("letter-provisional") === false) {
            adjacentToBoardTiles = true;
          }
        }
      })
    })
    const added = wordsCommit();
    console.log(' added   ' , added);
    return added;
  }

  function sameRow(positionArray) {
    const firstInArray = positionArray[0]
    const firstInRow = firstInArray - (firstInArray % 15);
    const lastInRow =  firstInRow + 14
    let same = true;
    // console.log('firstinArray ', firstinArray);
    positionArray.forEach( n => {
      if (n < firstInRow || n > lastInRow ) {
        same =  false;
      }
    })
   return same;
  }


  function sameColumn(positionArray) {
    const firstInArray = positionArray[0]
    const columnModulo = firstInArray % 15;
    let same = true;
    positionArray.forEach((n, index) => {
      if (n  % 15 != columnModulo) {
        same =  false;
      }
    })
   return same;
  }

  function horizContig (positionArray) {
    const firstInArray = positionArray[0];
    const lastInArray = positionArray[positionArray.length-1];
    let contiguous = true;
    for (let p = firstInArray; p <= lastInArray; p++) {
      if (document.querySelectorAll(".letter")[p].innerHTML.trim() === "") {
        contiguous = false;
      }
    }
    return contiguous;
  }

  function vertContig (positionArray) {
    const firstInArray = positionArray[0];
    const lastInArray = positionArray[positionArray.length-1];
    let contiguous = true;
    for (let p = firstInArray; p <= lastInArray; p += 15) {
      if (document.querySelectorAll(".letter")[p].innerHTML.trim() === "") {
        contiguous = false;
      }
    }
    return contiguous;
  }
}

export  { validateLetters };

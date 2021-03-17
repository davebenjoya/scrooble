import { board } from './board';
import lettersJSON from './letters.json';


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





  const calculateScore = (wordOrientation, firstProvisional) => {  // score for one word

              // console.log("jokers " + typeof jokers);
    let addedScore = 0;
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
    let jokers = "";

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

        let alertString = `${board.currentPlayer} added ${addedScore} `
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

        if (board.selectedLetter ) {
          board.selectedLetter.classList.remove('letter-selected')
          board.selectedLetter = null;
        }
        // const num  =  maxLetters - myLetters.length; // how many tiles need to be replaced?
        // chooseLetters();
        // appendMyLetters(num);

      document.querySelectorAll('.letter-disabled').forEach( ltr => { // 'disabled' means it's been placed on the board
        const ind = board.myLetters.indexOf(ltr.querySelector(".my-letter").innerHTML);
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

const url = "https://api.wordnik.com/v4/word.json/@@@/definitions?limit=3&includeRelated=false&sourceDictionaries=all&useCanonical=false&includeTags=false&api_key=bws5w0ajrmgaqjxopiobxgwa1sr5cg78y8gzhgeqhrrp10le9";

async function searchDictionary (keyword)  {
  const newUrl = url.replace("@@@", keyword).toLowerCase();
  const response = await fetch(newUrl);
  const word = await response.json();
  return word;
}


// Exporting variables and functions
export default calculateScore;

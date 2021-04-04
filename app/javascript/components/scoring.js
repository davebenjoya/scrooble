
import lettersJSON from './letters.json';
 // const calculateNewWordScores = () =>{
  const provisionals = document.querySelectorAll(".letter-provisional");


  let addedScore = 0;
  let wordMultiplier = 1;
  let bonusString = ``;
  let wordArray = [];
  let totalAdded = 0;
  let scoreString = ``;


  function firstWordCommit() {
    console.log('firstWordCommit')
    let word = ``;
    document.querySelectorAll(".letter-provisional").forEach( ltr => {
      scoreTile(ltr)
      word += ltr.innerHTML
    });
    addedScore *= wordMultiplier * 2;
    bonusString += `First play double word score.`;
    const wordObj = Object.create({word: word, score: addedScore, bonus:bonusString});
    wordArray.push(wordObj);
    buildAlert();
    return [totalAdded, scoreString];
  }

  function wordsCommit() {
    console.log('wordsCommit')
  totalAdded = 0;
  wordMultiplier = 1;
  scoreString = ``;
  bonusString = ``;

   document.querySelectorAll(".letter").forEach( (ltr, index) => {
    if (ltr.classList.contains("letter-provisional")) {
      let vertFlag = false;
      let provs = 0
      let posArray = []
      let word = ``;
      let horAdjacent = checkHorAdj(index);
      if (horAdjacent) {
        posArray = findHorizontalWord(index)
      } else if (checkVertAdj(index)) { // no horizontal with this letter, check vertical
        vertFlag = true;
        posArray = findVerticallWord(index)
      }

      posArray.forEach( (pos, i) => {
        scoreTile(document.querySelectorAll(".letter")[pos])
        if (document.querySelectorAll(".letter")[pos].classList.contains("letter-provisional")) provs ++;
        word += document.querySelectorAll(".letter")[pos].innerHTML
      });

        console.log('worrrrd ' + word);
      // addedScore *= wordMultiplier
      if (provs === 1 || index === posArray[0] ) {
        const wordObj = Object.create({word: word, score: addedScore, bonus:bonusString});
        wordArray.push(wordObj);
      }
      if (vertFlag === false) {

        word = ``;
        addedScore = 0;
        bonusString = ``
        posArray = findVerticallWord(index);
        posArray.forEach( (pos, i) => {
          scoreTile(document.querySelectorAll(".letter")[pos])
          word += document.querySelectorAll(".letter")[pos].innerHTML
        });

        const wordObj2 = Object.create({word: word, score: addedScore, bonus:bonusString});
        wordArray.push(wordObj2);
      }

      };
    });
    // addedScore *= wordMultiplier * 2;
    // bonusString += `First play double word score.`;

    console.log("wordArray " , wordArray )
    buildAlert();

    return [totalAdded, scoreString];
    // return [20, "Multiple word and letter bonuses"];

  }

  function checkHorAdj(pos) {
    const posLeft = pos - 1;
    const posRight = pos + 1;
        console.log('document.querySelectorAll(".letter")[posRight].innerHTML.trim() ', document.querySelectorAll(".letter")[posRight].innerHTML.trim());
    if ( (document.querySelectorAll(".letter")[posLeft].innerHTML.trim() != "" && document.querySelectorAll(".letter")[posLeft].classList.contains("letter-provisional")=== false)
          || (document.querySelectorAll(".letter")[posRight].innerHTML.trim() != "" && document.querySelectorAll(".letter")[posRight].classList.contains("letter-provisional")=== false)) {
      return true
      }
    return false;
  }


  function checkVertAdj(pos) {
    const posAbove = pos - 15;
    const posBelow = pos + 15;
    if ( (document.querySelectorAll(".letter")[posAbove].innerHTML.trim() != "" && document.querySelectorAll(".letter")[posAbove].classList.contains("letter-provisional") === false)
          || (document.querySelectorAll(".letter")[posBelow].innerHTML.trim() != "" && document.querySelectorAll(".letter")[posBelow].classList.contains("letter-provisional") === false)) {
      return true
      }
    return false;
  }

  function buildAlert() {
    const name = document.querySelector('.nav-emp').innerText.split(":")[1].trim();
    scoreString = `${name} scored `;
    console.log("wordArray " , wordArray )
    wordArray.forEach( word => {
      totalAdded += word.score;
      console.log("totalAdded " , totalAdded )
      const s = word.score != 1 ? `s` : ``;
      scoreString += `${word.score} point${s} for ${word.word}. ${word.bonus}`
    });
    if (wordArray.length > 1 ){
      const t = totalAdded != 1 ? `s` : ``;
      scoreString += `Total ${totalAdded} point${t}.`
    }
    alert(scoreString);
  }

  function scoreTile(ltr) {

    let val =  parseInt(ltr.parentNode.querySelector(".board-value").innerHTML)

    if (ltr.closest(".tile").classList.contains("double-letter") && ltr.classList.contains("letter-provisional")) {
      val *= 2;
      if (bonusString.length > 0) bonusString += `. `;
      bonusString += ` ${ltr.innerHTML} Double Letter Score = ${val}. `;
      console.log('bonusString', bonusString);
    }
    if (ltr.closest(".tile").classList.contains("triple-letter") && ltr.classList.contains("letter-provisional")) {
      val *= 3;
      if (bonusString.length > 0) bonusString += `. `;
      bonusString += ` ${ltr.innerHTML} Triple Letter Score = ${val}. `;
    }
    if (ltr.closest(".tile").classList.contains("double-word") && ltr.classList.contains("letter-provisional")) {
      wordMultiplier *= 2;
    }
    if (ltr.closest(".tile").classList.contains("triple-word") && ltr.classList.contains("letter-provisional")) {
      wordMultiplier *= 3;
    }

    addedScore += val;

  }

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


 // }

 export { firstWordCommit, wordsCommit }

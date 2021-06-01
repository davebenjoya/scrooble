
import lettersJSON from './letters.json';
 // const calculateNewWordScores = () =>{
  const provisionals = document.querySelectorAll(".letter-provisional");


  let wordMultiplier = 1;
  let bonusString = ``;
  let wordArray = [];
  let totalAdded = 0;
  let scoreString = ``;
  let wordScore = 0


function firstWordScore() {
  totalAdded = 0;
  wordArray = [];
  let word = ``;
  document.querySelectorAll(".letter-provisional").forEach( ltr => {
    scoreTile(ltr)
    word += ltr.innerHTML
  });
  wordScore *= wordMultiplier * 2;
  bonusString += `First play double word score.`;
  const wordObj = new Object({characters: word, score: wordScore, bonus:bonusString});
  wordArray.push(wordObj);
  console.log('wordObj ' , wordObj )
  buildAlert();
  return [totalAdded, scoreString, wordArray];
}

function wordsScore() {
  wordArray = [];
  wordMultiplier = 1;
  console.log('wordsScore');
  wordScore = 0
  totalAdded = 0;
  scoreString = ``;
  bonusString = ``;

   document.querySelectorAll(".letter").forEach( (ltr, index) => {
    if (ltr.classList.contains("letter-provisional")) {
      let vertFlag = false;
      let provsArray = []
      let posArray = []
      let word = ``;
      let horAdjacent = checkHorAdj(index);
      if (horAdjacent === true) {

        posArray = findHorizontalWord(index)
        console.log('posArray ' + posArray);
      } else if (checkVertAdj(index)) { // no horizontal with this letter, check vertical
        vertFlag = true;
        posArray = findVerticallWord(index)
        console.log('posArray'  , posArray)
      }
      posArray.forEach( (pos) => {
        scoreTile(document.querySelectorAll(".letter")[pos])
        if (document.querySelectorAll(".letter")[pos].classList.contains("letter-provisional")) {
          provsArray.push(pos);


        }
        word += document.querySelectorAll(".letter")[pos].innerText;
      });
      const trimmedWord = word.replaceAll(" ", "");
        console.log('trimmedWord ' + trimmedWord);
      // wordScore *= wordMultiplier
      if (index === provsArray[0] ) {
        if (trimmedWord.length > 1) {
          const wordObj = Object.create({characters: trimmedWord, score: wordScore, bonus:bonusString});
          wordArray.push(wordObj);
          console.log('wordScore '  , wordScore)

        }
      }
      if (vertFlag === false) {

        word = ``;
        wordScore = 0;
        bonusString = ``
        posArray = findVerticallWord(index);
        posArray.forEach( (pos, i) => {
          scoreTile(document.querySelectorAll(".letter")[pos])
          word += document.querySelectorAll(".letter")[pos].innerHTML
        });

        console.log(' wordScore ', wordScore);
        console.log(' index ', index);
      if (provsArray.length < 2 || index === provsArray[0] ) {
        console.log(' (wordArray.length ', wordArray.length);
        if (word.length > 1) {
          const wordObj2 = Object.create({word: word, score: wordScore, bonus:bonusString});
          wordArray.push(wordObj2);
        }
        }
      }

      };
    });

    buildAlert();
    return [totalAdded, scoreString, wordArray];

  }

  function checkHorAdj(pos) {
    const posLeft = pos - 1;
    const posRight = pos + 1;


    if (!document.querySelectorAll(".letter")[posLeft] || !document.querySelectorAll(".letter")[posRight] ) {
      return true;
    }

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

    if (!document.querySelectorAll(".letter")[posAbove] || !document.querySelectorAll(".letter")[posBelow] ) {
      return true;
    }

    if ( (document.querySelectorAll(".letter")[posAbove].innerHTML.trim() != "" && document.querySelectorAll(".letter")[posAbove].classList.contains("letter-provisional") === false)
          || (document.querySelectorAll(".letter")[posBelow].innerHTML.trim() != "" && document.querySelectorAll(".letter")[posBelow].classList.contains("letter-provisional") === false)) {
      return true
      }
    return false;
  }

  function buildAlert() {

  totalAdded = 0;
    bonusString = ``;
    const name = document.querySelector('.nav-emp').innerText.split(":")[1].trim();
    const ws = wordArray.length < 2 ? "" : "s"
    scoreString = `${name} is submitting the word${ws} `;
    console.log("wordArray " , wordArray )
    console.log("wordArray[0] " , wordArray[0] )
    wordArray.forEach( word => {
      totalAdded += word.score;
      const s = word.score != 1 ? `s` : ``;
      scoreString += `${word.characters} (${word.score} point${s}). ${word.bonus}`
    });
    if (wordArray.length > 1 ){
      const t = totalAdded != 1 ? `s` : ``;
      scoreString += `Total ${totalAdded} point${t}.`
    }

    const ownScore  = scoreString.replace(`${name} is`, `You are`);
    setTimeout(function() {
    alert(ownScore);

  }, 1000)
  }

  function scoreTile(ltr) {

    console.log(ltr)
    let val =  parseInt(ltr.parentNode.querySelector(".board-value").innerHTML)
    console.log(val)

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

    wordScore += val;
    console.log(wordScore)

  }

//    findHorizontalWord

const findHorizontalWord = (firstProvisional) => {
  let allPositions = [];
  for (let b = firstProvisional -1; b >= (firstProvisional - (firstProvisional % 15 )); b --) { // from first provisional letter to left edge
    if (document.querySelectorAll('.letter')[b].innerText.trim() != "") {  //a character to the left?
      allPositions.unshift(b);
    } else {  // blank tile to the left
      break;
    }
  } ;
  // console.log('allPositions ' + allPositions);
  for (let c = firstProvisional; c < firstProvisional + (15 - (firstProvisional % 15 )); c ++ ) { // from first provisional letter to right edge
    if (document.querySelectorAll('.letter')[c].innerText.trim() != "" && (c + 1) % 15 != 0) {  //a character to the right and not in last column
      allPositions.push(c);
    } else {  // blank tile to the right
    }
  };
  return allPositions;
}

//    findVerticallWord

const findVerticallWord = (firstProvisional) => {
  // console.log('firstProvisional ' + firstProvisional);
  let allPositions = [];
  for (let b = firstProvisional -15; b >= 0 ; b -= 15) { // from first provisional letter to top edge
    if (document.querySelectorAll('.letter')[b].innerText.trim() != "") {  //a character to the top?
      allPositions.unshift(b);
    } else {  // blank tile to the top
      break;
    }
  } ;
  // console.log('allPositions ' + allPositions);
  for (let c = firstProvisional; c < 225; c += 15 ) { // from first provisional letter to bottom edge
    if (document.querySelectorAll('.letter')[c].innerText.trim() != "" && (c + 1) % 15 != 0) {  //a character to the bottom and not in last column
      allPositions.push(c);
    } else {  // blank tile to the bottom
    }
  };
  console.log('allPositions', allPositions)
  return allPositions;

}


 // }

 export { firstWordScore, wordsScore }

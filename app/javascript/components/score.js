import lettersJSON from './letters.json';


const score = (tiles, provisionals, orientation, first) => {

  let wordMultiplier = 1;
  let bonusString = ``;
  let wordArray = [];
  let totalAdded = 0;
  let scoreString = ``;
  let wordScore = 0;
  const firstProv = provisionals[0]
  const lastProv = provisionals[provisionals.length -1]
  let allPositions = []

  // console.log('scoo ooo oooooore', provisionals, orientation, first)


  scorePrimaryWord(provisionals, orientation)

  if (first === false) {
    scoreSecondaryWords(provisionals, orientation)
  } else {
    wordScore *= wordMultiplier * 2;
    bonusString += `First play double word score.`;
  }

  buildAlert()


  return [totalAdded, scoreString, wordArray];


  ////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////   functions
  ////////////////////////////////////////////////////////

  function scorePrimaryWord(provisionals, orientation) {
    if (orientation === 'ver') {
      primaryVer(provisionals)
    } else {
      primaryHor(provisionals)
    }
    scoreWord()
  }

  function scoreWord() {
    let word = ``
    bonusString = ``
    wordScore = 0
    for (let pos of allPositions) {
      scoreTile(tiles[pos].querySelector('.letter'))
      word += tiles[pos].querySelector('.letter').innerHTML
    }
    if (word.length > 1) {
      const wordObj = new Object({characters: word, score: wordScore, bonus:bonusString});
      wordArray.push(wordObj)
    }
  }



  function primaryHor () {  // also called when orientation === 'none' (1 letter)
    // start with all letters from first to last provisional
    for (let k = firstProv.position; k <= lastProv.position; k++) {
      allPositions.push(k)
    }
    // then find how far to left and right word extends
    let leftNonProv = true
    let leftIndex = 1 // how many tiles to the left of the first provisional
    while (leftNonProv === true) {
      if (tiles[(parseInt(firstProv.position) - leftIndex)].querySelector('.letter').innerHTML != '') {
         allPositions.unshift(parseInt(firstProv.position) - leftIndex)
         leftIndex ++
      } else {
        leftNonProv = false
      }
    }

    let rightNonProv = true
    let rightIndex = 1 // how many tiles to the right of the last provisional
    while (rightNonProv === true) {
      if (tiles[(parseInt(lastProv.position) + rightIndex)].querySelector('.letter').innerHTML != '') {
         allPositions.push(parseInt(lastProv.position) + rightIndex)
         rightIndex ++
      } else {
        rightNonProv = false
      }
    }
    console.log('allPositions hor ' + allPositions)

  }

  function primaryVer () {
    // console.log('firstProv ', firstProv)
    // start with all letters from first to last provisional
    for (let k = firstProv.position; k <= lastProv.position; k+= 15) {
      allPositions.push(k)
    }
     // then find how far to top and bottom word extends
    let topNonProv = true
    let topIndex = 15 // how many tiles to the top of the first provisional
    if (tiles[(parseInt(firstProv.position) - topIndex)] != undefined) {
      while (topNonProv === true) {
        if (tiles[(parseInt(firstProv.position) - topIndex)].querySelector('.letter').innerHTML != '') {
           allPositions.unshift(parseInt(firstProv.position) - topIndex)
           topIndex += 15
        } else {
          topNonProv = false
        }
      }
    }

    let bottomNonProv = true
    let bottomIndex = 15 // how many tiles to the bottom of the last provisional
    while (bottomNonProv === true) {
      if (tiles[(parseInt(lastProv.position) + bottomIndex)].querySelector('.letter').innerHTML != '') {
         allPositions.push(parseInt(lastProv.position) + bottomIndex)
         bottomIndex += 15
      } else {
        bottomNonProv = false
      }
    }
  }



  function scoreSecondaryWords(provisionals, orientation) {
    for (let prov of provisionals) {
      allPositions = [prov.position] // start with single provisional
      orientation === 'ver' ? secondaryHor(prov) : secondaryVer(prov)
    }
  }


  function secondaryHor (prov) {

    //  find how far to left and right word extends
    let leftNonProv = true
    let leftIndex = 1 // how many tiles to the left of the first provisional
    while (leftNonProv === true) {
      if (tiles[(parseInt(prov.position) - leftIndex)].querySelector('.letter').innerHTML != '') {
         allPositions.unshift(parseInt(prov.position) - leftIndex)
         leftIndex ++
      } else {
        leftNonProv = false
      }
    }

    let rightNonProv = true
    let rightIndex = 1 // how many tiles to the right of the last provisional
    while (rightNonProv === true) {
      if (tiles[(parseInt(prov.position) + rightIndex)].querySelector('.letter').innerHTML != '') {
         allPositions.push(parseInt(prov.position) + rightIndex)
         rightIndex ++
      } else {
        rightNonProv = false
      }
    }
  }

  function secondaryVer (prov) {

     // find how far to top and bottom word extends
    let topNonProv = true
    let topIndex = 15 // how many tiles to the top of the provisional
    if (tiles[(parseInt(prov.position) - topIndex)] != undefined) {
    while (topNonProv === true) {
      if (tiles[(parseInt(prov.position) - topIndex)].querySelector('.letter').innerHTML != '') {
         allPositions.unshift(parseInt(prov.position) - topIndex)
         topIndex += 15
      } else {
        topNonProv = false
      }
    }



    }

    let bottomNonProv = true
    let bottomIndex = 15 // how many tiles to the bottom of the provisional

    if (tiles[(parseInt(prov.position) + bottomIndex)] != undefined) {
      while (bottomNonProv === true) {
        if (tiles[(parseInt(prov.position) + bottomIndex)].querySelector('.letter').innerHTML != '') {
           allPositions.push(parseInt(prov.position) + bottomIndex)
           bottomIndex += 15
        } else {
          bottomNonProv = false
        }
      }

    }

    if (allPositions.length > 1) {
      scoreWord()
    }
  }



  function buildAlert() {

    totalAdded = 0;
      bonusString = ``;
      const name = document.querySelector('.nav-emp').innerText.split(":")[1].trim();
      const ws = wordArray.length < 2 ? "" : "s"
      scoreString = `${name} is submitting the word${ws} `;
      // console.log("wordArray " , wordArray )
      // console.log("wordArray[0] " , wordArray[0] )
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

      // console.log(ltr)
      let val =  parseInt(ltr.parentNode.querySelector(".board-value").innerHTML)
      // console.log(val)

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

    }

}




export { score }

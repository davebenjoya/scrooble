
const submitLetters = () => {
  const tiles = document.querySelectorAll('.tile')
  let provisionals = []  // array of objects
  const firstMove = checkFirst()  // true if first move of the game
  console.log('firstMove ', firstMove)

  let orientation = "none"
  let valid = true

  buildProvisionals()
  if (provisionals.length < 2 ) {
    oneProvisional()
  } else {
    manyProvisionals()
  }

  return valid


  ///////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////


  function buildProvisionals() {
     for (let c = 0; c < tiles.length; c++) {
      if (tiles[c].querySelector('.letter-provisional')) {
        provisionals.push({char: tiles[c].querySelector('.letter-provisional').innerHTML, position: c})
      }
    }
  }

  function oneProvisional() {
    if (firstMove === true) {
      alert('First move must have more than one letter.')
      valid = false
    } else {
      if (checkAdjacent() === false) {
        alert('New Letters must be adjacent to existing letters.')
        valid = false
      } else {
        console.log('Adjacent letters.')
      }
    }
  }

  function manyProvisionals() {
      if (firstMove === true ) {
        if (checkCenter() === true) {
          console.log('center tile used')
        } else {
          alert('First move must use center tile.')
          valid = false
        }
      } else {
        if (checkAdjacent() === false) {
          alert('New Letters must be adjacent to existing letters.')
          valid = false
        } else {
          let row = sameRow();
          let col = sameColumn();
          if (row === false && col === false) {
            alert(`All new tiles must be in a single row or column.`)
            valid = false;
          } else {
            let contig = true
            const firstPos = provisionals[0].position;
            const lastPos = provisionals[provisionals.length-1].position;
            row === true ? orientation = 'hor': orientation = 'ver'
            orientation === 'hor' ? contig = horContig(firstPos, lastPos) : contig = verContig(firstPos, lastPos)
            if (contig === true) {
              console.log('all letters contiguous ')

            } else {
              alert('Not all letters are contiguous.')
              valid = false
            }
          }
          console.log('valid  ' , valid)
        }
      }
  }

  function checkFirst()    {
    let first = true
    document.querySelectorAll(".letter").forEach( ltr => {
      if (!ltr.classList.contains('letter-provisional') && ltr.innerHTML != '') {
        first = false
      }
    })
    return first
  }

/////////////////////////////////////////

  function checkAdjacent() {  // check that at least one provisional is adjacent to another letter
    let adj = false
    for (let ltr of provisionals) {
      const leftAdjacent = checkLeftAdjacent(ltr.position)
      const rightAdjacent = checkRightAdjacent(ltr.position)
      const topAdjacent = checkTopAdjacent(ltr.position)
      const bottomAdjacent = checkBottomAdjacent(ltr.position)
      if (leftAdjacent === true || rightAdjacent === true ||
        topAdjacent === true || bottomAdjacent === true) {
          adj = true
      }
    }
    return adj
  }

  function checkLeftAdjacent(position) {
    if (position % 15 === 0) {  // is provisional letter in first column?
      return false
    }
    return checkAdj(position - 1)
  }

  function checkRightAdjacent(position) {
    if ((position + 1) % 15 === 0) {  // is provisional letter in last column?
      return false
    }
    return checkAdj(position + 1)
  }

  function checkTopAdjacent(position) {
    if (position < 15) {  // is provisional letter in first row?
      return false
    }
    return checkAdj(position - 15)
  }

  function checkBottomAdjacent(position) {
    if (position  > 209 ) {  // is provisional letter in last row?
      return false
    }
    return checkAdj(position + 15)
  }

  function checkAdj(pos) {
    if (tiles[pos].querySelector('.letter').innerHTML != '' && tiles[pos].querySelector('.letter').classList.contains('letter-provisional') === false) {
      return true
    }
    return false
  }

////////////////////////////////////

  function sameRow() {
    const firstInArray = provisionals[0].position
    const firstInRow = firstInArray - (firstInArray % 15);
    const lastInRow =  firstInRow + 14
    let same = true;
    // console.log('firstinArray ', firstinArray);
    provisionals.forEach( n => {
      if (n.position < firstInRow || n.position > lastInRow ) {
        same =  false;
      }
    })
   return same;
  }

  function sameColumn() {
    const firstInArray = provisionals[0].position
    const columnModulo = firstInArray % 15;
    let same = true;
    provisionals.forEach((n, index) => {
      if (n.position  % 15 != columnModulo) {
        same =  false;
      }
    })
   return same;
  }


  function horContig (firstPos, lastPos) {
    let contiguous = true;
    for (let p = firstPos; p <= lastPos; p++) {
      if (document.querySelectorAll(".letter")[p].innerHTML.trim() === "") {
        contiguous = false;
      }
    }
    return contiguous;
  }

  function verContig (firstPos, lastPos) {
    let contiguous = true;
    for (let p = firstPos; p <= lastPos; p += 15) {
      if (document.querySelectorAll(".letter")[p].innerHTML.trim() === "") {
        contiguous = false;
      }
    }
    return contiguous;
  }

  function checkCenter() {
    let center = false
    for (let ltr of provisionals) {
      if (ltr.position === 112) center = true
    }
    return center
  }

}



export { submitLetters }

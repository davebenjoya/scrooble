import { initGameCable } from '../channels/game_channel'


/// url contains "@@@" which will be replaced with search term
const url = "https://api.wordnik.com/v4/word.json/@@@/definitions?limit=3&includeRelated=false&sourceDictionaries=all&useCanonical=false&includeTags=false&api_key=bws5w0ajrmgaqjxopiobxgwa1sr5cg78y8gzhgeqhrrp10le9";
// let valid = true;
// let returnStr = ``;
let promises = [];
  let wordString = ``;
  // let returnArray = []
  let valid = true;

async function searchDictionary (wordArray, moveId, playerName)  {
  let returnArray = [];
  let count = 0;
  wordString = ``;
  wordArray.forEach((word, index) => {
    const newUrl = url.replace("@@@", word).toLowerCase();
    // addPromise(url)
    let promise = fetch(newUrl)
    .then(response => response.json())
    .then(json => {
      if (json.statusCode === 404) {
        console.log('404 ', word)
        appendString(false, `Word ${word} does not exist. ::`);
        return false
      } else {
        appendString(true, `${json[0].word}: ${json[0].text} ::`);
        promises.push(promise)
      }
    });
  });


  function appendString (wordvalid, string) {
    count ++;
    if (wordvalid === false) {
      valid = false;
      returnResults(valid, string)
      return false
    }

    wordString += string;
    if (count === wordArray.length) {
      returnResults(valid, wordString)
    }
  }

  function returnResults (valid, string) {
    console.log(string)
    const responseArray = string.split("::")
    let responseString = ``;
    let invalidString = ``;


    if (valid === true ) {
      responseString += `Valid move — ${string} Challenger misses a turn.`
      document.querySelectorAll('.letter-provisional').forEach(ltr => {
        ltr.classList.remove('letter-provisional');
      })
      // return true
    } else {   //  valid === false
      responseArray.forEach(resp => {
      if (resp.match(/Word\s*[a-zA-Z]+\s*does not exist.\s*/)) {
        invalidString += resp
        document.querySelectorAll('.letter-provisional').forEach(ltr => {
          ltr.classList.remove('letter-provisional');
          ltr.innerHTML = '';
          ltr.parentNode.querySelector('.board-value').innerHTML = '';
           // console.log( 'ltr' , ltr);
          })
        }
      })
      responseString = `Invalid move — ${invalidString} ${playerName} misses a turn.`
      // alert(responseString)
      const csrfToken = document.querySelector("[name='csrf-token']").content;
      fetch(`/moves/${moveId}`, {
        method: 'DELETE',
        headers: {
          'X-CSRF-Token': csrfToken,
          'Content-Type': 'application/json'
        },
      })

    }


      const  gId = document.querySelector(".edit-page-identifier").dataset.gameid
      const numPlayers = document.querySelectorAll('.name-score').length
      const oldPlayer = document.querySelector(".dashboard").dataset.current
      let cPlayer = oldPlayer + 1
      if ( cPlayer > numPlayers - 1 ) cPlayer = 0;


    const gameData = ({current_player: parseInt(cPlayer)})
  fetch(`/games/${gId}`, {
        method: 'PATCH',
        headers: {
          'X-CSRF-Token': csrfToken,
          'Content-Type': 'application/json'
        },
    body: JSON.stringify(gameData)
      })





     console.log(responseString)
     if (responseString.split(' ')[0] === 'Valid') {
     realWords()

     }



      // document.querySelector(".challenge-info").insertAdjacentHTML ('beforeend', `<strong>Dictionary says:</strong> ${responseString}`) ;

      // document.querySelector(".challenge-info").innerText =  'eoweewn ewoweue eu8';
    //   document.querySelector('#confirmation-btn').innerHTML = `OK`;
    //   document.querySelector('#confirmation-btn').addEventListener('click', () => {
    //   // document.querySelector('#confirmation').classList.remove('challenge-show');
    //   // return false
    // })

  }
      // if (count === wordArray.length) return [valid, wordString];

  Promise.all(promises).then(values => {
    console.log( values );
    return valid;
  })
    // console.log( returnArray[0]);


function realWords() {

  const gId = document.querySelector(".edit-page-identifier").dataset.gameid
  const pId = document.querySelector(".edit-page-identifier").dataset.playerid
  const csrfToken = document.querySelector("[name='csrf-token']").content;

  const acceptData = {challenging: 'realwords', id:`${pId}`}
  fetch(`/players/${pId}`, {
    method: 'PATCH',
    headers: {
      'X-CSRF-Token': csrfToken,
      'Content-Type': 'application/html',
    },
    body: JSON.stringify(acceptData)
  })
  .then(response => response.json())
  .then(acceptObj => {
    console.log('moveId  ' + moveId);
    const moveAcceptData = {id: `${moveId}`}
    fetch(`/moves/${moveId}`, {
      method: 'PATCH',
      headers: {
      'X-CSRF-Token': csrfToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(moveAcceptData)
    })
  });
  document.querySelector('#challenge').remove()
  // document.querySelector('#challenge').classList.remove('challenge-show');
  // document.querySelector('#challenge').classList.add('challenge-hide');
  // chooseLetters();
}


}

export { searchDictionary }

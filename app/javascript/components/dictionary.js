
/// url contains "@@@" which will be replaced with search term
const url = "https://api.wordnik.com/v4/word.json/@@@/definitions?limit=3&includeRelated=false&sourceDictionaries=all&useCanonical=false&includeTags=false&api_key=bws5w0ajrmgaqjxopiobxgwa1sr5cg78y8gzhgeqhrrp10le9";
// let valid = true;
// let returnStr = ``;
let promises = [];
  let wordString = ``;
  // let returnArray = []
  let valid = true;
  async function searchDictionary (wordArray, moveId)  {
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
        appendString(false, `Word ${word} does not exist. ::`);
        return false
      } else {
        appendString(true, `${json[0].word}: ${json[0].text} ::`);
      }
      promises.push(promise)
    });
  });

  async function addPromise(url) {
    let promise = await fetch(url)
    .then(response => response.json())
    .then(json => {
      if (json.statusCode === 404) {
        appendString(false, `Word ${word} does not exist. ::`);
        return false
      } else {
        appendString(true, `${json[0].word}: ${json[0].text} ::`);
      }
      promises.push(promise)
    });

  }

  function appendString (wordvalid, string) {
    count ++;
    if (wordvalid === false) {
      valid = false;
      console.log('set valid == false')
      return false
    }

    wordString += string;
      if (count === wordArray.length) {
        returnResults(valid, wordString)
      // returnResults()
      }
  }

  function returnResults (valid, string) {
    const responseArray = string.split("::")
    let responseString = ``;
    let invalidString = ``
    if (valid === true ) {
      responseString += `Valid move — ${string}`
      document.querySelectorAll('.letter-provisional').forEach(ltr => {
        ltr.classList.remove('letter-provisional');
         console.log( 'ltr' , ltr);
      })
    } else {
      responseArray.forEach(resp => {
      if (resp.match(/Word\s*[a-zA-Z]+\s*does not exist.\s*/)) {
        invalidString += resp
        document.querySelectorAll('.letter-provisional').forEach(ltr => {
        ltr.classList.remove('letter-provisional');
        ltr.innerHTML = '';
        ltr.parentNode.querySelector('.board-value').innerHTML = '';
         console.log( 'ltr' , ltr);
      })
      }
    })
      responseString = `Invalid move — <br/> ${invalidString}`


      const csrfToken = document.querySelector("[name='csrf-token']").content;
      fetch(`/moves/${moveId}`, {
        method: 'DELETE',
    headers: {
      'X-CSRF-Token': csrfToken,
      'Content-Type': 'application/json'
    },
      })
    }
      document.querySelector("#confirmation-info").innerHTML =  responseString;
      document.querySelector('#confirmation-btn').innerHTML = `OK`;
      document.querySelector('#confirmation-btn').addEventListener('click', () => {
      document.querySelector('#confirmation').classList.remove('challenge-show');
    })

  }
      // if (count === wordArray.length) return [valid, wordString];

  Promise.all(promises).then(values => {
    console.log( valid );
  })
    // console.log( returnArray[0]);
    return valid;
}

export { searchDictionary }

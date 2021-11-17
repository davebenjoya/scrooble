
let gId;
let pId;
let moveId;
let csrfToken;

 if (document.querySelector(".edit-page-identifier")) {
  gId = document.querySelector(".edit-page-identifier").dataset.gameid;
  pId = document.querySelector(".edit-page-identifier").dataset.playerid;

  csrfToken = document.querySelector("[name='csrf-token']").content;
}

function showAccept() {
  document.querySelector('#challenge-btn').style.display = 'none';
  document.querySelector('#accept-btn').innerHTML = 'OK';
  setTimeout(function () {
    // const name = dataArray[1];
    document.querySelector('.challenge-info').innerHTML = `${dataArray[1]} scored ${dataArray[2]} points.`;
    document.querySelector('#challenge').classList.add('challenge-show');
    document.querySelector('.challenge-body').classList.add('challenge-body-show');
    document.querySelector('#accept-btn').addEventListener('click', hideAccept)
  }, 2000);
}

function hideAccept() {
  document.querySelector('#challenge').classList.remove('challenge-show');
  document.querySelector('.challenge-body').classList.remove('challenge-body-show');
  document.querySelector('#accept-btn').removeEventListener('click', showAccept);
  document.querySelector('#accept-btn').removeEventListener('click', hideAccept);
}


function challengeWords() {
  const challengeData = ({challenging: 'true'})
  pId = document.querySelector(".edit-page-identifier").dataset.playerid;
  console.log(pId);
  fetch(`/players/${pId}`, {
    method: 'PATCH',
    headers: {
      'X-CSRF-Token': csrfToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(challengeData)
  })

  document.querySelector('#challenge').classList.remove('challenge-show');
  document.querySelector('.challenge-body').classList.remove('challenge-body-show');
}




////////////////////////////////////////////////////////

function acceptWords() {

  gId = document.querySelector(".edit-page-identifier").dataset.gameid;
  pId = document.querySelector(".edit-page-identifier").dataset.playerid;
  moveId = document.querySelector(".edit-page-identifier").dataset.moveid;
    console.log('pId ', pId)
  const acceptData = {challenging: 'false', id:`${pId}`}
  fetch(`/players/${pId}`, {
    method: 'PATCH',
    headers: {
      'X-CSRF-Token': csrfToken,
      'Content-Type': 'application/json',
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

  document.querySelector('#challenge').classList.remove('challenge-show');
  document.querySelector('.challenge-body').classList.remove('challenge-body-show');
   document.querySelector('#accept-btn').removeEventListener('click', acceptWords)
  // chooseLetters();
}

  const updateBoard = (letter_array) => {
    letter_array.forEach( (letter, index) => {
      let char = letter.substring(0,1);
      let pos = parseInt(letter.substring(1));
      let val;
      if (char[0] === "↵") {
       char = letter.substring(1,1);
       pos = parseInt(letter.substring(2));
      }


      Array.from(lettersJSON.letters).forEach( l => {
      if (l[char]) {
       val = l[char].value;
      }
    });




      if (pos) {

      document.querySelectorAll(".board-value")[pos].innerText = val;
      document.querySelectorAll(".letter")[pos].innerText = char
      document.querySelectorAll(".letter")[pos].classList.add("letter-provisional");
      document.querySelectorAll(".letter")[pos].style=`transition-delay: ${.7 * index}s`;

      }
    })

  }

  const updatePlayers = (lastPlayer, addedScore) => {
    const players =  document.querySelectorAll(".player")
    let player = "Morty"
    let newIndex = 0;
    console.log("players.length ", players.length);
    players.forEach( (plr, index)=> {
      if (plr.innerHTML.trim() === lastPlayer.trim()) {
        const oldScore = plr.parentNode.querySelector(".score").innerHTML
        const newScore = (parseInt(oldScore) + parseInt(addedScore)).toString();
        plr.parentNode.querySelector(".score").innerHTML = newScore;
        newIndex = index + 1;
        if (newIndex > players.length -1) {
          newIndex = 0;
        }
        console.log("newIndex ", newIndex);

        const yOff = newIndex * 26;
        document.querySelector(":root").setAttribute("bug-y-offset", `${yOff}px`);



        player = document.querySelectorAll(".player")[newIndex].innerHTML;
      }
    })

    document.querySelector("#navbar-game").querySelector(".nav-emp:last-child").innerHTML = `Up now: ${player}`;
    document.querySelector(".player-selected").classList.remove("player-selected");
    document.querySelectorAll(".player")[newIndex].parentNode.classList.add("player-selected");
    document.querySelector("#scores").setAttribute('data-current', newIndex);
    // console.log(document.querySelector(":root").getAttribute("--bug-y-offset"));
    // document.querySelector(":root").setAttribute("bug-y-offset", `${(newIndex * 26) + 3 }px`);

    if (document.querySelector(".this-user").parentNode.classList.contains("player-selected")) {
        document.querySelector('#exchange-btn').classList.remove('button-disabled');
    }
  }



export { acceptWords, challengeWords }

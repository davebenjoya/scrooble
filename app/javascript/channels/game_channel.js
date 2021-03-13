import { board } from "../components/board";
import consumer from "./consumer";
import lettersJSON from '../components/letters.json';
// import 'new_game.js';

let id

const initGameCable = () => {
  const messagesContainer = document.getElementById('messages');
  if (messagesContainer) {
    const id = messagesContainer.dataset.gameId;

    consumer.subscriptions.create({ channel: "GameChannel", id: id }, {
      received(data) {
        // console.log("data "  , data); // called when data is broadcast in the cable
        // data contains values for message([0]), grid([1]), player([2] - next player), score[3]
        const dataArray = data.split(",")
        alert(`Message: ${dataArray[0]}
          Old Player:  ${dataArray[2]}
          Score:  ${dataArray[3]}`);

        updateBoard(dataArray[1]);  // grid
        updatePlayers(dataArray[2], dataArray[3]) // pass last player and last player's updated score
      },

       });
  }
     // subscribe(id);
//   }

////////////////////////////////////////////////////////


  const updateBoard = (newString) => {
    const oldTiles = document.querySelectorAll(".tile");
    const newGrid =  newString.trim().split(" ");
      newGrid.forEach( (char, index) => {
      if (char.trim() != "_") {
        if (char != oldTiles[index].querySelector(".letter").innerHTML) {
          oldTiles[index].querySelector(".letter").classList.add("letter-new");
          oldTiles[index].querySelector(".letter").innerHTML = char;
          setTimeout( function () {
            oldTiles[index].querySelector(".letter").classList.add("letter-new-show");
          }, index * .7)
          // find letter value
          Array.from(lettersJSON.letters).forEach( l => {
            if (l[char.trim()]) {
               oldTiles[index].querySelector(".board-value").innerHTML = l[char.trim()].value;
            }
          });
        }
      }

    })

  }



  const updatePlayers = (lastPlayer, addedScore) => {
    // set current player name in navbar
    // document.querySelector("#dashboard").setAttribute('data-current', num);
    let newIndex  = 0;
    const players =  document.querySelectorAll(".player")
    let player = "Morty"
    players.forEach( (plr, index)=> {
        console.log("plr.innerHTML ", plr.innerHTML);
      if (plr.innerHTML.trim() === lastPlayer.trim()) {
        const oldScore = plr.parentNode.querySelector(".score").innerHTML
        const newScore = (parseInt(oldScore) + parseInt(addedScore)).toString();
        plr.parentNode.querySelector(".score").innerHTML = newScore;
        newIndex = index + 1;
        if (newIndex > players.length -1) newIndex = 0;
        player = document.querySelectorAll(".player")[newIndex].innerHTML;
      }
    })


    document.querySelector("#navbar-game").querySelector(".nav-emp:last-child").innerHTML = player;

    // set current player style in scoreboard
    document.querySelector(".player-selected").classList.remove("player-selected");
    document.querySelectorAll(".player")[newIndex].parentNode.classList.add("player-selected");
    document.querySelector("#scores").setAttribute('data-current', newIndex);
  }






/////////////////////////////////////////////////

  function hide () {
          $('#exampleModalCenter').modal('hide');

  }

  function subscribe(id) {
    consumer.subscriptions.create({ channel: "GameChannel", id: id }, {
    received(data) {
      console.log("data" + data);
      messagesContainer.style.visible = "hidden";
      messagesContainer.insertAdjacentHTML('beforeend', data.replaceAll("&#39;", "'"));
      }
    });

  }

}

export { initGameCable };


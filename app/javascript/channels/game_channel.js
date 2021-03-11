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
        console.log("data "  , data); // called when data is broadcast in the cable
        // data contains values for message([0]), grid([1]), up([2] - last player), next_player([3]), score[4]
        const dataArray = data.split(",")
        alert(`Message: ${dataArray[0]}
          Last Player:  ${dataArray[2]}
          New CurrentPlayer: ${dataArray[3]}
          Score:  ${dataArray[4]}`);
        document.querySelectorAll(".score").[(parseInt(dataArray[2]))].innerHTML = dataArray[4];
        document.querySelector("#board").setAttribute('data-letter-grid', "dataArray[1]");
        updateBoard(dataArray[1]);  // grid
        updateCurrentPlayer(dataArray[3])  // new current player index
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



  const updateCurrentPlayer = (num) => {
    console.log ("num , ", num);
    // set current player name in navbar
    document.querySelector("#dashboard").setAttribute('data-current', num);
    const player =  document.querySelectorAll(".player")[parseInt(num)].innerHTML;
    document.querySelector("#navbar-game").querySelector(".nav-emp:last-child").innerHTML = player;

    // set current player style in scoreboard
    document.querySelector(".player-selected").classList.remove("player-selected");
    document.querySelectorAll(".player")[parseInt(num)].parentNode.classList.add("player-selected");
    document.querySelector("#scores").setAttribute('data-current', num);
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


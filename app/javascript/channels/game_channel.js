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
        // data contains values for message([0]), grid([1]), up([2] - current player), score[3]
        const dataArray = data.split(",")
        // $("#messages").innerHTML = dataArray[0];
        alert(dataArray[0])
        document.querySelector("#board").setAttribute('data-letter-grid', "dataArray[1]");
        // document.querySelector("#board").setAttribute('data-letter-grid', "dataArray[1]");
        updateBoard(dataArray[1]);
        updateCurrentPlayer(dataArray[2], dataArray[3])  // current player index, last player's score
      },

       });
  }
     subscribe(id);
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

  const updateCurrentPlayer = (num, score) => {
    console.log('player  ' , document.querySelectorAll(".player")[parseInt(num)]);
    console.log('dataset.current  ' , document.querySelector("#dashboard").dataset.current );
    // set current player name in navbar
    document.querySelector("#dashboard").setAttribute('data-current', num.toString());
    // const currentPlayer = document.querySelector(".edit-page-identifier").dataset.playername;
    const player =  document.querySelectorAll(".player")[parseInt(num)].innerHTML;
    const titleString = "A game";
    document.querySelector("#navbar-game").querySelector(".nav-emp:last-child").innerHTML = player;

    // set score
      let lastPlayer = (parseInt(num)) - 1;
    // console.log('document.querySelectorAll(".player").length  ' , document.querySelectorAll(".player").length );
      if (lastPlayer < 0) lastPlayer = document.querySelectorAll(".player").length -1;
       document.querySelectorAll(".score")[lastPlayer].innerHTML = score;

    // set current player style
    document.querySelector(".player-selected").classList.remove("player-selected");
    document.querySelectorAll(".player")[parseInt(num)].parentNode.classList.add("player-selected");
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


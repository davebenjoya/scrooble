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
        // data contains values for message([0]), grid([1]), up([2] - current player)
        const dataArray = data.split(",")
        $("#messages").innerHTML = dataArray[0];

        document.querySelector("#board").setAttribute('data-letter-grid', "dataArray[1]");
        // document.querySelector("#board").setAttribute('data-letter-grid', "dataArray[1]");
        updateBoard(dataArray[1]);
        updateCurrentPlayer(dataArray[2])
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

  const updateCurrentPlayer = (num) => {
    console.log('num  ' , num );
    console.log('dataset.current  ' , document.querySelector("#dashboard").dataset.current );
    document.querySelector("#dashboard").setAttribute('data-current', num.toString());

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


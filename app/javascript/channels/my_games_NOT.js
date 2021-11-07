
import consumer from "./consumer";
// import 'new_game.js';

let id

const initIndexCable = () => {
  const gamesContainer = document.getElementById('your-games');
  if (gamesContainer) {
    id = gamesContainer.dataset.id
    console.log('init index cable ', id)
  }
     // subscribe(id);
//   }

////////////////////////////////////////////////////////



  function subscribe(id) {
    // console.log('subscribe ', id);
    if (!id) {
      if (document.querySelector('.create-page-identifier')) {
        id = parseInt(document.querySelector('.create-page-identifier').dataset.userid)
      } else if (document.querySelector('.new-page-identifier')) {
       parseInt(document.querySelector('.new-page-identifier').dataset.userid) ;
      }
    }

    console.log('subscribe ', id);
    consumer.subscriptions.create({ channel: "MyGamesChannel", id: id }, {
      connected() {
          console.log("conn " );
        // Called when the subscription is ready for use on the server
      },

      disconnected() {
          console.log("disc ");
        // Called when the subscription has been terminated by the server
      },

      received(data) {
          console.log("data " + data);
        // Called when there's incoming data on the websocket for this channel
      }
    });

    // consumer.subscriptions.create({ channel: "MyGamesChannel", id: id }, {
    // received(data) {
    //   console.log("data" + data);
    //   }
    // });
  }



}

export { initIndexCable };


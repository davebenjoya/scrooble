import { board } from "../components/board";
import consumer from "./consumer";

let id
const initGameCable = () => {
  const messagesContainer = document.getElementById('messages');
  if (messagesContainer) {
    id = messagesContainer.dataset.gameId;
    // setTimeout(subscribe(id),1000)
    // subscribe(id);
  }

  function subscribe(id) {
    consumer.subscriptions.create({ channel: "GameChannel", id: id }, {
    received(data) {
      console.log("data" + data.replaceAll("&#39;", "'"));
      // messagesContainer.style.visible = "hidden";
      // messagesContainer.insertAdjacentHTML('beforeend', data.replaceAll("&#39;", "'"));
      }
    });

  }

}

export { initGameCable };


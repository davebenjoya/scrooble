import consumer from "./consumer"
let id
const initGameCable = () => {
  const messagesContainer = document.getElementById('messages');
  if (messagesContainer) {
    id = messagesContainer.dataset.gameId;
    console.log("ii dddddd" + id)
  }
  consumer.subscriptions.create({ channel: "GameChannel", id: id }, {
  received(data) {
    messagesContainer.insertAdjacentHTML('beforeend', data);
  }
});


}

export { initGameCable };


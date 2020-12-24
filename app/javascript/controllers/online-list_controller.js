import { Controller } from "stimulus"

export default class extends Controller {
  static targets = [ "trigger" ];

  connect() {
  }
  playSound = () => {
    this.originalTriggerText = this.triggerTarget.innerText;

    this.triggerTarget.innerText = "Bingo!";
    this.triggerTarget.setAttribute('disabled', '');
    const audioName = this.data.get('sound');
    const sound = document.querySelector("#btnAudio");

    console.log('Hello from stimulus!' + audioName);
    const oldName = 'Hello from stimulus!' + sound.src.split("assets/")[1].split(".mp3"[0]);
    // sound.setAttribute("src", audioName) ;
    sound.src = sound.src.replace(oldName, audioName);
    sound.play();
    sound.addEventListener("ended", () => {
      this.triggerTarget.removeAttribute('disabled');
      this.triggerTarget.innerText = this.originalTriggerText;
    });
  }

}


// import letters from './letters.json';

const newGame = () => {
   const newDiv = document.querySelector(".new-page-identifier");
 const form  = document.querySelector("form");
  if (newDiv) {
    document.querySelector("#new-game-btn").addEventListener('click', createNewGame)
    document.querySelectorAll(`input[type="checkbox"]`).forEach(check => {
      check.addEventListener('click', toggleSelectPlayer)
    })
  }

  function toggleSelectPlayer() {
    event.currentTarget.closest(".opponent-name").classList.toggle("opponent-name-selected");

  }


  const createNewGame = () => {
    console.log('form   '  +  form)
  }

}

export { newGame };

// import letters from './letters.json';

const newGame = () => {
   const newDiv = document.querySelector(".new-page-identifier");
 const form  = document.querySelector("form");
  if (newDiv) {
    document.querySelector("#new-game-btn").addEventListener('click', createNewGame)
  }


  const createNewGame = () => {
    console.log('form   '  +  form)
  }

}

export { newGame };

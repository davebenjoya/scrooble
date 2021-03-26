

const show_game = () => {

const showGame = document.querySelector(".show-page-identifier")

  if (showGame) {
  const titleString = showGame.dataset.name;
  const winner =  showGame.dataset.winner;
  const navbarString = `<span class='nav-emp'>${titleString}</span><span class = 'navbar-player'> Winner:  ${winner} </span>`;
  document.querySelector("#navbar-game").insertAdjacentHTML('afterbegin', navbarString)




  }





}


export { show_game };

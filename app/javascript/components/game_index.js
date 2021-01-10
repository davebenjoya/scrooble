const gameIndex = ()  => {
  const yourGames = document.querySelector(".your-games");

  if (yourGames) {
    document.querySelectorAll(".stored-game").forEach(game => {
    let playerList = ``
      const players = game.dataset.players.replace("[", "").replace("]", "").replaceAll(/\},\s*\{/g, "@@@");
      const arr = players.split("@@@");
      let current = 0;
      arr.forEach((player, index) => {
        let name =  player.replace(/[\{\}]/, "")
        .split(",")[0].replace(/name/, "")
        .replaceAll(":", "").replaceAll(/\'/g, "")
        .replaceAll(/\"/g, "").replaceAll("=>", "").trim();
        // console.log('current user ' + current_user);
        if (name === document.querySelector(".your-games").dataset.username) {
          name = "You, "
        } else {
          name += ", "
        }
        if (parseInt(game.querySelector(".players").dataset.current) === index) {
          name = `<span class= "current-player">${name}, </span>`
        }

        playerList += name;

      });
      // game.querySelectorAll(current)
      const lst = playerList.substr(0, playerList.length - 2).replaceAll(", ,", ",");
      game.querySelector(".players").insertAdjacentHTML('beforeend', lst);
    })
  }
}

export { gameIndex }

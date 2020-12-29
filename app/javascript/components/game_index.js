const gameIndex = ()  => {
  const yourGames = document.querySelector(".your-games");

  if (yourGames) {
    document.querySelectorAll(".stored-game").forEach(game => {
    let playerList = ``
      const players = game.dataset.players.replace("[", "").replace("]", "").replaceAll(/\},\s*\{/g, "@@@");
      const arr = players.split("@@@")
      arr.forEach(player => {
        const name =  player.replace(/[\{\}]/, "")
        .split(",")[0].replace(/name/, "")
        .replaceAll(":", "").replaceAll(/\'/g, "")
        .replaceAll(/\"/g, "").replaceAll("=>", "").trim();
        playerList += (name + ", ")
      })
      const lst = playerList.substr(0, playerList.length - 2)
      game.querySelector(".players").insertAdjacentText('beforeend', lst);
      console.log(lst);
    })
  }
}

export { gameIndex }

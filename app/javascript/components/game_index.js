const gameIndex = ()  => {
  const yourGames = document.querySelector(".your-games");

  if (yourGames) {
    document.querySelectorAll(".stored-game").forEach(game => {
      const players = game.dataset.players.replace("[", "").replace("]", "").replaceAll(/\},\s*\{/g, "@@@");
      const playersArr = players.split("@@@");
      let current = parseInt(game.querySelector(".players").dataset.current);
      const staggeredArrayBegin = playersArr.slice(current);
      const staggeredArrayEnd = playersArr.slice(0, current);
      const staggeredArray = staggeredArrayBegin.concat(staggeredArrayEnd);

      console.log('staggeredArray ' + staggeredArray.length);
      let playerList = ``;

        let alertPlayer = "";
      staggeredArray.forEach((player, index) => {
        let name =  player.replace(/[\{\}]/, "")
        .split(",")[0].replace(/name/, "")
        .replaceAll(":", "").replaceAll(/\'/g, "")
        .replaceAll(/\"/g, "").replaceAll("=>", "").trim();
        // console.log('current user ' + current_user);
        if (name === document.querySelector(".your-games").dataset.username) {
          name = "You, "
          switch (index) {
            case 0:
              alertPlayer = " — It's your turn.";
              break;
            case 1:
              alertPlayer = " — You're up next.";
              break;
              default: null;
          }
        } else {
          name += ", "
        }
        // console.log('playersArr.length  ' + playersArr);
          // if (parseInt(game.querySelector(".players").dataset.current) === index) {
          //   if (index === playersArr.length - 1 ) {
          //     name = `<span class= "current-player">${name}  </span>`
          //   } else {
          //     name = `<span class= "current-player">${name}, </span>`
          //   }
          // }
          //   if (parseInt(game.querySelector(".players").dataset.current) === index) {
              // console.log('indefgt hfhx  ' + index);
          //     name = `<span class= "current-player">${name}, </span>`
          //   }
          //   } else {
          //   if (parseInt(game.querySelector(".players").dataset.current) === index) {
          //     name = `<span class= "current-player">${name}  </span>`
          //   }
          // }

        playerList += name;

      });
      // game.querySelectorAll(current)
      // console.log('alertPlayer' + alertPlayer);
      const lst = playerList.replace(/,\s*$/, "").replaceAll(", ,", ",");
      game.querySelector(".players").insertAdjacentHTML('beforeend', lst);
      game.querySelector(".players").insertAdjacentHTML('beforeend', alertPlayer);
    })
  }
}

export { gameIndex }

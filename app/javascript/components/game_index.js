import { Turbo, cable } from "@hotwired/turbo-rails"

const gameIndex = ()  => {
  const yourGames = document.querySelector("#your-games");

  if (yourGames) {
    // setupPageAnimations();
    document.querySelectorAll(".stored-game").forEach(game => {
      const playerNames = game.dataset.names;

      let current = parseInt(game.querySelector(".players").dataset.current);
      console.log('playerNames ' + playerNames);
      const playersArr = playerNames.split(",");
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
        if (name === document.querySelector("#your-games").dataset.username) {
          name = "You, "
          switch (index) {
            case 0:
              alertPlayer = `<span class = "player-alert"> — It's your turn.</span>`;
              break;
            case 1:
              alertPlayer = `<span class = "player-alert">  — You're up next.</span>`;
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
      // game.querySelector(".players").insertAdjacentHTML('beforeend', lst);
      // game.querySelector(".players").insertAdjacentHTML('beforeend', alertPlayer);
    });
    setTimeout (function () {
      document.querySelector("#your-games").classList.add('your-games-show');
      console.log("your games div " + document.querySelector("#your-games").classList)

    }, 100)
  }


  function setupPageAnimations() {
  // State variable
  let _isAnimating = false;
  // Create list of nodes to animate
  let elementsToAnimate = [];
  // Events for browser compatibility
  const eventsPrefixed = ['animationend', 'webkitAnimationEnd', 'oAnimationEnd', 'MSAnimationEnd'];


  $(document).on('turbo:before-visit', e => {
    // Prevent an infinite loop
    if (!_isAnimating) {

      // Get the first element to animate
      const firstEl = $('[data-animate-out]')[0];
      let isAnimationEventSupported;

      // Check if the browser supports animationend
      // event, if it does...
      $(eventsPrefixed).each((ind, event) => {
        if (`on${event}` in firstEl ) {
          isAnimationEventSupported = true;
          return false;
        }
      });

      // ...we can begin animating
      if (isAnimationEventSupported) {
        _isAnimating = true;

        // Prevent default navigation
        e.preventDefault();
        // console.log ("event " + event.target.data);
        // Get the new url
        const newUrl = event.data.url;

        // Push elements that need animating to an array
        $('[data-animate-out]').each((ind, el) => {
          elementsToAnimate.push(el);
        });

        // Animate the list
        runAnimations(elementsToAnimate, eventsPrefixed);

        // Once all animations are complete...
        $(document).one('allAnimationEnd', () => {
          if (_isAnimating) {
            // Start the new page load
            Turbo.visit(newUrl);
            // Reset variables
            elementsToAnimate = [];
            _isAnimating = false;
          }
        });
      }
    }
  });
}

function runAnimations(elList, eventsPrefixed) {
    let animationsFinished = 0;
    const totalAnimations = elList.length;

    $(elList).each((ind, el) => {
      // Once each animation has finished
      $(el).one(
       eventsPrefixed.join(' '), () => {
          animationsFinished++;
          // Check if they're all finished
          checkForAllFinished(el);
        }
      );

      // Fire animation,
      // adding attribute value as a class
      $(el).addClass($(el).attr('data-animate-out'));
    });


    function checkForAllFinished(el) {
      if (animationsFinished === totalAnimations) {
        // Dispatch custom event once all animations
        // have finished
        const event = new CustomEvent(`allAnimationEnd`, {
          bubbles: true,
          cancelable: true
        });
        el.dispatchEvent(event);
      }
    }
  }

  $(document).on('turbo:before-cache', () => {
  removeAnimateClasses();
});

$(window).on('popstate', e => {
  if (_isAnimating) {
    // Prevent loading previous page
    // if animations have started
    e.preventDefault();
    history.go(1);
    removeAnimateClasses();

    // Reset variables
    _isAnimating = false;
    elementsToAnimate = [];
  }
});

// Use regex to remove all animation classes
function removeAnimateClasses() {
  const els = $('[data-animate-out], [class*=animate-]');
  $(els).removeClass((index, className) => {
    return (className.match(/(^|\s)animate-\S+/g) || []).join(' ');
  });
}


}

export { gameIndex }

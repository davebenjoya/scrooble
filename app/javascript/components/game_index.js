import { Turbo, cable } from "@hotwired/turbo-rails"

const gameIndex = ()  => {
  document.querySelector(":root").style.setProperty("bg-color", "#546EB6"); // $blue-yonder

  const indexPage = document.querySelector(".index-page-identifier")
  let crawlEndDelay = 1000;
  let storedGames
  if (indexPage) {
    storedGames = document.querySelector("#my-games").querySelectorAll(".card").length
    setTimeout( () => {
      document.querySelector(".crawl-start").classList.add("crawl-show");
      // console.log("transition end");
    }, 1000);
    crawlEndDelay = 5000;
    document.querySelector("#navbar-game").innerHTML = ``;
  }



  setTimeout( () => {
    document.querySelector(".crawl-start").classList.add("crawl-end");
    // console.log("transition end");
  }, crawlEndDelay);

 const yourGames = document.querySelector("#your-games");
  let agoTemp = ``;
  if (yourGames) {
    // setupPageAnimations();
    $("#compare-dom").load(window.location.href + " #my-games" );
document.querySelector("#compare-dom").style.display = 'none'
  const refresh = setInterval(function(){
    // $("#my-games").innerHTML = ``;
    // storedGames ++;
    $("#compare-dom").load(window.location.href + " #my-games" );
    // $("#your-games").load(window.location.href + " #my-games" );
    const yourGames = document.querySelector("#your-games");
  let agoTemp = ``;
  if (yourGames) {
    setTimeout(checkCardLength, 300)
}

  }, 15000);
      // refreshIndexTiles()

    function checkCardLength() {
      if (document.querySelector('#compare-dom').querySelectorAll(".card").length > 0 && document.querySelector('#compare-dom').querySelectorAll(".card").length != storedGames)  {
        // document.querySelector('#btnAudio').src = '../../assets/m3.mp3';
        // document.querySelector('#btnAudio').play();
        $("#my-games").load(window.location.href + " #compare-dom" )
        storedGames  = document.querySelector('#compare-dom').querySelectorAll(".card").length
      }
    }

    // document.querySelector('#compare-dom').addEventListener('load', () => {
    //   console.log("loaded " )
    // })

    // refreshIndexTiles()

    document.querySelectorAll(".avatar-index").forEach( av => {
      av.addEventListener('mouseover', () => {
        const quit = av.parentNode.classList.contains("player-quit") ? " (quit)" : "";
        const stat = av.closest(".card").querySelector(".status").innerHTML;
        agoTemp =  stat;
        av.closest(".card").querySelector(".status").innerHTML =`<span class='index-score'>` +  av.parentNode.dataset.username + ": " + `</span>` + av.parentNode.dataset.score + `${quit}` ;
      });

      av.addEventListener('mouseout', () => {
        av.closest(".card").querySelector(".status").innerHTML = agoTemp;
      });
    })

    window.onbeforeunload = function(){
  // return 'Are you sure you want to leave?';
      clearInterval(refresh)
    };

  window.addEventListener('unload', () => {
      clearInterval(refresh)
    })

    setTimeout(function () {
      document.querySelector("#your-games").classList.add('your-games-show');
    }, 100)
  }


  function refreshIndexTiles() {

  const numOfBgs = 6;
  let currentBg = 0;
  let bgClass = ``;
  let tileClass = ``;

  document.querySelectorAll(".tile-index").forEach ( t => {
    const leading  = currentBg < 10 ? "0" : "";
      tileClass = `tile` + leading + (currentBg + 1).toString();
      t.classList.add(`${tileClass}`)
      currentBg ++ ;
      if (currentBg > numOfBgs - 1) currentBg = 0;
    })
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
  // if (_isAnimating) {
  //   // Prevent loading previous page
  //   // if animations have started
  //   e.preventDefault();
  //   history.go(1);
  //   removeAnimateClasses();

  //   // Reset variables
  //   _isAnimating = false;
  //   elementsToAnimate = [];
  // }
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

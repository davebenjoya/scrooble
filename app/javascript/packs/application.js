// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.

// require("@rails/ujs").start()
require("@rails/activestorage").start()
require("channels")
require("bootstrap")
require("controllers")
require("@hotwired/turbo-rails")

import themesJSON from '../components/themes.json';

import "../../assets/stylesheets/application";

import "../../assets/images/star.svg";

// Uncomment to copy all static images under ../images to the output folder and reference
// them with the image_pack_tag helper in views (e.g <%= image_pack_tag 'rails.png' %>)
// or the `imagePath` JavaScript helper below.
//
// const images = require.context('../images', true)
// const imagePath = (name) => images(name, true)
import { board } from '../components/board'
// import { pLetters } from '../components/player_letters'
import { show_game } from '../components/show_game'
import { gameIndex } from '../components/game_index'
import { editUser } from '../components/edit_user'
import { newGame } from '../components/new_game'
import { initGameCable } from '../channels/game_channel';
import { initIndexCable } from '../channels/my_games_channel';


const themeColors = ["bg-color", "type-color", "logo-color", "bvm-color", "panel-color", "btn-bg", "btn-type", "btn-border", "btn-type-hilite", "btn-bg-hilite", "game-name-color", "game-name-color"]


document.addEventListener("turbo:load", function() {
  // console.log ('it works!');
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
        $('[data-toggle="popover"]').popover()
    })

    setTimeout(function() {
    $('.alert').fadeOut();
  }, 2000);
  gameIndex();
  board();
  // pLetters();
  show_game();
  initGameCable();
  editUser();
  newGame();

// document.querySelector(":root").style.setProperty("--bg-color", "#9D6158") // $redwood
changeColorsInit ()
    document.querySelector('#select-theme').value = capitalizeFirstLetter(document.querySelector('#navbar-left').dataset.theme);
    document.querySelector('#select-theme').addEventListener('change', changeColors);
  // new_game();
});


function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

  function changeColorsInit () {
    if (document.querySelector('#navbar-left')) {
     for (let k in Object.keys(themesJSON)) {
      if (Object.keys(themesJSON)[k] === document.querySelector('#navbar-left').dataset.theme) {
      // if (Object.values(themesJSON)[k]["background"]) console.log('background exists');
        const jsonTheme = Object.values(themesJSON)[k];
        const rootStyle  = document.querySelector(":root").style
        Array(Object.values(themesJSON)[k]).forEach( prop => {
          // console.log('f ' , Object.values(themesJSON)[k]);
         // document.querySelector('body').style.backgroundColor = Object.values(themesJSON)[k]["bg-color"]
        });

        themeColors.forEach( color => {
          rootStyle.setProperty(`--${color}`, jsonTheme[color])
        })
      }
     }

    }
 }

 function changeColors() {
   // console.log('themes ', Object.keys(themesJSON))
   if (document.querySelector('#select-theme')) {
     for (let k in Object.keys(themesJSON)) {

    const jsonTheme = Object.values(themesJSON)[k];
    const rootStyle  = document.querySelector(":root").style


      if (Object.keys(themesJSON)[k].toLowerCase() === document.querySelector('#select-theme').value.toLowerCase()) {


    if (jsonTheme["background"]) {
      console.log('background exists', Object.values(themesJSON)[k]["background"])
      document.querySelector("body").setAttribute("background-color", "transparent")
      rootStyle.setProperty("--bg-color", jsonTheme["bg-color"])
    }

    themeColors.forEach( color => {
      rootStyle.setProperty(`--${color}`, jsonTheme[color])
    })

      //fetch
      const uId = document.querySelector("#navbar-left").dataset.userid
      const csrfToken = document.querySelector("[name='csrf-token']").content;
      const userData = ({current_theme: Object.keys(themesJSON)[k]})
      // console.log('userData' , userData )
      fetch(`/users/${uId}`, {
        method: 'PATCH',
        headers: {
          'X-CSRF-Token': csrfToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
        })
        //   .then(response => {
        //   response.json()
        // })
        // .then(json => console.log(json))
        }
       }
     }
  }


import "controllers"

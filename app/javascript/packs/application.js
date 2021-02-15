// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.

require("@rails/ujs").start()
require("@rails/activestorage").start()
require("channels")
require("bootstrap")
require("controllers")
require("@hotwired/turbo-rails")

import "../../assets/stylesheets/application";

import "../../assets/images/star.svg";

// Uncomment to copy all static images under ../images to the output folder and reference
// them with the image_pack_tag helper in views (e.g <%= image_pack_tag 'rails.png' %>)
// or the `imagePath` JavaScript helper below.
//
// const images = require.context('../images', true)
// const imagePath = (name) => images(name, true)
import { board } from '../components/board'
import { show_game } from '../components/show_game'
import { gameIndex } from '../components/game_index'
import { new_game } from '../components/new_game'
import { initGameCable } from '../channels/game_channel';

document.addEventListener('turbo:load', (ev) => {



});

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
  show_game();
  initGameCable();
  // new_game();
});


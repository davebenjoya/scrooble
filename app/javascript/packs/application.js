// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.

require("@rails/ujs").start()
require("turbolinks").start()
require("@rails/activestorage").start()
require("channels")
require("bootstrap")
require("controllers")

import "../../assets/stylesheets/application";

import "../../assets/images/star.svg";

// Uncomment to copy all static images under ../images to the output folder and reference
// them with the image_pack_tag helper in views (e.g <%= image_pack_tag 'rails.png' %>)
// or the `imagePath` JavaScript helper below.
//
// const images = require.context('../images', true)
// const imagePath = (name) => images(name, true)
import { board } from '../components/board'
import { new_game } from '../components/new_game'
import { initGameCable } from '../channels/game_channel';

document.addEventListener('turbolinks:load', (ev) => {



});

document.addEventListener("turbolinks:load", function() {
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
        $('[data-toggle="popover"]').popover()
    })


    setTimeout(function() {
    $('.alert').fadeOut();
  }, 2000);
  board();
  initGameCable();
  // new_game();
});


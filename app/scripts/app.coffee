Pokeball = require("pokeball")
Utils = require("utils/module")

module.exports = ->
  require("pokeball/helpers/i18n").injectI18n()
  require("pokeball/helpers/component").initialize()

  $(".js-standard-filter-form").filterEvent()

  $("img[data-original]").lazyload
    effect: "fadeIn"

  # support IE8,9 input placeholder
  $('input, textarea').placeholder()

  require "designable"

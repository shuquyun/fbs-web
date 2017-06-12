class PopupImage
  constructor: ($) ->
    @$jsClosePopup = $("#js-close-popup")
    @bindEvent()

  bindEvent: =>
    @$jsClosePopup.on "click", @closePopup

  closePopup: =>
    @$el.remove()

module.exports = PopupImage

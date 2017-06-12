class Carousel
  constructor: ($)->
    @$carousel = $(".carousel")
    @interval = parseInt(@$carousel.data("interval"))
    @bindEvent()

  bindEvent: ->
    @$carousel.carousel({interval: @interval})

module.exports = Carousel

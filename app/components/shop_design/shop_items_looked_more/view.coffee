class ItemsLookedMore
  constructor: ($)->
    @$jsListUp = $(".js-list-up")
    @$jsListDown = $(".js-list-down")
    @$itemList = $(".js-item-list")
    @windowHeight = 188 * 3
    @height = @$itemList.height() - @windowHeight
    @bindEvent()

  bindEvent: =>
    @$jsListUp.on("click", @listUp)
    @$jsListDown.on("click", @listDown)

  scrollItem: (top)=>
    @$itemList.css("top", top + "px")
    @calculateTop(top)

  getListTop: =>
    parseFloat(@$itemList.css("top").split("px")[0])

  listUp: =>
    top = @getListTop()
    scrollTop = top + @windowHeight
    @scrollItem(scrollTop)

  listDown: =>
    top = @getListTop()
    scrollTop = top - @windowHeight
    @scrollItem(scrollTop)

  calculateTop: (top)=>
    if Math.abs(top) >= @height
      @$jsListDown.hide()
      @$jsListUp.show()
    else if top >= 0 and top < @height
      @$jsListDown.show()
      @$jsListUp.hide()
    else
      @$jsListDown.show()
      @$jsListUp.show()

module.exports = ItemsLookedMore

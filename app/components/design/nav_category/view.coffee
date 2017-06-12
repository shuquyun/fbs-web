class NavHeader
  constructor: ($)->
    @$target = @$el
    @$category = $(".js-category-item")
    @$categoryList = $(".js-category-list")
    @$navHeader = $(".js-nav-category-header")
    @listHeight = @$categoryList.height() - 1
    $(".expand-category").css("min-height", @listHeight + "px")
    @bindEvent()

  bindEvent: =>
    @$target.on "mouseenter", ".js-category-item", @overCategory
    @$target.on "mouseleave", ".js-category-item", @outCategory
    # @$el.find("#guide").guide({activeSelector: 'guide-active', delay: 300})
    if @checkIsIndex()
      @setMinHeight()
    else
      @$target.on "mouseenter", @showCategory
      @$target.on "mouseleave", @hideCategory

  checkIsIndex: =>
    isIndex = @$categoryList.data("index")
    if isIndex then true else false

  showCategory: (evt)=>
    @$categoryList.show()
    @setMinHeight()

  hideCategory: (evt)=>
    @$categoryList.hide()

  overCategory: (evt)=>
    $self = $(evt.currentTarget)
    $self.find(".expand-panel").show()
    @setRelativeIndex($self)
    $self.find("img.lazy").lazyload
      effect: "fadeIn"
      skip_invisible : false
    .removeClass("lazy")

  outCategory: (evt)=>
    $(evt.currentTarget).find(".expand-panel").hide()

  setMinHeight: =>
    _.each @$category, (categoryLi)->
      height = $(categoryLi).height()
      $(categoryLi).find(".attach").css("height", height)

  setRelativeIndex: (category)=>
    panel = $(category).find(".expand-category")
    attach = $(category).find(".attach")
    categoryHeight = @$categoryList.height()
    categoryTop = @$categoryList.offset().top
    parentHeight = @$navHeader.height()
    parentTop = @$navHeader.offset().top + parentHeight

    if $(window).scrollTop() > categoryTop
      panelMinHeight = categoryHeight + categoryTop - $(window).scrollTop()
      panelTop = $(attach).offset().top - $(window).scrollTop()
    else
      panelMinHeight = categoryHeight
      panelTop = $(attach).offset().top - parentTop
    $(panel).css("top", - panelTop).css("min-height", panelMinHeight)

module.exports = NavHeader

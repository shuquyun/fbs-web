class NavHeader
  constructor: ($)->
    @target = @$el
    @$category = $(".category-li")
    @navBarItemLi = $(".navbar-item")
    @$allCategoryShow = $(".home-channel-container")
    @setActive()
    @bindEvent()

  that = this

  bindEvent: ->
    that = this
    if @checkIsIndex()
      @setMinHeight()
    else
      @$allCategoryShow.on "mouseenter", @showCategory
      @$allCategoryShow.on "mouseleave", @hideCategory
    @setImagesHeight()
    @navBarItemLi.on "click", @navBarClick
    @target.on "mouseenter", ".category-li", @overCategory
    @target.on "mouseleave", ".category-li", @outCategory

  checkIsIndex: ->
    currentHost = window.location.hostname
    currentPath = window.location.pathname
    targetHosts = /^https?:\/\/(.*)$/.exec(@target.find(".navbar-collapse").data("href"))
    # hostname 相同并且 path 是 / 或者 /index
    if targetHosts and targetHosts[1] is currentHost and (currentPath is "/" or currentPath is "/index")
      return true
    false

  showCategory: (evt)->
    evt.stopPropagation()
    $(@).find(".home-channel").addClass("active")
    that.setMinHeight()

  hideCategory: ->
    $(@).find(".home-channel").removeClass("active")

  overCategory: (evt)->
    evt.stopPropagation()
    $(@).find(".expand-panel").removeClass("disappear")
    that.setRelativeIndex(@)
    $(@).find("img.lazy").lazyload
      effect: "fadeIn"
      skip_invisible : false
    .removeClass("lazy")

  outCategory: (evt)->
    evt.stopPropagation()
    $(@).find(".expand-panel").addClass("disappear")

  setMinHeight: ->
    _.each that.$category, (categoryLi)->
      height = $(categoryLi).height()
      $(categoryLi).find(".attach").css("height", height)

  setRelativeIndex: (category)=>
    panel = $(category).find(".expand-category")
    attach = $(category).find(".attach")
    parentHeight = that.target.height()
    parentTop = that.target.offset().top + parentHeight - $(window).scrollTop()
    viewHeight = $(window).height() - parentTop
    panelHeight = $(panel).height()
    panelTop = $(attach).offset().top - parentTop - $(window).scrollTop()
    if  viewHeight < panelTop + panelHeight and panelHeight + 10 < viewHeight
      $(panel).css("top", viewHeight - panelHeight - panelTop - 10)
    else if viewHeight < panelHeight + panelHeight and viewHeight < panelHeight
      $(panel).css("top", - panelTop)

  setImagesHeight: ->
    @target.find(".home-channel").removeClass("disappear")
    _.each @$category, (categoryLi)->
      height = $(categoryLi).find(".expand-panel").removeClass("disappear").find(".expand-category").css("visibility", "hidden").height()
      if height > $(categoryLi).find(".image-recommend").height()
        $(categoryLi).find(".image-recommend").css("height", height)
      $(categoryLi).find(".expand-panel").addClass("disappear").find(".expand-category").css("visibility", "visible")
    @target.find(".home-channel").addClass("disappear") unless that.checkIsIndex()

  regExp: (regs, type)->
    status = true
    $.each @navBarItemLi, (i, d)->
      href = $(@).find("a").attr "href"
      if type is 0
        reg = regs
        str = href
      else
        reg = href
        str = regs
      re = new RegExp(".*#{reg}.*")
      if re.test(str)
        $(".nav-header li").removeClass("active")
        $(@).closest("li").addClass("active")
        if type is 0
          status = false
        return false
    status

  setActive: ->
    hostname = window.location.hostname
    pathName = window.location.pathname
    url = window.location.href
    status = true
    if pathName isnt "/"
      status = @regExp(pathName, 0)
    if status
      @regExp(url, 1)

  navBarClick: ->
    $(".nav-header li").removeClass("active")
    $(@).closest("li").addClass("active")

module.exports = NavHeader

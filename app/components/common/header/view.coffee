Cookie = require("utils/module").plugins.cookie

suggestTemplate = Handlebars.templates["common/header/frontend_templates/suggestion-list"]

class Header

  _.defaults @::, Cookie::

  constructor: ($) ->
    @$searchForm = $("#form-search")
    @$searchTypeLi = $(".search-type-li")
    @$searchTypeUl = $(".search-type-group")
    @$jsHotword = $(".js-hotword")
    @$jsFloatSearch = $(".js-float-search")
    @$submitButton = $("#js-search-submit")
    @$jsFloatSearchForm = $("#js-float-search-form")
    @bindEvent()

  bindEvent: ->
    @$searchTypeUl.on "mouseover", @searchTypeLiMouseover
    @$searchTypeUl.on "mouseout", @searchTypeLiMouseout
    @$searchTypeLi.on "click", @searchTypeLiClick
    @$searchForm.on "submit", @searchSubmit
    @$submitButton.on "click", @floatSearchSubmit
    @bindSuggest()
    $(window).on("scroll", @showFloat)
    @setType()
    # @getHotword()

  showFloat: =>
    if $(window).scrollTop() > $(window).height() * 1.2
      @$jsFloatSearch.show()
    else
      @$jsFloatSearch.hide()

  getHotword: =>
    $.ajax
      url: "/api/search/hotword/top?size=1&position=0"
      type: "GET"
      success: (data) =>
        $(".search-input").attr("placeholder", data[0].keyword) if data.length
      error: (data) ->
    if @$jsHotword.length && !@getCookie("isSearch")
      $.ajax
        url: "/api/search/hotword/top?size=5&position=1"
        type: "GET"
        success: (data) =>
          @renderHotwords data
          @addCookie "isSearch", "true", 1, document.domain
        error: (data) ->
    else
      $.ajax
        url: "/api/search/hotword/random?size=5&position=1"
        type: "GET"
        success: (data) =>
          @renderHotwords data
        error: (data) ->

  renderHotwords: (data) =>
    str = ""
    _.map data, (v, i) ->
      href = if v.type then v.content else "/search?q=#{v.keyword}"
      style = ""
      _.map v.styles, (v, i) ->
        style += "bold " if !v
        style += "red " if v
      str += "<li><a class='#{style}' href='#{href}' target='_blank'>#{v.keyword}</a></li>"
    @$jsHotword.html str

  setType: =>
    regexp = new RegExp(".*/shops.*")
    hrefbase = @$searchForm.data("hrefbase")
    url = window.location.href
    if regexp.test(url)
      $(".search-type-shops").addClass("active")
      $(".search-type-items,.items-suggest").removeClass("active")
      $(".shops-suggest").addClass("active").show()
      $(".search-type-items").before($(".search-type-shops")[0])
      @$searchForm.attr("action", hrefbase + "/shops")

  shopsSuggest: (evt)=>
    hrefbase = @$searchForm.data("hrefbase")
    $(".shops-suggest").suggest
      margin: {left: 75}
      url: "/api/suggest?t=shops&q="
      dataFormat: (data)->
        data
      callback: (text)=>
        action = @$searchForm.attr "action"
        if text isnt ""
          top.location.href = action + "?q=" + text

  itemsSuggest: (evt)=>
    $(".items-suggest").suggest
      margin: {left: 75}
      url: "/api/search/suggest/item?size=10&keyword="
      template: suggestTemplate
      dataFormat: (data)->
        result = []
        _.map data, (v, i) ->
          if v.name is "name"
            _.map v.suggest, (v, i) ->
              result.push {
                value: v.name
                desc: "#{i18n.ct('around', 'common')}#{v.docCount}#{i18n.ct('goods', 'common')}"
              }
        return result
      callback: (text)=>
        action = @$searchForm.attr "action"
        if text isnt ""
          fcid = ""
          top.location.href = action + "?q=" + text + fcid

  bindSuggest: =>
    # @itemsSuggest()
    # @shopsSuggest()

  searchTypeLiMouseover: =>
    @$searchTypeLi.show()
    $(".search-tab-icon").css({"transform": "rotate(180deg)", "-ms-transform": "rotate(180deg)", "-o-transform": "rotate(180deg)", "transition-duration": "0.3s"})
    @$searchTypeLi.mouseover (evt)->
      $(evt.currentTarget).css("background", "#f5f5f5")
    @$searchTypeLi.mouseout (evt)->
      $(evt.currentTarget).css("background", "#fff")  

  searchTypeLiMouseout: =>
    $(".search-type-li.active").siblings(".search-type-li").hide()
    $(".search-tab-icon").css({"transform": "rotate(0deg)", "-ms-transform": "rotate(0deg)", "-o-transform": "rotate(0deg)", "-o-transition-duration": "0.3s"})

  searchTypeLiClick: (evt)=>
    $self = $(evt.currentTarget)
    $self.siblings(".search-type-li").removeClass("active")
    $self.addClass("active")
    hrefbase = @$searchForm.data("hrefbase")
    $(".search-type-li.active").siblings(".search-type-li").hide()
    activeHtml = $self
    $self.prev().before(activeHtml)
    type = parseInt($(".search-type-li.active").data("type"))
    if type is 1
      $(".items-suggest").addClass("active").show()
      $(".shops-suggest").removeClass("active").hide()
      @$searchForm.attr "action", hrefbase + "/search"
    else
      $(".shops-suggest").addClass("active").show()
      $(".items-suggest").removeClass("active").hide()
      @$searchForm.attr "action", hrefbase + "/shops"

  searchSubmit: (evt)=>
    evt.preventDefault()
    $searchInput = $(".search-input.active")
    value = $.trim $searchInput.val()
    placeholder = $searchInput.attr("placeholder")
    if value
      window.location = encodeURI(@$searchForm.attr("action") + "?q=" + value)
    else
      if placeholder
        $searchInput.val(placeholder)
        window.location = encodeURI(@$searchForm.attr("action") + "?q=" + placeholder)
      else
        window.location = encodeURI(@$searchForm.attr("action"))

module.exports = Header

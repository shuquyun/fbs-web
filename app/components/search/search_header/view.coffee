Cookie = require("utils/module").plugins.cookie
cityTemplate = Handlebars.templates["search/search_header/frontend_templates/address_option"]

class Header

  _.defaults @::, Cookie::

  constructor: ($) ->
    @$searchForm = $("#form-search")
    @$searchTypeUl = $(".search-type-group")
    @$submitButton = $("#js-search-submit")
    @$changeCity = $(".js-exchange-city")
    @addressList = []
    @bindEvent()

  bindEvent: ->
    @$searchTypeUl.on "mouseover", @searchTypeLiMouseover
    @$searchTypeUl.on "mouseout", @searchTypeLiMouseout
    @$searchForm.on "submit", @searchSubmit
    $(document).on "click", ".show-type-li", @searchTypeLiClick
    @$changeCity.on "click", @exchangeCity
    $(document).on "click", @hideCitySelect

  searchTypeLiMouseover: ->
    $showTypeli = $(".show-type-li")
    $showTypeli.show()
    $(".search-tab-icon").css({"transform": "rotate(180deg)", "-ms-transform": "rotate(180deg)", "-o-transform": "rotate(180deg)", "transition-duration": "0.3s"})
    $showTypeli.mouseover (evt) ->
      $(evt.currentTarget).css("background", "#f5f5f5")
    $showTypeli.mouseout (evt) ->
      $(evt.currentTarget).css("background", "#fff")

  searchTypeLiMouseout: ->
    $(".show-type-li").hide()
    $(".search-tab-icon").css({"transform": "rotate(0deg)", "-ms-transform": "rotate(0deg)", "-o-transform": "rotate(0deg)", "-o-transition-duration": "0.3s"})

  searchTypeLiClick: (evt)=>
    $self = $(evt.currentTarget)
    $(".show-list-type").removeClass("hide").addClass("show-type-li")
    $self.removeClass("show-type-li").addClass("hide")

    type = parseInt($self.data("type"))
    $(".show-lead-type").removeClass("active")
    $(".show-lead-type[data-type=#{type}]").addClass("active")

    $(".search-input").removeClass("active").hide()
    $(".show-list-type").hide()
    hrefbase = @$searchForm.data("hrefbase")
    $targetInput = $(".#{type}-suggest")
    $targetInput.addClass("active").show()
    url = $targetInput.data("url")
    @$searchForm.attr "action", hrefbase + url

  searchSubmit: (evt) =>
    evt.preventDefault()
    $searchInput = $(".search-input.active")
    regionId = $(".js-city-id").val()
    regionName = $(".current-selected-city").text()
    value = $.trim $searchInput.val()
    type = parseInt($(".search-type-li.active").data("type"))
    search = window.location.search
    url = if type is 2 or type is 3 then "&q=#{value}" else "?q=#{value}"
    url = if search.indexOf('?type=more') isnt -1 then "&q=#{value}" else url
    cityUrl = if regionId then "&regionId=#{regionId}&regionName=#{regionName}" else ''
    window.location = encodeURI(@$searchForm.attr("action") + url + cityUrl)

  exchangeCity: (evt) =>
    evt.stopPropagation()
    $(".js-city-list").removeClass("hide")
    $(".component-site-header").spin("small")
    $.ajax
      type: "get"
      url: "/api/address/0/children"
      success: (data) =>
        $(".component-site-header").spin(false)
        $(".js-province-select").html(cityTemplate({data}))
        $("select").selectric("refresh")
        $(".js-province-select").on "change", @selectProvince
        @selectProvince(evt)

  selectProvince: (evt) =>
    evt.stopPropagation()
    $el = $(".js-province-select option:selected")
    id = $el.data("id")
    $.ajax
      type: "get"
      url: "/api/address/#{id}/children"
      success: (data) =>
        $(".js-city-select").html(cityTemplate({data}))
        $("select").selectric("refresh")
        $parent = $(".selectric-js-city-select")
        $citys = $(".selectric-scroll ul li", $parent)
        $citys.on "click", @selectCity

  selectCity: () =>
    $el = $(".js-city-select option:selected")
    id = $el.data("id")
    name = $el.text()
    $(".current-selected-city").text(name)
    $(".js-city-id").attr "value", id
    @hideCitySelect()

  hideCitySelect: () ->
    $(".js-city-list").addClass("hide")

module.exports = Header

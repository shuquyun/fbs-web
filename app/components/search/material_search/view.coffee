###
  商品主搜组件
  author by terminus.io (zl)
###
Tip = require "common/tip_and_alert/view"

Modal = require("pokeball").Modal
Pagination = require("pokeball").Pagination
brandItemTemplate = Handlebars.templates["search/material_search/frontend_templates/select_brand_item"]

class ItemsList
  constructor: ($) ->
    @$filterForm = $(".js-filter-form")
    @$cancelFilterForm = $("#js-cancel-price-filter")
    @$propertySelector = $(".js-property-selector")
    @breadFrontSelector = $(".js-bread-front-selector")
    @breadPropertySelector = $(".js-bread-property-selector")
    @breadCategorySelector = $(".js-bread-category-selector")
    @breadBrandSelect = $(".js-bread-brand-selector")
    @categorySelector = $(".js-category-selector")
    @$brandSelector = $(".js-brand-selector")
    @itemSortButton = $(".js-item-sort")
    @$jsAttrElects = $(".js-attr-elects")
    @$jsbrandElects = $(".js-brand-elects")
    @$jsBrandConfirm = $(".js-brand-confirm")
    @$jsAttrsConfirm = $(".js-attrs-confirm")
    @$jsCategoryConfirm = $(".js-category-confirm")
    @$jsBrandCancel = $(".js-brand-cancel")
    @$jsMore = $(".js-fold,.js-unfold")
    @$secondTagList = $(".second-tag-list")
    @$categoryNav = $(".category-nav")
    @$toggleMoreAttrs = $(".js-toggle-more")
    @$optionBtn = $(".attr")
    @$jsBrandContainer = $("#js-brand-container")
    @$selectedBrandList = $(".js-selected-brands-list")
    @bindEvent()

  bindEvent: ->
    pageSize = if _.isNumber($.query.get("pageSize")) then $.query.get("pageSize") else 20
    @$filterForm.validator
      isErrorOnParent: true
    @setSort()
    @$filterForm.on("submit", @filterFormSubmit)
    @$cancelFilterForm.on("click", @clearPriceFilter)
    @$propertySelector.on "click", @propertySelectorClick
    @$brandSelector.on "click", @brandSelectorClick
    @breadPropertySelector.on "click", @breadPropertySelectorClick
    @breadCategorySelector.on "click", @breadCategorySelectorClick
    @breadBrandSelect.on "click", @breadBrandSelectorClick
    @categorySelector.on "click", @categorySelectorClick
    @itemSortButton.on "click", @itemSortClick
    @breadFrontSelector.on "click", @breadFrontSelectorClick
    @$jsAttrElects.on "click", @electAttrs
    @$jsbrandElects.on "click", @electBrands
    @$jsBrandConfirm.on "click", @brandConfirm
    @$jsAttrsConfirm.on "click", @attrsConfirm
    @$jsCategoryConfirm.on "click", @categoryConfirm
    @$jsBrandCancel.on "click", @brandCancel
    @$jsMore.on "click", @categoriesMore
    @$toggleMoreAttrs.on "click", @toggleMoreAttrs
    @$optionBtn.on "click", @toggleCheck

  #设置品牌筛选
  brandSelectorClick: (evt)=>
    $self = $(evt.currentTarget)
    isMore = @$jsBrandContainer.hasClass("active")
    bid = $self.data("id")
    name = $self.data("name")
    @selectedBrands = @selectedBrands or []
    if isMore
      if $self.hasClass("active")
        $self.removeClass("active")
        _.without @selectedBrands, bid
        $(".js-selected-brand[data-id=#{bid}]").remove()
      else
        $self.addClass("active")
        @selectedBrands.push(bid)
        @$selectedBrandList.append(brandItemTemplate({bid, name}))
    else
      window.location.search = $.query.set("bNames", bid).remove("pageNo").toString()

  #面包屑前台类目筛选
  breadFrontSelectorClick: ->
    window.location.search = $.query.remove("fcid").remove("pageNo")

  #面包屑品牌筛选
  breadBrandSelectorClick: ->
    bids = ($.query.get("bNames")).toString().split("_")
    bid = $(@).data("id").toString()
    bids = _.without(bids, bid, "").join("_")
    if bids.length > 0
      window.location.search = $.query.set("bNames", bids).remove("pageNo").toString()
    else
      window.location.search = $.query.remove("bNames").remove("pageNo").toString()

  #面包屑属性筛选
  breadPropertySelectorClick: ->
    attrs = $.query.get("attrs").split("_")
    attrs = _.without(attrs, $(@).data("selector")).join("_")
    window.location.search = $.query.set("attrs", attrs).remove("pageNo").toString()

  #面包屑后台类目筛选
  breadCategorySelectorClick: ->
    cid = $(@).data("id")
    if cid is 0
      window.location.search = $.query.remove("q").remove("bcids").remove("bNames").remove("pageNo")
    else
      window.location.search = $.query.remove("q").remove("attrs").remove("bNames").set("bcids", cid).remove("pageNo").toString()

  # 类目筛选
  categorySelectorClick: ->
    window.location.search = $.query.set("bcids", $(@).data("key")).remove("pageNo").toString()

  #多选
  electAttrs: (evt)=>
    $self = $(evt.currentTarget)
    $self.hide()
    thisTr = $self.closest("tr")
    thisTr.addClass("active").prev().addClass("nbb")
    $.each $("td", thisTr), (i, td)->
      $(td).find("div.attr").show().siblings("a").hide()
    thisTr.find(".js-filter-container").addClass("active")
    if thisTr.find(".js-fold").hasClass("hide")
      thisTr.find(".js-unfold").trigger("click")
    thisTr.find(".brand-buttons").show()

  #品牌多选
  electBrands: (evt)=>
    $self = $(evt.currentTarget)
    @electAttrs(evt)
    $(".js-selected-brands-list").show()

  #品牌多选确认
  brandConfirm: =>
    brands = @selectedBrands
    unless brands.length is 0
      bids = brands.join("_")
      window.location.search = $.query.set("bNames", bids).toString()

  #属性多选确认
  attrsConfirm: ->
    thisDl = $(@).closest("tr")
    attrname = $(thisDl).find("th").text().trim()+":"
    if $.query.get("attrs") is true
      attrs = []
    else
      attrs = $.query.get("attrs").split("_")
    $.each $(".attr-dd", thisDl), (i, dd)->
      if $(dd).find("div.checked").length > 0
        attrs.push (attrname + $(dd).find("div.checked").data("value"))
    unless attrs.length is 0
      attrs = attrs.join("_")
      window.location.search = $.query.set("attrs",attrs).remove("attr").toString()

  #后台类目多选确认
  categoryConfirm: ->
    thisDl = $(@).closest("dl")
    bcids = []
    $.each $(".category-dd", thisDl), (i, dd)->
      if $(dd).find("input:checked").length > 0
        bcids.push $(dd).find("input:checked").val()
    unless bcids.length is 0
      bcids = bcids.join("_")
      window.location.search = $.query.set("bcids",bcids).toString()

  #品牌多选取消
  brandCancel: ->
    thisTr = $(@).closest("tr")
    # thisTr.find(".js-filter-container").css("height","35px")
    $.each $(".dd-cancel", thisTr), (i, dd)->
      $(dd).find("div.attr").removeClass("checked")
      $(dd).find("div.attr").hide().siblings("a").show()
    thisTr.find(".js-brand-elects,.js-attr-elects").show()
    thisTr.find(".js-filter-container").removeClass("active")
    thisTr.removeClass("active").prev().removeClass("nbb")
    thisTr.find(".brand-buttons").hide()
    if thisTr.find(".js-unfold").hasClass("hide")
      thisTr.find(".js-fold").trigger("click")

  #分类更多
  categoriesMore: ->
    thisTr = $(@).closest("tr")
    if thisTr.find(".js-unfold").hasClass("hide")
      thisTr.find(".js-filter-container").removeClass("extend")
    else
      thisTr.find(".js-filter-container").addClass('extend')

    thisTr.find(".js-fold,.js-unfold").toggleClass("hide")

  #查看更多规格
  toggleMoreAttrs: ->
    trs = $(@).closest(".js-search-attrs").find("tr.hide")
    $(@).toggleClass("extend")
    $(@).find("span").toggleClass("hide")
    if $(@).hasClass("extend")
      trs.show()
    else
      trs.hide()

  # 设置属性
  propertySelectorClick: ->
    attrs = undefined
    if attrs = "" + $.query.get("attrs")
      arrays = attrs.split("_")
      arrays.push($(@).closest(".attr-container").siblings("th").text()+":"+$(@).data("attr"))
      attrs = arrays.join("_")
    else
      attrs = $(@).closest(".attr-container").siblings("th").text()+":"+$(@).data("attr")
    window.location.search = $.query.set("attrs", attrs.replace("true", "")).remove("pageNo").toString()

  #价格库存销量上架时间组合筛选
  setSort: ->
    if sort = $.query.get("sort")
      className = ''
      switch sort
          when 0 then className = "icon-feebas icon-feebas-sort-down"
          when 1 then className = "icon-feebas icon-feebas-sort-up"
          when 2 then className = "icon-feebas icon-feebas-sort-down"
          else
            className = "icon-feebas icon-feebas-sort-down"
        if parseInt(sort) isnt 0
          $('.js-item-sort i').parent().addClass("active")
        $('.js-item-sort i').removeClass().addClass className

  #组合筛选
  itemSortClick: ->
    sortCache = []

    if $(@).hasClass("active")
      if $(@).find("i").hasClass("icon-feebas-sort-down")
        $(@).find("i").removeClass().addClass "icon-feebas icon-feebas-sort-up"
      else
        $(@).find("i").removeClass().addClass "icon-feebas icon-feebas-sort-down"
        $(@).removeClass("active")
    else
      $(@).find("i").removeClass().addClass "icon-feebas icon-feebas-sort-down"
      $(@).addClass("active")
      $(@).siblings().removeClass("active")
      $(@).siblings().find("i").removeClass().addClass "icon-feebas icon-feebas-sort-down"

    $.each $(".js-item-sort i"), (i, d)->
      index = $(@).closest(".js-item-sort").data("index")
      if $(@).parent().hasClass("active")
        if $(@).hasClass("icon-feebas-sort-down")
          sort = 2
        else
          sort = 1
      else
        sort = 0
      sortCache[index] = sort
    sort = sortCache.join("_")
    window.location.search = $.query.set("sort", sort).remove("pageNo").toString()

  #价格筛选
  changePriceFilter: ->
    thisName = $(@).attr("name")
    tempNum = $(@).data("value")
    if $(@).val()
      thisNum = centFormat($(@).val())
    else
      thisNum = ""
    if thisNum isnt tempNum
      window.location.search = $.query.set(thisName, thisNum).remove("pageNo").toString()

  #提交价格区间筛选
  filterFormSubmit: (evt)->
    evt.preventDefault()
    p_f = centFormat($.trim $(@).find('input[name=p_f]').val())
    p_t = centFormat($.trim $(@).find('input[name=p_t]').val())
    max = 999999999
    min = 0
    if p_t == ""
      pf = if (p_f == "" || p_f < min) then min else p_f
      pt = max
    else
      pf = Math.min(p_t,p_f)
      pt = Math.max(p_t,p_f)

      pf = if pf > max then max else pf
      pf = if pf < min then min else pf

      pt = if pt > max then max else pt
      pt = if pt < min then min else pt
    window.location.search = $.query.set("p_f", pf).set("p_t", pt).remove("pageNo").toString()

  clearPriceFilter: =>
    window.location.search = $.query.remove("p_f").remove("p_t").remove("pageNo").toString()

  #切换多选规格的选中
  toggleCheck: ->
    if $(@).hasClass("checked")
      $(@).removeClass("checked")
    else
      $(@).addClass("checked")

module.exports = ItemsList

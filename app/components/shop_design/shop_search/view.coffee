ItemList = require "design/items_search/view"

class ShopSearch extends ItemList
  constructor: ($) ->
    # @$secondTagList = $(".second-tag-list")
    # @$categoryNav = $(".category-nav")
    # @$toggleMoreAttrs = $(".toggleMore")
    # @$pfBtn = $("[name=p_f]")
    # @$ptBtn = $("[name=p_t]")
    # @$displayBtn = $(".js-list-display")
    # @$optionBtn = $(".attr")
    super
    # @bindEvent()

  #面包屑后台类目筛选
  breadCategorySelectorClick: ->
    shopCatId = $(@).data("id")
    if shopCatId is 0
      window.location.search = $.query.remove("attrs").remove("shopCatId").remove("pageNo")
    else
      window.location.search = $.query.remove("attrs").set("shopCatId", shopCatId).remove("pageNo").toString()

  # 类目筛选
  categorySelectorClick: ->
    window.location.search = $.query.set("shopCatId", $(@).data("key")).remove("pageNo").toString()

  # bindEvent: ->
  #   super
  #   @showMoreTag()
  #   @$toggleMoreAttrs.on "click", @toggleMoreAttrs
  #   @$pfBtn.on "blur", @changePriceFilter
  #   @$ptBtn.on "blur", @changePriceFilter
  #   @$displayBtn.on "click", @changeDisplayType
  #   @$optionBtn.on "click", @toggleCheck

  # showMoreTag: ->
  #   if @$toggleMoreAttrs.data("length") > 4
  #     @$toggleMoreAttrs.show()
  #     @filterForm.closest(".shop-search-filter").css("margin-top", "20px")
  #   $.each $("td.attr-list"), (n,el) ->
  #     moreBtn = $(el).closest("tr").find(".js-more")
  #     attrLength = $(el).data("length")
  #     if attrLength > 4
  #       moreBtn.removeClass("hide")

  # #多选
  # electsBrands: ->
  #   thisDl = $(@).closest("tr")
  #   thisDl.addClass("active").prev().addClass("nbb")
  #   thisDl.find("ul").css("overflow-y", "visible")
  #   $.each $("td", thisDl), (i, td)->
  #     $(td).find("div.attr").show().siblings("a").hide()
  #   thisDl.find(".list-more").addClass("active")
  #   thisDl.find(".brand-buttons").show()

  # #品牌多选确认
  # brandConfirm: ->
  #   thisDl = $(@).closest("dl")
  #   brands = []
  #   $.each $(".brand-dd", thisDl), (i, dd)->
  #     if $(dd).find("input:checked").length > 0
  #       brands.push $(dd).find("input:checked").val()
  #   if brands.length is 0
  #     # new Tip({parent: thisDl.find(".brand-list"), direct: "up", type: "tip", message: "请至少选择一个品牌", top: 40, left: 0, width: 140}).tip()
  #   else
  #     bids = brands.join("_")
  #     window.location.search = $.query.set("bids", bids).remove("bid").toString()

  # #属性多选确认
  # attrsConfirm: ->
  #   thisDl = $(@).closest("tr")
  #   attrname = $(thisDl).find("th").text().trim()+":"
  #   if $.query.get("attrs") is true
  #     attrs = []
  #   else
  #     attrs = $.query.get("attrs").split("_")
  #   $.each $(".attr-dd", thisDl), (i, dd)->
  #     if $(dd).find("div.checked").length > 0
  #       attrs.push (attrname + $(dd).find("div.checked").data("value"))
  #   if attrs.length is 0

  #   else
  #     attrs = attrs.join("_")
  #     window.location.search = $.query.set("attrs",attrs).remove("attr").toString()

  # #后台类目多选确认
  # categoryConfirm: ->
  #   thisDl = $(@).closest("dl")
  #   bcids = []
  #   $.each $(".category-dd", thisDl), (i, dd)->
  #     if $(dd).find("input:checked").length > 0
  #       bcids.push $(dd).find("input:checked").val()
  #   if bcids.length is 0

  #   else
  #     bcids = bcids.join("_")
  #     window.location.search = $.query.set("bcids",bcids).toString()

  # #品牌多选取消
  # brandCancel: ->
  #   thisDl = $(@).closest("tr")
  #   # thisDl.find(".list-more").css("height","35px")
  #   $.each $(".dd-cancel", thisDl), (i, dd)->
  #     $(dd).find("div.attr").removeClass("checked")
  #     $(dd).find("div.attr").hide().siblings("a").show()
  #   thisDl.find(".list-more").removeClass("active")
  #   thisDl.removeClass("active").prev().removeClass("nbb")
  #   thisDl.find("ul").css("overflow-y", "hidden")
  #   thisDl.find(".brand-buttons").hide()

  # #分类更多
  # categoriesMore: ->
  #   thisDl = $(@).closest("tr")
  #   if thisDl.find(".js-more span").text() is "#{Language.sq}"
  #     thisDl.find("ul").css("overflow-y", "hidden")
  #     thisDl.find(".js-more span").text("#{Language.zk}")
  #     thisDl.find(".js-more i").removeClass("icon-feebas-xiangshangzhedie").addClass("icon-feebas-xiangxiazhedie")
  #   else
  #     thisDl.find("ul").css("overflow-y", "visible")
  #     thisDl.find(".js-more span").text("#{Language.sq}")
  #     thisDl.find(".js-more i").removeClass("icon-feebas-xiangxiazhedie").addClass("icon-feebas-xiangshangzhedie")

  # #查看更多规格
  # toggleMoreAttrs: ->
  #   trs = $(@).closest(".shop-search-attrs").find("tr.hide")
  #   if $(@).find("span").text() is "#{Language.toggleMore}"
  #     $(@).find("span").text("#{Language.toggleLess}")
  #     $(@).find("i").removeClass("icon-feebas-xiangxiazhedie").addClass("icon-feebas-xiangshangzhedie")
  #     trs.show()
  #   else
  #     $(@).find("span").text("#{Language.toggleMore}")
  #     $(@).find("i").removeClass("icon-feebas-xiangshangzhedie").addClass("icon-feebas-xiangxiazhedie")
  #     trs.hide()

  # # 设置属性
  # propertySelectorClick: ->
  #   attrs = undefined
  #   if attrs = "" + $.query.get("attrs")
  #     arrays = attrs.split("_")
  #     arrays.push($(@).closest(".attr-list").siblings("th").text()+":"+$(this).data("attr"))
  #     attrs = arrays.join("_")
  #   else
  #     attrs = $(@).closest(".attr-list").siblings("th").text()+":"+$(this).data("attr")
  #   window.location.search = $.query.set("attrs", attrs.replace("true", "")).remove("pageNo").toString()

  # #价格库存销量上架时间组合筛选
  # setSort: ->
  #   if sort = $.query.get("sort")
  #     sorts = sort.split("_")
  #     _.each $(".js-item-sort i"), (icon, idx) ->
  #       className = ""
  #       idxTemp = 0
  #       switch idx
  #         when 0 then idxTemp = 2
  #         when 1 then idxTemp = 3
  #         when 2 then idxTemp = 0
  #       switch sorts[idxTemp]
  #         when "0" then className = "icon-feebas icon-feebas-sort-down"
  #         when "1" then className = "icon-feebas icon-feebas-sort-up"
  #         when "2" then className = "icon-feebas icon-feebas-sort-down"
  #         else
  #           className = "icon-feebas icon-feebas-sort-down"
  #       if parseInt(sorts[idxTemp]) isnt 0
  #         $(icon).parent().addClass("active")
  #       $(icon).removeClass().addClass className

  # #组合筛选
  # itemSortClick: ->
  #   sortCache = []
  #   if $(@).hasClass("active")
  #     if $(@).find("i").hasClass("icon-feebas-sort-down")
  #       $(@).find("i").removeClass().addClass "icon-feebas icon-feebas-sort-up"
  #     else
  #       $(@).find("i").removeClass().addClass "icon-feebas icon-feebas-sort-down"
  #       $(@).removeClass("active")
  #   else
  #     $(@).find("i").removeClass().addClass "icon-feebas icon-feebas-sort-down"
  #     $(@).addClass("active")

  #   $.each $(".js-item-sort i"), (i, d)->
  #     if $(@).parent().hasClass("active")
  #       if $(@).hasClass("icon-feebas-sort-down")
  #         sort = 2
  #       else
  #         sort = 1
  #     else
  #       sort = 0
  #     if i is 2
  #       sortCache[0] = sort
  #     else
  #       sortCache[i+2] = sort
  #   sortCache[1] = 0
  #   console.log(sortCache)
  #   sort = sortCache.join("_")
  #   window.location.search = $.query.set("sort", sort).remove("pageNo").toString()

  # #价格筛选
  # changePriceFilter: ->
  #   thisName = $(@).attr("name")
  #   tempNum = $(@).data("value")
  #   if $(@).val()
  #     thisNum = $(@).val() * 100
  #   else
  #     thisNum = ""
  #   if thisNum isnt tempNum
  #     window.location.search = $.query.set(thisName, thisNum).remove("pageNo").toString()

  # #列表大小图切换
  # changeDisplayType: ->
  #   thisVal = $(@).data("value")
  #   if !$(@).hasClass("active")
  #     console.log(thisVal)
  #     window.location.search = $.query.set("display", thisVal).remove("pageNo").toString()

  # #切换多选规格的选中
  # toggleCheck: ->
  #   if $(@).hasClass("checked")
  #     $(@).removeClass("checked")
  #   else
  #     $(@).addClass("checked")

module.exports = ShopSearch

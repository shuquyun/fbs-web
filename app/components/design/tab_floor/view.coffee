itemTemplates = Handlebars.templates["design/tab_floor/frontend_templates/items"]
class DesignTabFloor

  constructor: ($) ->
    @$tab = @$el.find(".tab")
    @bindEvents()

  bindEvents: ->
    @initTab()

  initTab: =>
    @$tab.tab({events: "click mouseover", after: @changeTabCallback})
    if(@$el.find(".tab-content.first-content").hasClass("tab-item-content"))
      @getItems(@$el.find(".tab-content.first-content .product").data("ids"), 0)

  changeTabCallback: (data)=>
    if(@$el.find(".tab-content-#{data}").data("isLoad") != 1)
      @getItems(@$el.find(".tab-content-#{data} .product").data("ids"), data)
      @$el.find(".tab-content-#{data} .unite img").attr("src", @$el.find(".tab-content-#{data} .unite img").data("url"))
      @$el.find(".tab-content-#{data}").data("isLoad", 1)
    else
      @$el.find(".tab-content-#{data}").show().siblings(".tab-content").hide()

  # 获取商品列表
  getItems: (itemIds, index) =>
    $.ajax
      url: "/api/items?ids=#{itemIds}"
      type: "GET"
      success: (data)=>
        data = data[0...9]
        @$el.find(".tab-content-#{index} .product").empty().append(itemTemplates({data: data}))

module.exports = DesignTabFloor

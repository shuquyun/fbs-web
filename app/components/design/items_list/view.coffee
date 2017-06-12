class ItemsList
  itemTemplate = Handlebars.templates["design/items_list/frontend_templates/item_template"]

  constructor: ($)->
    @thisItems = @$el
    @renderItems()
    @bindEvent()

  bindEvent: ->

  renderItems: ->
    ids = @thisItems.find(".items").data("ids")
    spuIds = @thisItems.find(".items").data("spus")
    url = "/api/item/list2"
    data = {"ids": ids}
    if ids is ""
      url = "/api/defaultItems"
      data = {"spuIds": spuIds, "dataSource": "manual"}
    else
      $.ajax
        url: url
        type: "GET"
        data: data
        success: (data)=>
          href = @thisItems.find(".items").data("href")
          if ids is ""
            $.each data, (i, item)->
              item.isDefaultItem = 1
          @thisItems.find(".items").append(itemTemplate({DATA: data, href: href}))
module.exports = ItemsList

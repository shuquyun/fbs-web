class CategoryTag
  constructor: ($)->
    @itemAll = ".js-all-items"
    @itemNoTag = ".js-no-tag-items"

  bindEvent: ->
    $(".item-sort").on "click", @itemNoTag, @linkNoTagItems
    $(".item-sort").on "click", @itemAll, @linkAllItems

  #列出所有商品
  linkAllItems: =>
    window.location.search = $.query.empty()

  #列出未分类商品
  linkNoTagItems: =>
    window.location.search = $.query.set("tag", "").toString()

  #根据URL判断active
  renderTagActive: ->
    tag = $.query.get("tag")
    $(".menu-li").removeClass("active")
    switch tag
      when true then $(".menu-li.js-no-tag-items").addClass("active")
      when "" then $(".menu-li.js-all-items").addClass("active")
      else
        $.each $(".category-li "), (i, li)->
          if $(li).data("name") is tag
            $(li).addClass("active")
            return false

module.exports = CategoryTag

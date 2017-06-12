class ArticlesCategories
  constructor: ($)->
    @bindEvent()

  bindEvent: =>
    $(document).on "click", ".shouqi", @listUp
    $(document).on "click", ".zhankai", @listDown

  listUp: (evt)->
    obj = $(evt.currentTarget)
    obj.removeClass("icon-feebas-shouqi-copy shouqi").addClass("icon-feebas-zhankai-copy zhankai")
    obj.closest("li").find("ul").hide()

  listDown: (evt)=>
    obj = $(evt.currentTarget)
    obj.removeClass("icon-feebas-zhankai-copy zhankai").addClass("icon-feebas-shouqi-copy shouqi")
    obj.closest("li").find("ul").show()

module.exports = ArticlesCategories

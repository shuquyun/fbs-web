Properties = require "eevee/config/properties"

module.exports = ->
  @baseInfo.name = "店铺商品推荐"
  @baseInfo.description = "店铺商品推荐"

  @configs.ext =
    name: "组件设置"

  imageProperty = new Properties.ImageProperty @,
    name: "image"
    label: "图片链接"
    description: "为推荐商品设置图片"
    type: "button"
    useData: true
    reRender: true
    options:
      "url": "<i class=\"fa fa-picture-o\"></i>&nbsp;选择或上传图片"
    setCallback: (url) ->
      unless url
        Essage.show
          message: "图片组件不能将图片设置为空"
          status: "warning"
        , 2000
        return
      @$target.find(".recommend-image").attr("src", url)

  itemProperty = new Properties.Property @,
    name: "id"
    label: "商品编号"
    description: "店铺内商品编号"
    type: "text"
    useData: true
    reRender: true

  @registerConfigProperty "ext", imageProperty, itemProperty

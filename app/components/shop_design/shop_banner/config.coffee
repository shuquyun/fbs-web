{definedProperty, ImagePropery, PropertyBr, definedImageProperty} = require 'eevee/config/properties';

module.exports = ->
  @baseInfo.name = "店铺banner和评分"
  @baseInfo.description = "店铺banner和评分"

  @configs.ext =
    name: "组件设置"

  heightProperty = definedProperty @,
    name: "height"
    label: "组件高度"
    description: "整数，如100"
    type: "text"
    useData: true
    reRender: true

  backImagePicProperty = definedImageProperty @,
    name: "backImage"
    label: "背景图"
    description: "选择图片"
    useData: true
    reRender: true
    options:
      "url": "<i class=\"fa fa-picture-o\"></i>"

  @registerConfigProperty "ext", backImagePicProperty

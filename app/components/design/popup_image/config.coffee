{definedProperty, ImagePropery, PropertyBr, definedImageProperty, definedDialogProperty} = require 'eevee/config/properties'

module.exports = ->
  @baseInfo.name = "可关闭广告位"
  @baseInfo.description = "广告位，可关闭"

  @configs.ext =
    name: "组件设置"

  imageProp = definedImageProperty @,
    name: "src"
    label: "广告图片"
    description: "广告位图片"
    useData: true
    reRender: true
    options:
      "url": "<i class=\"fa fa-picture-o\"></i>"

  hrefProp = definedProperty @,
    name: "href"
    label: "广告链接"
    desc: "用户点击后跳转的链接"
    type: "text"
    useData: true
    reRender: true

  widthProp = definedProperty @,
    name: "width"
    label: "广告宽度"
    desc: "广告位图片宽度,请输入正整数,不填则宽度100%"
    type: "text"
    useData: true
    reRender: true

  heightProp = definedProperty @,
    name: "height"
    label: "广告高度"
    desc: "广告位图片高度,请输入正整数,不填则高度100%"
    type: "text"
    useData: true
    reRender: true

  backgroundColorProp = definedProperty @,
    name: "backgroundColor"
    label: "背景色"
    desc: "广告延伸背景色，请填写16进制颜色表示值，如f5f5f5"
    type: "text"
    useData: true
    reRender: true

  @registerConfigProperty "ext", imageProp, new PropertyBr(), hrefProp, new PropertyBr(), heightProp, new PropertyBr(), widthProp, new PropertyBr(), backgroundColorProp

{definedProperty, ImagePropery, PropertyBr, definedImageProperty, definedDialogProperty} = require 'eevee/config/properties';

module.exports = ->
  @baseInfo.name = "优惠券设置"
  @baseInfo.description = "优惠券设置组件。"

  @configs.ext =
    name: "组件设置"

  couponIdProperty = definedProperty @,
    name: "id"
    label: "优惠券id"
    description: "填写优惠券id"
    type: "text"
    useData: true
    reRender: true

  couponImageProperty = definedImageProperty @,
    name: "image"
    label: "优惠券图片"
    description: "选择优惠券图片"
    useData: true
    reRender: true
    options:
      "url": "<i class=\"fa fa-picture-o\"></i>"

  imageWidthProperty = definedProperty @,
    name: "imageWidth"
    label: "图片宽度"
    description: "请填写图片宽度"
    type: "text"
    useData: true
    reRender: true

  imageHeightProperty = definedProperty @,
    name: "imageHeight"
    label: "图片高度"
    description: "请填写图片高度"
    type: "text"
    useData: true
    reRender: true

  @registerConfigProperty "ext", couponIdProperty, couponImageProperty, imageWidthProperty, imageHeightProperty

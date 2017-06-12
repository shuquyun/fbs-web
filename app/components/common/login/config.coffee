{definedProperty, ImagePropery, PropertyBr, definedImageProperty, definedDialogProperty} = require 'eevee/config/properties';

module.exports = ->
  @baseInfo.name = "登录框"
  @baseInfo.description = "登录组件组件"

  @configs.ext =
    name: "组件设置"

  imgProperty = definedImageProperty @,
    name: "background"
    label: "图片"
    description: "设定背景图"
    type: "button"
    useData: true
    reRender: true
    options:
      "url": "<i class=\"fa fa-picture-o\"></i>"

  typeProperty = definedProperty @,
    name: "copartnerId"
    label: "公司ID"
    description: "输入公司ID"
    type: "text"
    useData: true
    reRender: true

  @registerConfigProperty "ext", imgProperty, typeProperty

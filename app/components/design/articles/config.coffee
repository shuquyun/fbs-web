{definedProperty, ImagePropery, PropertyBr, definedImageProperty, definedDialogProperty} = require 'eevee/config/properties';

module.exports = ->
  @baseInfo.name = "首页公告设置"
  @baseInfo.description = "首页公告组件。"

  @configs.ext =
    name: "组件设置"

  categoryIdProperty = definedProperty @,
    name: "categoryId"
    label: "分类id"
    description: "填写分类id"
    type: "text"
    useData: true
    reRender: true

  showLimitProperty = definedProperty @,
    name: "pageSize"
    label: "显示条数"
    description: "填写显示条数"
    type: "text"
    useData: true
    reRender: true

  @registerConfigProperty "ext", categoryIdProperty, showLimitProperty

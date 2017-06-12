{definedProperty, ImagePropery, PropertyBr, definedImageProperty, definedDialogProperty} = require 'eevee/config/properties';


module.exports = ->
  @baseInfo.name = "店铺头部商品搜索框"
  @baseInfo.description = "跨店铺与全站商品搜索框"

  @configs.ext =
    name: "组件设置"

  placeholderProperty = definedProperty @,
    name: "placeholder"
    label: "预置搜索词"
    description: "搜索框内预置搜索词"
    type: "text"
    default: "请输入搜索词"
    useData: true
    reRender: true

  @registerConfigProperty "ext", placeholderProperty

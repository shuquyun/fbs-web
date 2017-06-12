{definedProperty, ImagePropery, PropertyBr, definedImageProperty, definedDialogProperty} = require 'eevee/config/properties';

module.exports = ->
  @baseInfo.name = "商品主搜列表"
  @baseInfo.description = "商品主搜列表"

  @configs.ext =
    name: "组件设置"

  showBandLogoProperty = definedProperty @,
    name: "showBandLogo"
    label: "是否显示品牌Logo"
    description: "设置是否显示品牌Logo"
    type: "radio"
    options:
      "1": "显示"
      "0": "不显示"
    default: "1"
    useData: true
    reRender: true

  @registerConfigProperty "ext", showBandLogoProperty


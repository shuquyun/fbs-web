Properties = require "eevee/config/properties"
module.exports = ->
  @baseInfo.name = "吊顶装修"
  @baseInfo.description = "吊顶装修组件"

  @configs.ext =
    name: "组件设置"

  webNameProperty = new Properties.Property @,
    name: "webName"
    label: "网站名"
    description: "设置网站名"
    type: "text"
    default: "大企汇"
    useData: true
    reRender: true

  @registerConfigProperty "ext", webNameProperty

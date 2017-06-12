{definedProperty} = require 'eevee/config/properties'

module.exports = ->
  @baseInfo.name = "店铺搜索"
  @baseInfo.description = "店铺搜索"

  @configs.ext =
    name: "组件设置"

  showHotKeywords = definedProperty @,
    name: "showHotKeywords"
    label: "是否显示店铺热搜"
    description: "设置是否显示店铺热搜"
    type: "radio"
    options:
      "1": "显示"
      "0": "不显示"
    default: "1"
    useData: true
    reRender: true

  @registerConfigProperty "ext", showHotKeywords

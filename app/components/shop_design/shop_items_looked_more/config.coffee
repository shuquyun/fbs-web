{definedProperty} = require 'eevee/config/properties'

module.exports = ->
  @baseInfo.name = "看了又看"
  @baseInfo.description = "店铺商品销量排序"

  @configs.ext =
    name: "组件设置"

  idsProperty = definedProperty @,
    name: "ids"
    label: "商品编号集合"
    description: "商品编号集合，逗号分隔，最多6个，如：1,2,3,4,5,6"
    type: "text"
    useData: true
    reRender: true
    reduce: (config, value) ->
      config.ids = if value then value.split(",")[0..5] else ""
      @_reduce(config, config.ids.join(","))

  @registerConfigProperty "ext", idsProperty

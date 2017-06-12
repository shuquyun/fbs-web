{definedProperty, ImagePropery, PropertyBr, definedImageProperty, definedDialogProperty} = require 'eevee/config/properties';
module.exports = ->
  @baseInfo.name = "多栏商品"
  @baseInfo.description = "店铺内商品展示组件。"

  @configs.ext =
    name: "组件设置"

  hasBorder = definedProperty @,
    name: "hasBorder"
    label: "是否需要边"
    type: "radio"
    options:
      "0": "不需要"
      "1": "需要"
    useData: true
    reRender: true

  itemsProperty = definedProperty @,
    name: "ids"
    label: "商品编号"
    description: "需要展现的商品的编号 ，多个商品编号之间用空格分隔，最多 12 个"
    type: "text"
    useData: true
    reRender: true
    get: ->
      data = @_get()
      if data is undefined then "" else data.split("_").join(" ")
    reduce: (config, value) ->
      value = value.trim()
      if value is ""
        config.ids = undefined
        @_reduce config, undefined
      else
        ids = value.split(/\s+/)
        if ids.length > 12
          Essage.show
            message: "最多支持 12 个商品，超出部分将被忽略"
            status: "warning"
          , 2000
          ids = ids[...12]
        config.ids = ids
        @_reduce config, ids.join("_")
    init: ->
      @hide() if dataSourceProperty.get() is "auto"


  countProperty = definedProperty @,
    name: "size"
    label: "显示数量"
    description: "显示多少行商品"
    type: "radio"
    options:
      "1": "一行"
      "2": "两行"
      "3": "三行"
    default: 1
    useData: true
    reRender: true
    get: ->
      @_get() / 5
    reduce: (config, value) ->
      config.size = parseInt(value) * 5
      @_reduce(config, parseInt(value) * 5)
    init: ->
      @hide() if dataSourceProperty.get() is "manual"

  # three_item_list will override this
  @countProperty = countProperty

  @registerConfigProperty "ext", itemsProperty, countProperty

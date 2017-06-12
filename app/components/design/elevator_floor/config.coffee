Properties = require "eevee/config/properties"

module.exports = ->
  @baseInfo.name = "楼层商品"
  @baseInfo.description = "楼层商品列表"

  @configs.ext =
    name: "组件设置"

  floorNameProperty = new Properties.Property @,
    name: "floorName"
    label: "楼层名"
    description: "输入楼层名"
    type: "text"
    useData: true
    reRender: true

  # otherCategoryProperty = new Properties.Property @,


  mainImageProperty = new Properties.ImageProperty @,
    name: "mainImg"
    label: "左侧主图"
    description: "配置左侧主图"
    type: "button"
    useData: true
    reRender: true
    options:
      "url": "<i class=\"fa fa-picture-o\"></i>&nbsp;"

  mainUrlProperty = new Properties.Property @,
    name: "mainUrl"
    label: "主图跳转"
    description: "输入主图跳转链接地址"
    type: "text"
    reRender: true
    useData: true

  itemIdsProperty = new Properties.Property @,
    name: "itemIds"
    label: "商品ID"
    description: "请输入6个商品ID，以英文逗号分隔，如1,2,3,4"
    type: "text"
    useData: true
    reRender: true
    get: ->
      value = @_get()

    set: (value)->
      value = $.trim(value)
      value = value.split(",")
      @_set _.map value, Number

  brandIdsProperty = new Properties.Property @,
    name: "brandIds"
    label: "品牌ID"
    description: "请输入6个品牌ID，以英文逗号分隔，如1,2,3,4"
    type: "text"
    useData: true
    reRender: true
    get: ->
      value = @_get()

    set: (value)->
      value = $.trim(value)
      value = value.split(",")
      @_set _.map value, Number


  @registerConfigProperty "ext", floorNameProperty, mainImageProperty, mainUrlProperty, itemIdsProperty, brandIdsProperty

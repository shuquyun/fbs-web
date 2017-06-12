Properties = require "eevee/config/properties"

module.exports = ->
  @baseInfo.name = "商品两列展示"
  @baseInfo.description = "商品两列展示"

  @configs.ext =
    name: "组件设置"

  orderProperty = new Properties.Property @,
    name: "order"
    label: "排序方式"
    description: "选择商品的排序方式"
    type: "radio"
    options:
      "2": "770-1-1"
      "3": "770-1-2"
      "4": "980-1-1"
      "5": "980-1-2"
    default: "2"
    useData: true
    reRender: true

  item1Property = new Properties.Property @,
    name: "item1"
    label: "推广1链接"
    description: "设置推广位1的超链接"
    type: "text"
    useData: true
    reRender: true

  img1Property = new Properties.ImageProperty @,
    name: "img1"
    label: "推广1图片"
    description: "推广位1的图片"
    type: "button"
    useData: true
    options:
      "url": "<i class=\"fa fa-picture-o\"></i>&nbsp;选择或上传图片"
    setCallback: (url) ->
      unless url
        Essage.show
          message: "图片组件不能将图片设置为空"
          status: "warning"
        , 2000
        return
      @$target.find(".img1").attr("src", url)

  item2Property = new Properties.Property @,
    name: "item2"
    label: "推广2链接"
    description: "设置推广位2的超链接"
    type: "text"
    useData: true
    reRender: true

  img2Property = new Properties.ImageProperty @,
    name: "img2"
    label: "推广2图片"
    description: "推广位2的图片"
    type: "button"
    useData: true
    options:
      "url": "<i class=\"fa fa-picture-o\"></i>&nbsp;选择或上传图片"
    setCallback: (url) ->
      unless url
        Essage.show
          message: "图片组件不能将图片设置为空"
          status: "warning"
        , 2000
        return
      @$target.find(".img2").attr("src", url)

  item3Property = new Properties.Property @,
    name: "item3"
    label: "推广3链接"
    description: "设置推广位3的超链接"
    type: "text"
    useData: true
    reRender: true
    init: ->
      @hide() if orderProperty.get() is "2" or orderProperty.get() is "4"

  img3Property = new Properties.ImageProperty @,
    name: "img3"
    label: "推广3图片"
    description: "推广位3的图片"
    type: "button"
    useData: true
    options:
      "url": "<i class=\"fa fa-picture-o\"></i>&nbsp;选择或上传图片"
    setCallback: (url) ->
      unless url
        Essage.show
          message: "图片组件不能将图片设置为空"
          status: "warning"
        , 2000
        return
      @$target.find(".img3").attr("src", url)
    init: ->
      @hide() if orderProperty.get() is "2" or orderProperty.get() is "4"

  idsProperty = new Properties.Property @,
    name: "ids"
    label: "商品ID"
    description: "请输入商品ID 最多输入4个 用空格间隔"
    type: "text"
    useData: true
    reRender: true
    set:(value)->
      value = value.trim()
      if value isnt ""
        value = value.split(/\s+/)
      if value.length > 4
        Essage.show
          message: "最多支持 4 个商品，超出部分将被忽略"
          status: "warning"
        , 2000
        value = value[...4]
      if value.length > 0
        value = value.join(" ")
      @_set value

  spuIdsProperty = new Properties.Property @,
    name: "spuIds"
    label: "spuIds"
    description: "请输入SPU Ids 最多输入4个 用空格间隔 若输入商品ID 该项无效"
    type: "text"
    useData: true
    reRender: true
    get: ->
      value = @_get()
      if value is "" or value is undefined
      else
        value = value.split("_").join(" ")
      value
    set:(value)->
      value = value.trim()
      if value isnt ""
        value = value.split(/\s+/)
      if value.length > 4
        Essage.show
          message: "最多支持 4 个商品，超出部分将被忽略"
          status: "warning"
        , 2000
        value = value[...4]
      if value.length > 0
        value = value.join("_")
      @_set value


  @registerConfigProperty "ext", orderProperty, item1Property, img1Property, item2Property, img2Property, item3Property, img3Property, idsProperty, spuIdsProperty

{definedProperty, ImagePropery, PropertyBr, definedImageProperty, definedDialogProperty} = require 'eevee/config/properties';
Confirm = require 'eevee/helpers/confirm';
module.exports = ->
  @baseInfo.name = "tab楼层组件"
  @baseInfo.description = "楼层组件"

  @configs.ext =
    name: "组件设置"

  @configs.ext2 =
    name: "第一屏各广告图"

  @configs.ext3 =
    name: "组件设置"

  navHeadProperty = definedProperty @,
    name: "navHead"
    label: "楼层名字"
    description: "如1F 饲料"
    type: "text"
    useData: true
    reRender: true

  navHeadColorProperty = definedProperty @,
    name: "navHeadTheme"
    label: "楼层主题色"
    description: "色号 如#000000"
    type: "text"
    useData: true
    reRender: true

  isShowFirstTabProperty = definedProperty @,
    name: "showFirst"
    label: "显示第一栏"
    description: "是否显示第一栏"
    type: "radio"
    options:
      "-1" : "不显示"
      "1" : "显示"
    default: "1"
    useData: true
    reRender: true

  firstTabTitleProperty = definedProperty @,
    name: "firstTabTitle"
    label: "第一栏标题"
    description: "第一栏标题"
    type: "text"
    default: "热门"
    useData: true
    reRender: true

  navProperty = definedProperty @,
    name: "navs"
    label: "标题列表名称"
    description: "逗号分隔，如饲料1,饲料2.."
    type: "text"
    useData: true
    reRender: true
    get: ()->
      return @_get().join(",") if @_get()
    reduce: (config, value) ->
      config.navs = value.split(",") if value
      @_reduce(config, value.split(","))

  deleteProperty = definedProperty @,
    name: "deleteId"
    label: "删除tab的序号"
    description: "删除的tab序号是第几项"
    type: "text"
    reRender: true
    get: ()->
      return ""
    reduce: (config, value) ->
      if(!isNaN(value))
        newData = _.reject(config.tabData, (data, idx)-> return (idx + 1) is parseInt(value))
        config.tabData = newData
        @_reduce config, ""


  uniteBrandPicProperty = definedImageProperty @,
    name: "mainAdImage"
    label: "热门广告主图"
    description: "选择图片"
    useData: true
    reRender: true
    options:
      "url": "<i class=\"fa fa-picture-o\"></i>"

  uniteBrandHrefProperty = definedProperty @,
    name: "mainAdImageHref"
    label: "热门广告主图的url"
    type: "text"
    description: " 图片的url"
    useData: true
    reRender: true
    get: ->
      uniteBrandPicProperty.get()

  navProps = []
  _.times 7, (i) =>
    index = i + 1
    navProps.push definedImageProperty @,
      name: "firstImage#{index}"
      label: "第#{index}个图"
      description: "为第1屏第#{index}个图选择图片"
      useData: true
      reRender: true
      options:
        "url": "<i class=\"fa fa-picture-o\"></i>"

    navProps.push definedProperty @,
      name: "firstImageHref#{index}"
      label: "第#{index}个图链接"
      description: "为第1屏第#{index}个图链接"
      useData: true
      reRender: true
      type: "text"


  props = []
  if navProperty.get()
    _.times navProperty.get().split(",").length, (i) =>
      index = i + 1
      props.push definedDialogProperty @,
        name: "tabData[#{i}]"
        label: "第#{index}栏tab内容"
        description: "为第#{index}屏选择图片"
        useData: true
        reRender: true
        options:
          "url": "<i class=\"fa fa-picture-o\"></i>"
        formFields: [
          {
            name: 'itemIds',
            label: '商品IDs',
            type: 'text'
          }
        ]




  @registerConfigProperty "ext",  navHeadProperty, navHeadColorProperty, navProperty, new PropertyBr(), isShowFirstTabProperty, firstTabTitleProperty, uniteBrandPicProperty, new PropertyBr(), uniteBrandHrefProperty
  @registerConfigProperty.apply @, ["ext2"].concat(navProps)
  @registerConfigProperty.apply @, ["ext3"].concat(props)

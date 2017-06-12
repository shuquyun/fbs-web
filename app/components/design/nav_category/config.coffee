{definedProperty, ImagePropery, PropertyBr, definedImageProperty, definedDialogProperty} = require 'eevee/config/properties';

module.exports = ->
  @baseInfo.name = "导航栏设置"
  @baseInfo.description = "导航栏设置组件。"

  @configs.ext =
    name: "组件设置"

  @configs.ext2 =
    name: "每层类目设置"

  idsProperty = definedProperty @,
    name: "ids"
    label: "展示类目列表"
    description: "填写需要展示的前台一级类目id列表，逗号分隔，id顺序即展示顺序"
    type: "text"
    useData: true
    reRender: true

  imageProps = []
  _.times 6, (i) =>
    index = i + 1
    imageProps.push({
      name: "image[#{i}].src"
      label: "第#{index}个图"
      type: "image"
    })

    imageProps.push({
      name: "image[#{i}].herf"
      label: "第#{index}个图链接"
      type: "text"
    })

  navProps = []
  ids = idsProperty.get()
  if ids
    _.times ids.split(",").length, (i) =>
      index = i + 1
      navProps.push definedDialogProperty @,
        name: "nav[#{i}]"
        label: "第#{index}个类目内容"
        description: "为第#{index}个类目选择图片"
        useData: true
        reRender: true
        options:
          "url": "<i class=\"fa fa-picture-o\"></i>"
        formFields: imageProps

  @registerConfigProperty "ext", idsProperty
  @registerConfigProperty.apply @, ["ext2"].concat(navProps)

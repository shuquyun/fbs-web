{definedProperty, ImagePropery, PropertyBr, definedImageProperty, definedDialogProperty} = require 'eevee/config/properties';

module.exports = ->
  @baseInfo.name = ""
  @baseInfo.description = "楼层组件"

  @configs.ext2 =
    name: "第一屏各广告图"

  navProps = []
  _.times 5, (i) =>
    index = i + 1
    navProps.push definedImageProperty @,
      name: "slideImage#{index}"
      label: "第#{index}个图"
      description: "为第1屏第#{index}个图选择图片"
      useData: true
      reRender: true
      options:
        "url": "<i class=\"fa fa-picture-o\"></i>"

    navProps.push definedProperty @,
      name: "slideHref#{index}"
      label: "第#{index}个图链接"
      description: "为第1屏第#{index}个图链接"
      useData: true
      reRender: true
      type: "text"


  @registerConfigProperty.apply @, ["ext2"].concat(navProps)

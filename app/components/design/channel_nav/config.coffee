{definedProperty, ImagePropery, PropertyBr, definedImageProperty, definedDialogProperty} = require 'eevee/config/properties';

module.exports = ->
  @baseInfo.name = "导航栏设置"
  @baseInfo.description = "导航栏设置组件。"

  @configs.ext =
    name: "组件设置"

  countProperty = definedProperty @,
    name: "count"
    label: "频道分类个数"
    description: "站点频道个数"
    type: "text"
    useData: true
    reRender: true

  navProps = []
  count = countProperty.get()
  if count
    _.times count, (i) =>
      index = i + 1
      navProps.push(definedProperty @,
        name: "navs[#{i}].title"
        label: "第#{index}个标题"
        desc: "第#{index}个标题内容"
        type: "text"
        useData: true
        reRender: true
      )

      navProps.push(definedProperty @,
        name: "navs[#{i}].href"
        label: "第#{index}个标题链接"
        desc: "第#{index}个标题链接地址"
        type: "text"
        useData: true
        reRender: true
      )

  @registerConfigProperty "ext", countProperty
  @registerConfigProperty.apply @, ["ext"].concat(navProps)

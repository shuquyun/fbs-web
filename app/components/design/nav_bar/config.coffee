Properties = require "eevee/config/properties"
module.exports = ->
  @baseInfo.name = "导航栏设置"
  @baseInfo.description = "导航栏设置组件。"

  @configs.ext =
    name: "组件设置"

  navPropertySet = (value)->
    navTitles = []
    value = value.split("\n")
    $.each value, (i, d)->
      titlesCache = {}
      d = d.split(/\s+/)
      titlesCache.name = d[0]
      titlesCache.href = d[1]
      navTitles.push titlesCache
    navTitles

  widthProperty = new Properties.Property @,
    name: "size"
    label: "组件宽度"
    description: "为组件选择宽度"
    type: "radio"
    options:
      "big": "1200"
      "small": "1000"
    default: "big"
    useData: true
    reRender: true

  firstScreenProperty = new Properties.Property @,
    name: "_IS_FIRST_SCREEN_"
    label: "默认展开"
    description: "设置默认展开"
    type: "radio"
    options:
      "0": "不展开"
      "1": "展开"
    default: "0"
    useData: true
    reRender: true

  navProperty = new Properties.Property @,
    name: "navTitles"
    label: "导航名"
    description: "为导航栏设置名字和链接 请先填名字再填写链接 中间用空格分隔 每两个导航换行"
    type: "textarea"
    useData: true
    reRender: true
    get: ->
      data = @_get()
      titles = []
      if data is undefined
        data = []
      $.each data, (i, d)->
        titles[i] = d.name + " " + d.href
      titles = titles.join("\n")
    set: (value) ->
      value = value.trim()
      navTitles = []
      navTitles = navPropertySet(value)
      @_set navTitles

  idsProperty = new Properties.Property @,
    name: "ids"
    label: "展示类目列表"
    description: "填写需要展示的前台一级类目id列表，逗号分隔，id顺序即展示顺序"
    type: "text"
    useData: true
    reRender: true
    # set: (value)->


  currentProperty = new Properties.Property @,
    name: "current"
    label: "当前编辑类目位置"
    description: "填写当前需要编辑的类目位置，如第一个为 1"
    useData: false
    type: "text"
    set: (value)->
      @_set(value)
      $categoryLi = @$target.find(".category-li:eq(#{value-1})")
      if value <= 0 or $categoryLi.length is 0
        [linkProperty].concat(props).forEach (p) ->
          p.hide()
        @$target.find(".home-channel").addClass("disappear")
        return
      @$target.find(".home-channel").removeClass("disappear")
      @$target.find(".expand-panel").addClass("disappear")
      $categoryLi.find(".expand-panel").removeClass("disappear")
      href = $categoryLi.find(".parent-name").attr("href")
      linkProperty.show().mset(href).refresh()
      _.each [0..6], (i) =>
        img = $categoryLi.find(".image#{i + 1}").attr("src")
        props[i * 2].show().mset(img)
        href = $categoryLi.find(".href#{i + 1}").attr("href")
        props[i * 2 + 1].show().mset(href).refresh()

  linkProperty = new Properties.Property @,
    hide: true
    name: "link"
    label: "导航链接"
    description: "设置子站导航的超链接"
    type: "text"
    useData: false
    class: "small"
    set: (value) ->
      if not /^https?:\/\//.test(value)
        value = "http://" + value
      categoryIndex = currentProperty.get()
      @$target.find(".category-li:eq(#{categoryIndex-1})").find(".parent-name").attr("href", value)
      @_set value
      dataProperty.set()

  props = _.flatten([1..7].map (i) =>
    imageProperty = new Properties.ImageProperty @,
      hide: true
      name: "img#{i}"
      label: "推广#{i}图片"
      description: "推广位#{i}的图片"
      type: "button"
      useData: false
      options:
        "url": "<i class=\"fa fa-picture-o\"></i>"
      setCallback: (url) ->
        unless url
          Essage.show
            message: "图片组件不能将图片设置为空"
            status: "warning"
          , 2000
          return
        categoryIndex = currentProperty.get()
        @$target.find(".category-li:eq(#{categoryIndex-1})").data("image#{i}", url)
        @$target.find(".category-li:eq(#{categoryIndex-1})").find(".image#{i}").attr("src", url)
        dataProperty.set()

    hrefProperty = new Properties.Property @,
      hide: true
      name: "href#{i}"
      label: "推广#{i}链接"
      description: "设置推广位#{i}的超链接"
      type: "text"
      useData: false
      class: "small"
      set: (value)->
        if not /^https?:\/\//.test(value)
          value = "http://" + value
        categoryIndex = currentProperty.get()
        @$target.find(".category-li:eq(#{categoryIndex-1})").find(".href#{i}").attr("href", value)
        dataProperty.set()
    [imageProperty, hrefProperty]
  )

  dataProperty = new Properties.Property @,
    name: "data"
    type: "text"
    useData: true
    set: ->
      value = _.map @$target.find(".category-li"), (i) ->
        eachData = {}
        eachData.id = $(i).data("id")
        eachData.index = $(i).index() + 1
        eachData.icon = $(i).find(".category-icon").attr "src"
        eachData.link = $(i).find(".parent-name").attr "href"
        _.each [1..7], (j)->
          eachData["image#{j}"] = $(i).find(".image#{j}").attr("src")
          eachData["href#{j}"] = $(i).find(".href#{j}").attr("href")
        eachData
      @_set(value)

  @registerConfigProperty.apply @, ["ext", widthProperty, firstScreenProperty, navProperty, idsProperty, currentProperty, linkProperty].concat(props)

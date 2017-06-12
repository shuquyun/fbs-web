Pagination = require "pokeball/components/pagination"
Modal = require("pokeball").Modal

newFreightTemplate = Handlebars.templates["shop/freight/frontend_templates/new_template"]
cityListTemplate = Handlebars.templates["shop/freight/frontend_templates/city_list"]

addressUnits = require("utils/module").plugins.addressUnit

class Freight
  constructor: ($)->
    @queryFreightForm = $("#freight-search-form")
    @freightCreate = $(".js-create-freight")
    @freightEdit = $(".js-edit-freight")
    @ruleAdd = $(".js-add-rule")
    @ruleEdit = $(".js-edit-rule")
    @typeIndex = 0
    @cityUnits = addressUnits.cityUnits
    @provinceUnits = addressUnits.provinceUnits
    @bindEvent()

  bindEvent: ->
    pageSize = if _.isNumber($.query.get("pageSize")) then $.query.get("pageSize") else 20
    new Pagination(".freight-pagination").total($(".freight-pagination").data("total")).show(pageSize, {num_display_entries: 5, jump_switch: true, page_size_switch: true, maxPage: -1})
    @freightCreate.on "click", @newFreight
    @freightEdit.on "click", @editFreight
    @ruleAdd.on "click", @newRule
    @ruleEdit.on "click", @editRule
    $(document).on "confirm:delete-delivery", @deleteFreight
    $(document).on "confirm:set-rule-default", @setDefaultFreight
    $(document).on "confirm:delete-rule", @deleteRule
    $(document).on "change", ".js-select-city-item", @checkCity
    $(document).on "change", ".js-select-province-item", @checkProvince
    $(document).on "click", ".js-close-city", @closeCity
    $(document).on "change", ".js-check-all", @checkAllProvince
    @getProvince()

  closeCity: (evt)=>
    menu = $(evt.currentTarget).closest(".freight-select-city")
    @closeSelectCity("self", menu)

  closeSelectCity: (target, menu)->
    if target is "self"
      $(menu).closest("li").removeClass("selected")
    else
      $(menu).closest(".freight-select-province").find(".freight-province-li").removeClass("selected")
    $(menu).remove()

  deleteFreight: (evt, data)->
    $.ajax
      type: "DELETE"
      url: "/api/seller/delivery-fee-template/#{data}"
      success: ->
        window.location.reload()

  setDefaultFreight: (evt, data)->
    $.ajax
      type: "POST"
      url: "/api/seller/delivery-fee-template/#{data}/set-default"
      success: ->
        window.location.reload()

  deleteRule: (evt, data)->
    $.ajax
      type: "DELETE"
      url: "/api/seller/special-delivery-fee/#{data}"
      success: ->
        window.location.reload()

  ###
   * 新建运费模板
   * @return {[type]} [description]
  ###
  newFreight: =>
    freight = new Modal newFreightTemplate()
    freight.show()
    @bindLaterEvent()

  organizeDisbaleArea: (evt, type)->
    if type is "new"
      rules = $(evt.currentTarget).closest("table").find(".js-rule-tr")
    else
      rules = $(evt.currentTarget).closest(".js-rule-tr").siblings(".js-rule-tr")
    areas = _.uniq _.flatten(_.map rules, (i) -> JSON.parse $(i).data("rule").addressJson)

  ###
   * 新建运费模板规则
   * @return {[type]} [description]
  ###
  newRule: (evt)=>
    deliveryFeeTemplateId = $(evt.currentTarget).data("id")
    name = $(evt.currentTarget).closest("table").data("freight").name
    areas = @organizeDisbaleArea(evt, "new")
    province = _.filter @freightCreate.data("province"), (i) -> not _.contains areas, i.id
    new Modal(newFreightTemplate({data: {province, deliveryFeeTemplateId, name}, areas: JSON.stringify areas})).show()
    @bindLaterEvent("rule")

  ###
   * 更新运费规则
  ###
  editRule: (evt)=>
    data = $(evt.currentTarget).closest("tr").data("rule")
    checkedAddress = JSON.parse $(evt.currentTarget).closest("tr").data("rule").addressTreeJson
    areas = @organizeDisbaleArea(evt)
    province = _.filter @freightCreate.data("province"), (i) -> not _.contains areas, i.id
    data.name = $(evt.currentTarget).closest("table").data("freight").name
    data.province = _.map province, (i) ->
      x = $.extend true, {}, i
      _.each checkedAddress, (j) ->
        if parseInt(x.id) is parseInt(j.parent.id) and j.children
          x.check = "indeterminate"
          x.address = (_.map j.children, (k) -> k.id).join(",")
          x.count = j.children.length
          x.children = JSON.stringify j.children
        else if parseInt(x.id) is parseInt(j.parent.id)
          x.check = "checked"
      x
    rule = new Modal newFreightTemplate {data, areas: JSON.stringify areas}
    rule.show()
    $("input:checkbox[indeterminate=true]").prop "indeterminate", true
    @renderAllCheck()
    @bindLaterEvent("rule")

  renderAllCheck: =>
    freightList = $(".freight-select-province")
    if freightList.find("ul input:checked").length && freightList.find("ul input:checked").length == freightList.find("ul input:checkbox").length
      $(".js-check-all").prop {"checked": true, "indeterminate": false}
    else if freightList.find("ul input:checked").length
      $(".js-check-all").prop "indeterminate", true
    else
      $(".js-check-all").prop {"checked": false, "indeterminate": false}

  ###
   * 获取省列表
   * @return {[type]} [description]
  ###
  getProvince: ->
    $.ajax
      url: "/api/address/0/children"
      type: "GET"
      success: (data)=>
        data = _.map data, (i)=>
          _.each @provinceUnits, (j) ->
            reg = new RegExp(j)
            if reg.test i.name
              map = new RegExp("(.*)#{j}")
              i.name = i.name.match(map)[1]
          i
        @freightCreate.attr("data-province", JSON.stringify(data))

  ###
   * 获取某个省下的所有城市
  ###
  getCity: (evt)=>
    li = $(evt.currentTarget).closest("li")
    id = li.data("id")
    $.ajax
      type: "GET"
      url: "/api/address/#{id}/children"
      success: (data)=>
        areas = $(evt.currentTarget).closest(".freight-form").data("area")
        @closeSelectCity("other", ".freight-select-city")
        li.addClass("selected")
        address = li.data("address").toString().split(",") if li.data("address")
        cities = _.filter data, (i) -> not _.contains areas, i.id
        data = _.map cities, (i)=>
          _.each @cityUnits, (j) ->
            reg = new RegExp(j)
            if i.name.length > 2 and reg.test i.name
              map = new RegExp("(.*)#{j}")
              i.name = i.name.match(map)[1]
            i.checked = true if (_.contains address, i.id.toString()) or li.find(".js-select-province-item").is(":checked")
          i
        count = (_.filter(data, (i)-> if i.checked then i)).length
        li.find(".js-city-count").text("(#{count})") if count
        li.append cityListTemplate {data}

  ###
   * 勾选省份
  ###
  checkProvince: (evt)=>
    provinceItem = $(evt.currentTarget).closest("li")
    cityCountShow = provinceItem.find(".js-city-count")
    length = provinceItem.find(".freight-select-city input:checkbox").length
    if $(evt.currentTarget).prop "checked"
      provinceItem.find("input:checkbox").prop "checked", true
      if length then cityCountShow.text("(#{length})") else cityCountShow.text("")
      @setArea(provinceItem)
    else
      provinceItem.find("input:checkbox").prop "checked", false
      cityCountShow.text("")
      @setArea(provinceItem, "")
    @renderAllCheck()

  ###
   * 勾选城市
  ###
  checkCity: (evt)=>
    cityArea = $(evt.currentTarget).closest(".freight-select-city")
    checkedCities = cityArea.find(".js-select-city-item:checked")
    cityCount = checkedCities.length
    provinceItem = $(evt.currentTarget).closest(".freight-province-li")
    cityLenth = cityArea.find(".js-select-city-item").length
    selectProvinceItem = provinceItem.find(".js-select-province-item")
    cityCountShow = provinceItem.find(".js-city-count")

    if cityLenth is cityCount
      selectProvinceItem.prop("indeterminate", false).prop("checked", true)
      cityCountShow.text("(#{cityCount})")
      @setArea(provinceItem)
    else if cityCount > 0
      selectProvinceItem.prop "indeterminate", true
      cityCountShow.text("(#{cityCount})")
      @setArea(provinceItem, (_.map checkedCities, (i) -> $(i).val()).join(","))
      provinceItem.data("show", (_.map checkedCities, (i) -> {id: $(i).val(), name: $(i).data("name")}))
    else
      selectProvinceItem.prop("indeterminate", false).prop("checked", false)
      cityCountShow.text("")
      @setArea(provinceItem, "")

  setArea: (li, data)->
    provinceId = li.data("id").toString()
    if data is ""
      li.data("address", "")
    else if data
      li.data("address", data)
    else
      li.data("address", provinceId)

  checkAllProvince: ->
    if $(@).prop "checked"
      $(".js-select-province-item").prop("checked", true).prop("indeterminate", false).trigger("change")
    else
      $(".js-select-province-item").prop("checked", false).prop("indeterminate", false).trigger("change")

  ###
   * 编辑运费模板
   * @return {[type]} [description]
  ###
  editFreight: (evt)=>
    data = $(evt.currentTarget).closest("table").data("freight")
    freight = new Modal(newFreightTemplate({data: data}))
    freight.show()
    @bindLaterEvent()

  ###
   * 为编辑对话框绑定事件
   * @return {[type]}         [description]
  ###
  bindLaterEvent: (type)=>
    $(".freight-form").data("type", type)
    $("input[name=chargeMethod]").on "change", @setType
    $("input[name=isFree]").on "change", @setIsFree
    @bindFormValidator()
    if type is "rule"
      $(".js-city-list").on "click", @getCity

  # 绑定表单验证和事件
  bindFormValidator: =>
    type = $(".freight-form").data("type")
    $(".freight-form").off().validator
      identifier: "input:visible:not(:checkbox)"
    if type is "rule"
      $(".freight-form").on "submit", @submitRule
    else
      $(".freight-form").on "submit", @submitFreight


  setIsFree: (evt)=>
    isFree = $(evt.currentTarget).val()
    if isFree is "true"
      $(".toggleFree").addClass("hide")
    else
      $(".toggleFree").removeClass("hide")
    @bindFormValidator()

  ###
   * 设置计价方式
  ###
  setType: (evt)=>
    @type = $(evt.currentTarget).val()
    $(".freight-form .freight-rules[data-chargemethod=#{@type}]").removeClass("hide1").siblings(".freight-rules").addClass("hide1")
    @bindFormValidator()

  ###
   * 获取运费表单字段
   * @param  {JQUERY} form 运费表单
   * @return {OBJECT}      运费对象
  ###
  organizeDefault: (form)->
    fixedRule = ["fee"]
    increaseRule = ["initFee", "incrFee"]
    increaseAmountRule = ["initAmount", "incrAmount"]
    data = form.serializeObject()
    switch data.chargeMethod
      when "2"
        data = _.omit data, (_.union increaseRule, increaseAmountRule)
        _.each fixedRule, (i) -> data[i] *= 100
      when "1"
        data = _.omit data, (_.union fixedRule)
        _.each increaseRule, (i) -> data[i] *= 100
        _.each increaseAmountRule, (i) -> data[i] *= 10
    # 如果是卖家承担运费，过滤掉计价方式和计费规则参数
    if data.isFree is "true"
      delete data.fee
      delete data.initFee
      delete data.incrFee
      delete data.initAmount
      delete data.incrAmount
    data

  ###
   * 创建或者编辑运费模板
   * @param  {[EVENT]} event [event对象]
   * @return {[type]}       [description]
  ###
  submitFreight: (evt)=>
    evt.preventDefault()
    deliverFeeTemplate = @organizeDefault($(evt.currentTarget))
    id = $(evt.currentTarget).data("id")
    $.ajax
      url: "/api/seller/delivery-fee-template"
      type: if id then "PUT" else "POST"
      contentType: "application/json"
      data: JSON.stringify deliverFeeTemplate
      success: (data)->
        window.location.reload()

  ###
   * 获取区域信息
  ###
  organizeAreas: (form)=>
    provinceArea = form.find(".freight-select-province")
    provincesTree = _.map $(".js-select-province-item:checked", provinceArea), (i) ->
      {parent: {id: $(i).val(), name: $(i).data("name")}}
    cityTree = _.map $(".js-select-province-item:indeterminate", provinceArea), (i) ->
      children = $(i).closest("li").data("show")
      {parent: {id: parseInt($(i).val()), name: $(i).data("name")}, children}
    _.union provincesTree, cityTree

  ###
   * 创建或更新运费规则
  ###
  submitRule: (evt)=>
    evt.preventDefault()
    specialDeliver = @organizeDefault($(evt.currentTarget))
    specialDeliver.deliveryFeeTemplateId = $(evt.currentTarget).closest(".modal").data("id").data.deliveryFeeTemplateId
    address = @organizeAreas($(evt.currentTarget))
    if !address.length
      new Modal
        icon: "info"
        title: "提示"
        content: "您还没有选择地区或者已经没有地区可以设置了"
      .show()
      return false
    specialDeliver.addressTreeJson = JSON.stringify address
    type = if specialDeliver.id then "PUT" else "POST"
    $.ajax
      url: "/api/seller/special-delivery-fee"
      type: type
      contentType: "application/json"
      data: JSON.stringify specialDeliver
      success: ->
        window.location.reload()

module.exports = Freight

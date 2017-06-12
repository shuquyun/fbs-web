itemModalTemplate = Handlebars.templates["list/fees/frontend_templates/item_modal"]
tmplItemTemplate = Handlebars.templates["list/fees/all_templates/tmpl_item"]
itemCheckboxTemplate= Handlebars.templates["list/fees/frontend_templates/item_checkbox"]

SelectTree = require 'common/tree_comp/view'
Modal = require "pokeball/components/modal"
FeeSum = require 'list/fee_sum/view'

class Fees
  constructor: ->
    @bindEvent()

  bindEvent: =>
    @billSheetId = $.query.get("billSheetId")
    @type = $.query.get("type")
    @renderSelectTree()
    $(document).on("click",".js-update-fee-item",@updateFeeItemEvent)
    $(document).on("click",".js-submit-tmpl-item-button",@submitTmplItemEvent)
    $(document).on("change",".tmpl-item-select",@changeTmplItemSelectEvent)
    $(document).on("confirm:js_fee_item_delete",@deleteFeeItemEvent)
    $(document).on('change', '.form input[type=radio]', @changeRadio)

  changeRadio:(evt)=>
    $('.js-new-config').toggleClass('hide')


  renderSelectTree: =>
    @getFeeTemplateCategoryData()
    $(".js-fee-item-table").addClass("hide")#显示列表数据
    new SelectTree
      container: '.list-tree-nav'
      operation: true
      search: false
      data: @feeTemplateCategoryData
      createNode: @addCategorySubmit
      updateNode: @updateCategorySubmit
      afterSelect: @selectCategoryEvent
      beforeDel: @deleteCategoryEvent

  updateCategorySubmit:(newData,data,tree)=>
    data.name = newData.name
    @sendAjax(data)
    return data

  addCategorySubmit:(pid,data,tree)=>
    console.log("addCategorySubmit:", pid, data, tree)
    data.billSheetId = @billSheetId
    data.pid = pid
    data.type = @type
    data.status = 1
    if !data.level
      data.level = 1
    @sendAjax(data)
    id = @newCategoryId
    console.log("id:",id)
    if id
      data.id = id
      return data

  selectCategoryEvent:(evt)=>
    node = $(evt.currentTarget).data("node")
    console.log("selectCategoryEvent",node)
    if node.children and node.children.length > 0
      $(".js-fee-item-table").addClass("hide")
      return false
    @renderTmplFeeItem(node)
    @renderFeeItemSum(node.id)


  renderTmplFeeItem:(category)=>
    @categoryId = category.id
    @getTmplFeeItemData()
    $(".js-fee-item-table").removeClass("hide")#显示列表数据
    $(".js-fee-item-tbody").html("")
    _.each @tmplFeeItemData,(opt,m)=>
      $(".js-fee-item-tbody").append(tmplItemTemplate({data:opt}))

  renderFeeItemSum:(id)=>
    new FeeSum
      "cateId": id

  deleteCategoryEvent:(evt)=>
    id = $(evt.currentTarget).data("id")
    if !id
      return false
    $.ajax
      url: "/api/sheet-cates/#{id}"
      type: "DELETE"
      success:(data)=>
        return true

  updateFeeItemEvent:(evt)=>
    console.log("updateFeeItemEvent")
    data = $(evt.currentTarget).closest("tr").data("fee")
    if !data
      data = {billSheetId:@billSheetId,cateId:@categoryId}
    @getBillFeesEnumData()
    valuationBasic = data.valuationBasic
    if valuationBasic
      valuationBasic = JSON.parse(valuationBasic)
    @getFeeListData()

    new Modal(itemModalTemplate({baseFeeList:@feeListData,data})).show()
    $("#valuation-basic-checkbox").html("")
    _.each @billFeesEnumData,(opt, m)=>
      if valuationBasic and valuationBasic[opt.key] == opt.value
        opt.select = true
      $("#valuation-basic-checkbox").append(itemCheckboxTemplate({data:opt}))
    $("#tmpl-item-form select").selectric()

  changeTmplItemSelectEvent:(evt)=>
    baseId = $(evt.currentTarget).val()
    tmplFeeItem = $(evt.currentTarget).find("option[value=#{baseId}]").data("baseFee")
    console.log(tmplFeeItem)
    valuationBasic = {}
    if tmplFeeItem
      $("#name").val(tmplFeeItem.name)
      $("#feeRate").val(tmplFeeItem.feeRate)
      valuationBasic = tmplFeeItem.valuationBasic
      if valuationBasic
        valuationBasic = JSON.parse(valuationBasic)
    else
      $("#name").val("")
      $("#feeRate").val("")
    $("#fee").val("")
    $("#valuationBase").val("")
    $("#remark").val("")

    @getBillFeesEnumData()

    $("#valuation-basic-checkbox").html("")
    _.each @billFeesEnumData,(opt, m)=>
      if valuationBasic and valuationBasic[opt.key] == opt.value
        opt.select = true
      console.log(opt,m)
      $("#valuation-basic-checkbox").append(itemCheckboxTemplate({data:opt}))

  submitTmplItemEvent:(evt)=>
    fromData = $("#tmpl-item-form").serializeObject()
    fromData.type = @type
    fromData.billSheetId = @billSheetId
    valuationBasicMap = {}
    if !fromData.valuationBasic
      new Modal
        "icon": "error"
        "title": "错误提醒"
        "content": "请选择计价基础"
      .show()
      return false

    _.each fromData.valuationBasic,(opt)=>
      key = opt.split(':')[0]
      value = opt.split(':')[1]
      valuationBasicMap[key] = value

    fromData.valuationBasic = JSON.stringify(valuationBasicMap)
    id = fromData.id
    type = "POST"
    if id
      type = "PUT"
    $.ajax
      url: "/api/bill-fees"
      type: type
      contentType: "application/json"
      data: JSON.stringify(fromData)
      success:(data)=>
        if !fromData.id
          fromData.id = data
        console.log(fromData)
        tmplItemHtml = tmplItemTemplate({data:fromData})
        if id
          $(".js-tmpl-fee-item-tr[data-id='#{id}']").replaceWith(tmplItemHtml)
        else
          $("tbody").append(tmplItemHtml)
      $(".js-close-modal-div").trigger("click")

  deleteFeeItemEvent:(evt,id)=>
    console.log("deleteFeeItemEvent")
    if !id
      return false
    $.ajax
      url: "/api/bill-fees/#{id}"
      type: "DELETE"
      success:(data)=>
        $(".js-tmpl-fee-item-tr[data-id='#{id}']").remove()




  getTmplFeeItemData:()=>
    @tmplFeeItemData = {}
    $.ajax
      url: "/api/bill-fees/#{@billSheetId}?cateId=#{@categoryId}"
      type: "GET"
      async: false
      success:(data)=>
        @tmplFeeItemData = data



  sendAjax:(data)=>
    type = "POST"
    if data.id
      type = "PUT"
    @newCategoryId = data.id
    $.ajax
      url: "/api/sheet-cates"
      type: type
      async: false
      contentType: "application/json"
      data: JSON.stringify(data)
      success:(data)=>
        if type == "POST"
          @newCategoryId = data


  getFeeTemplateCategoryData:()=>
    @feeTemplateCategoryData = {}
    $.ajax
      url: "/api/sheet-cates/#{@billSheetId}/tree"
      type: "GET"
      async: false
      success:(data)=>
        @feeTemplateCategoryData = data
        console.log(data)


  #获取基础项目列表
  getFeeListData:()=>
    @feeListData = []
    $.ajax
      url: "/api/bill-fees/base/#{@type}"
      type: "GET"
      async: false
      success:(data)=>
        console.log(data)
        @feeListData = data

  #获取计价基础枚举
  getBillFeesEnumData:()=>
    @billFeesEnumData = []
    $.ajax
      url: "/api/bill-fees/enum/#{@type}"
      type: "GET"
      async: false
      success:(data)=>
        console.log(data)
        @billFeesEnumData = data





module.exports = Fees

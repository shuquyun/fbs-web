itemModalTemplate = Handlebars.templates["list/supplementary/frontend_templates/item_modal"]
tableTemplate= Handlebars.templates["list/supplementary/frontend_templates/table"]
trTemplate = Handlebars.templates["list/supplementary/frontend_templates/_tr"]


SelectTree = require 'common/tree_comp/view'
Modal = require "pokeball/components/modal"
FeeSum = require 'list/fee_sum/view'

class Supplementary
  constructor: ->
    @bindEvent()

  bindEvent: =>
    @billSheetId = $.query.get("billSheetId")
    @type = $.query.get("type")
    @billId = $.query.get("billId")
    @renderSelectTree()
    $(document).on("click",".js-update-fee-item",@updateFeeItemEvent)
    $(document).on("click",".js-submit-tmpl-item-button",@submitTmplItemEvent)
    $(document).on("confirm:js_fee_item_delete",@deleteFeeItemEvent)
    $(document).on("click",".js-combine-column",@changeCombineColumnEvent)


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

    if (!node.id) or (node.children and node.children.length > 0)
      $(".js-fee-item-table").addClass("hide")
      return false

    @categoryId = node.id
    @getTmplFeeItemData()
    @renderTmplFeeItem(false)
    @renderFeeItemSum(node.id)


  renderTmplFeeItem:(showMore)=>
    $(".js-fee-item-table").removeClass("hide")#显示列表数据
    $("#js-table").html(tableTemplate({data:@tmplFeeItemData,showMore}))

  renderFeeItemSum:(id)=>
    new FeeSum
      "cateId": id

  changeCombineColumnEvent:(evt)=>
    combine = $(evt.currentTarget).data("combine")
    @renderTmplFeeItem(combine)


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
      data = {billSheetId:@billSheetId,sheetCateId:@categoryId}
      data.billId = @billId
      data.unitId = 1
      data.sort = 1
      data.status = 1

    modal = new Modal(itemModalTemplate({data}))
    modal.show()
    modal.resetPosition()
    $("#tmpl-item-form select").selectric()






  submitTmplItemEvent:(evt)=>
    fromData = $("#tmpl-item-form").serializeObject()

    fromData.standardBillId = fromData.number
    fromData.itemPriceJson = JSON.stringify(fromData.itemPriceJson)

    id = fromData.id
    type = "POST"
    if id
      type = "PUT"
    $.ajax
      url: "/api/bill-sheet-rows"
      type: type
      contentType: "application/json"
      data: JSON.stringify(fromData)
      success:(data)=>
        console.log("data:",data)
      $(".js-close-modal-div").trigger("click")
      $(".js-tree-item[data-id='#{fromData.sheetCateId}']").closest(".js-tree-node").trigger("click")

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
    @tmplFeeItemData = []
    $.ajax
      url: "/api/bill-sheet-rows/#{@categoryId}"
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





module.exports = Supplementary

itemModalTemplate = Handlebars.templates["list/provisional_major/frontend_templates/modal"]
trTemplate = Handlebars.templates["list/provisional_major/all_templates/tr"]

Modal = require "pokeball/components/modal"
FeeSum = require 'list/fee_sum/view'

class ProvisionalMajor
  constructor: ->
    @bindEvent()

  bindEvent: =>
    @billSheetId = $.query.get("billSheetId")
    @type = $.query.get("type")
    $(document).on("click",".js-update-fee-item",@updateFeeItemEvent)
    $(document).on("click",".js-submit-tmpl-item-button",@submitTmplItemEvent)
    $(document).on("confirm:js_fee_item_delete",@deleteFeeItemEvent)
    @renderFeeItemSum()


  renderFeeItemSum:(id)=>
    new FeeSum
      "billSheetId": @billSheetId,
      "billSheetName": "专业暂估价"

  updateFeeItemEvent:(evt)=>
    data = $(evt.currentTarget).closest("tr").data("fee")
    if !data
      data = {billSheetId:@billSheetId,cateId:@categoryId}
    new Modal(itemModalTemplate({data})).show()


  submitTmplItemEvent:(evt)=>
    fromData = $("#tmpl-item-form").serializeObject()
    fromData.type = @type
    fromData.billSheetId = @billSheetId
    type = "POST"
    if fromData.id
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
        tmplItemHtml = trTemplate({data:fromData})
        if type == "PUT"
          $(".js-tmpl-fee-item-tr[data-id='#{fromData.id}']").replaceWith(tmplItemHtml)
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



module.exports = ProvisionalMajor

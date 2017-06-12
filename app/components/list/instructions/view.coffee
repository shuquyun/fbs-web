
Modal = require "pokeball/components/modal"

class Instructions
  constructor: ->
    @bindEvent()

  bindEvent: =>
    @billId = $.query.get("billId")
    @type = $.query.get("type")
    $(document).on("click",".js-add-btn",@submitEvent)

  submitEvent:(evt)=>
    console.log("submitEvent")
    # formData = $("#form").serializeObject()
    formData = {}
    formData.id = @billId
    formData.generalPage = $("#generalPage").val()
    type = "PUT"
    $.ajax
      url: "/api/bill/general-page"
      type: type
      contentType: "application/json"
      data: JSON.stringify(formData)
      success:(data)=>
        window.location.reload();






module.exports = Instructions

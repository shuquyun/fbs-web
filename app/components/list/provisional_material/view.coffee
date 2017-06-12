FeeSum = require 'list/fee_sum/view'

class ProvisionalMaterial
  constructor: ->
    @bindEvent()

  bindEvent: =>
    @billSheetId = $.query.get("billSheetId")
    @type = $.query.get("type")
    @renderFeeItemSum()


  renderFeeItemSum:(id)=>
    new FeeSum
      "billSheetId": @billSheetId,
      "billSheetName": "材料暂估价"




module.exports = ProvisionalMaterial

sumTemplate = Handlebars.templates["list/fee_sum/frontend_templates/sum"]

class FeeSum

  constructor: (options)->
    @$wrap = $ '.component-fee-tree'
    if options? and options.billSheetId
      @renderSheetFeeSum(options)
    else
      @renderCateFee options.cateId if options? and options.cateId?

  renderCateFee: (id) =>
    $.ajax
      url: "/api/sheet-cates/#{id}/top"
      type: "GET"
      success: (result) =>
        @$wrap.empty().append(sumTemplate({ nav: result }))

  renderSheetFeeSum:(options)=>
    nav = []
    $.ajax
      url: "/api/bill-sheets/#{options.billSheetId}/price"
      type: "GET"
      success: (result) =>
        nav.push({name:options.billSheetName,price:result})
        console.log("nav",nav)
        @$wrap.empty().append(sumTemplate({nav}))


module.exports = FeeSum

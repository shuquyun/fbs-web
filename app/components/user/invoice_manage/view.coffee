###
  用户发票信息管理组件
  author by terminus.io (zl)
###
Tip = require "common/tip_and_alert/view"
Modal = require("pokeball").Modal
invoiceEditTemplate = Handlebars.templates["user/invoice_manage/frontend_templates/invoice_edit"]
itemImageTemplate = Handlebars.templates["items/seller/item_publish/common/frontend_templates/image"]

class InvoiceManage

  constructor: ($)->
    @isDefaultCheckbox = ".set-defalut"
    @editInvoiceButton = $(".js-edit-invoice-label")
    @deleteInvoiceButton = $(".js-delete-invoice")
    @setDefaultButton = ".js-set-default"
    @InvoiceEditForm = "#invoice-form"
    @bindEvent()

  bindEvent: ->
    $(".js-add-invoice").on "click", @newInvoice
    $(document).on "confirm:delete", @deleteInvoice
    @editInvoiceButton.on "click", @editInvoice
    $(".invoice-manage").on "click", @setDefaultButton, @setDefault

  #新建发票
  newInvoice: =>
    new Modal(invoiceEditTemplate({data: {detailJson: {type: 1}}})).show()
    @formInit()

  #删除发票信息
  deleteInvoice: (event, id) ->
    invoiceData = $("#invoice-"+id).data("invoice")
    if invoiceData.isDefault
      new Modal
        "icon": "error"
        "title": "删除失败"
        "content": "默认发票无法删除"
      .show()
      return
    $.ajax
      url: "/api/buyer/invoice/#{id}"
      type: "DELETE"
      success: (data) ->
        window.location.reload()

  #编辑发票信息
  editInvoice: (evt)=>
    invoiceData = $(evt.currentTarget).closest("tr").data("invoice")
    new Modal(invoiceEditTemplate({data: invoiceData})).show()
    @formInit()

  formInit: (addressData) =>
    $(".js-choose-invoicetype").on "click", @changeInvoiceType
    $(".js-radio-invoice-title-type").on "click", @changeInvoiceTitleType
    @articleImagesUpload()
    setRequired()
    $(".invoice-form").validator({
      identifier: "input[type=text]"
      isErrorOnParent: true
    })
    $(".invoice-form").on "submit", @submitInvoice

  changeInvoiceType: ->
    if !$(@).hasClass("active")
      $(@).addClass("active").siblings(".js-choose-invoicetype").removeClass("active")
      thisType = $(@).data("type")
      if thisType is 1
        $(".invoice-common").removeClass("hide")
        $(".invoice-vat").addClass("hide")
        $(".invoice-vat").find("input").each( ->
          $(this).val("")
        )
      else
        $(".invoice-common").addClass("hide")
        $(".invoice-vat").removeClass("hide")
        $(".invoice-common").find("input").each( ->
          $(this).val("")
        )
    setRequired()

  changeInvoiceTitleType: ->
    setRequired()

  setRequired = ()->
    type = $(".js-choose-invoicetype.active").data("type")
    titleType = $("input[name=invoice-title-type]:checked").val()
    if type is 1 & titleType is "company"
      $("[name=invoice-title]").attr("required", "required").parent().removeClass("error unvalid empty")
    else
      $("[name=invoice-title]").removeAttr("required").parent().removeClass("error unvalid empty")
    if type is 2
      $("[name=companyName], [name=taxRegisterNo], [name=registerAddress], [name=registerPhone], [name=registerBank], [name=bankAccount]").attr("required", "required").parent().removeClass("error unvalid empty")
    else
      $("[name=companyName], [name=taxRegisterNo], [name=registerAddress], [name=registerPhone], [name=registerBank], [name=bankAccount]").removeAttr("required").parent().removeClass("error unvalid empty")

  articleImagesUpload: ()->
    $("input[name=file]").fileupload
      url: "/api/user/files/upload"
      dataType: "html"
      done: (evt, data) =>
        imageUrl = _.values(JSON.parse(data.result))[0]
        $self = $(evt.target).closest(".js-main-image")
        if $self.hasClass("js-main-image")
          if $("img", $self).length
            $("img", $self).remove()
          $self.prepend(itemImageTemplate({imageUrl, type: "main"}))
          $self.removeClass("empty error")
          $self.find(".enter-input").val(imageUrl)
        else if $self.hasClass("js-item-image-container")
          $self.find("img").attr("src", imageUrl).data("src", imageUrl)
        else
          newImage = $(itemImageTemplate({imageUrl}))
          $self.before(newImage)


  #设定默认
  setDefault: ->
    invoiceId = $(@).closest("tr").data("invoice").id
    $.ajax
      url: "/api/buyer/invoice/#{invoiceId}/setDefault"
      type: "PUT"
      data: {}
      success: (data)->
        window.location.reload()

  #提交发票信息
  submitInvoice: (evt)->
    evt.preventDefault()
    $(".invoice-form .btn-success").attr("disabled", true)
    userInvoiceInfo = {}
    detailJson = {}
    id = $("#invoice-form").data("id")
    invoiceType = $(".js-choose-invoicetype.active").data("type")
    invoiceTitleType = $("input[name=invoice-title-type]:checked").val()
    invoiceType1TitleCompany = $("input[name=invoice-title]").val()
    invoiceType2TitleCompany = $("input[name=companyName]").val()
    taxRegisterNo = $("input[name=taxRegisterNo]").val()
    registerAddress = $("input[name=registerAddress]").val()
    registerPhone = $("input[name=registerPhone]").val()
    registerBank = $("input[name=registerBank]").val()
    bankAccount = $("input[name=bankAccount]").val()
    taxCertificate = $("input[name=taxCertificate]").val()
    taxpayerCertificate = $("input[name=taxpayerCertificate]").val()

    userInvoiceInfo.id = id
    if invoiceType is 1
      detailJson.type = 1
      if invoiceTitleType is "company"
        detailJson.titleType = 2
        userInvoiceInfo.title = invoiceType1TitleCompany
      else
        detailJson.titleType = 1
        userInvoiceInfo.title = "个人"
    else
      detailJson.type = 2
      userInvoiceInfo.title = invoiceType2TitleCompany
      detailJson.companyName = invoiceType2TitleCompany
      detailJson.taxRegisterNo = taxRegisterNo
      detailJson.registerAddress = registerAddress
      detailJson.registerPhone = registerPhone
      detailJson.registerBank = registerBank
      detailJson.bankAccount = bankAccount
    userInvoiceInfo.detail = detailJson
    userInvoiceInfo.isDefault = $("#invoice-isdetault").prop "checked"

    if invoiceType is 2 && (!taxCertificate or !taxpayerCertificate)
      new Modal
        "icon": "error"
        "title": "保存失败"
        "content": "请将相关证件补充完整后再次尝试"
      .show()
      $(".invoice-form .btn-success").attr("disabled", false)
      return

    $.ajax
      url: "/api/buyer/invoice"
      type: "POST"
      data: JSON.stringify userInvoiceInfo
      contentType: "application/json"
      success: (data) ->
        window.location.reload()

module.exports = InvoiceManage

###
  用户收货地址管理组件
  author by terminus.io (zl)
###
addressSelect = require "common/address_select/view"
Tip = require "common/tip_and_alert/view"
Modal = require("pokeball").Modal
addressSelectTemplate = Handlebars.templates["common/address_select/frontend_templates/select_address"]
properties = require "user/resources/properties"

class AddressManage extends addressSelect

  that = this

  constructor: ($)->
    @isDefaultCheckbox = ".set-defalut"
    @editAddressButton = $(".js-edit-address-label")
    @deleteAddressButton = $(".js-delete-address")
    @setDefaultButton = ".js-set-default"
    @addressEditForm = "#address-form"
    @bindEvent()

  bindEvent: ->
    that = this
    @levels = properties.resource.address.tradeInfoLevel
    $(".js-add-address").on "click", @newAddress
    $(document).on "confirm:delete", @deleteAddress
    @editAddressButton.on "click", @editAddress
    $(".address-manage").on "click", @setDefaultButton, @setDefault

  #新建地址
  newAddress: =>
    new Modal(addressSelectTemplate({properties})).show()
    @selectAddress("", {level: 1})
    @formInit()

  #删除收货地址
  deleteAddress: (event, id) ->
    $.ajax
      url: "/api/buyer/receiver-infos/#{id}"
      type: "DELETE"
      success: (data) ->
        window.location.reload()

  #编辑收货地址
  editAddress: (evt)=>
    addressData = $(evt.currentTarget).closest("tr").data("address")
    new Modal(addressSelectTemplate({data: addressData, properties})).show()
    @formInit(addressData)

  formInit: (addressData) =>
    @initAddress()
    $(".address-form").validator
      identifier: "input, textarea"
      isErrorOnParent: true
    $(document).on "submit", @addressEditForm, @submitAddressCustom

  submitAddressCustom: (evt)=>
    $(".address-form .btn-success").attr("disabled", true)
    obj = $(evt.currentTarget).find("#street-address")
    val = obj.val().replace(/\r|\n/g," ")
    obj.val(val)
    @submitAddress(evt) # 方法在父类

  #设定默认
  setDefault: ->
    addressId = $(@).closest("tr").data("address").id
    loginerId = $(@).data("user")
    $.ajax
      url: "/api/buyer/receiver-infos/#{addressId}/set-default"
      type: "PUT"
      data: {loginerId: loginerId}
      success: (data)->
        window.location.reload()

module.exports = AddressManage

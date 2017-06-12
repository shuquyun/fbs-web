###
  卖家退货地址管理组件
  author by terminus.io
###
addressSelect = require "common/address_select/view"
Tip = require "common/tip_and_alert/view"
Modal = require("pokeball").Modal
addressSelectTemplate = Handlebars.templates["trade/seller/address_manage/frontend_templates/select_address"]
properties = require "shop/resources/properties"

class AddressManage extends addressSelect

  that = this

  constructor: ($)->
    super
    @isDefaultCheckbox = ".set-defalut"
    @editAddressButton = $(".js-edit-address-label")
    @deleteAddressButton = $(".js-delete-address")
    @setDefaultButton = ".js-set-default"
    @addressEditForm = "#address-form"
    @bindEvent()

  bindEvent: ->
    that = this
    @levels = properties.resource.address.sellerReturnAddressLevel
    $(".js-add-address").on "click", @newAddress
    $(document).on "confirm:delete", @deleteAddress
    @editAddressButton.on "click", @editAddress
    $(".address-manage").on "click", @setDefaultButton, @setDefault
    $(document).on "submit", @addressEditForm, @submitAddress  #方法在父类
    $(document).on "change", @addressSelect, @selectAddress

  #新建地址
  newAddress: =>
    new Modal(addressSelectTemplate()).show()
    @selectAddress("", {level: 1})
    $("#address-form").validator
      isErrorOnParent: true

  #删除收货地址
  deleteAddress: (event, id)->
    $.ajax
      url: "/api/seller/trade-info/#{id}"
      type: "DELETE"
      success: (data) ->
        window.location.reload()

  #编辑收货地址
  editAddress: ->
    addressData = $(@).closest("tr").data("address")
    new Modal(addressSelectTemplate({data: addressData})).show()
    that.initAddress(addressData)
    $(".address-form").validator
      isErrorOnParent: true

  #提交地址
  submitAddress: (evt)->
    evt.preventDefault()
    sellerTradeInfo = $("#address-form").serializeObject()
    sellerTradeInfo.province = $(".address-select[data-level=1] option[value=#{sellerTradeInfo.provinceId}]:selected").text()
    sellerTradeInfo.city = $(".address-select[data-level=2] option[value=#{sellerTradeInfo.cityId}]:selected").text()
    sellerTradeInfo.region = $(".address-select[data-level=3] option[value=#{sellerTradeInfo.regionId}]:selected").text()
    if $("#addressId").length is 0 then type = "POST" else type = "PUT"
    $.ajax
      url: "/api/seller/trade-info"
      type: type
      data: JSON.stringify(sellerTradeInfo)
      contentType: "application/json"
      success: (data)->
        window.location.reload()

module.exports = AddressManage

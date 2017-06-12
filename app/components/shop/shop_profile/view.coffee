###
  修改店铺信息组件
  author by terminus.io (zl)
###
Modal = require("pokeball").Modal
Address = require "common/address_select/view"
properties = require "shop/resources/properties"

viewLicenseTemplate = Handlebars.templates["shop/shop_profile/frontend_templates/view_license"]

class Profile extends Address
  constructor: ->
    @$shopNameInput = $("input[name=name]")
    @$profileForm = $("#user-profile-form")
    @$checkBusinessButton = $(".business-license")
    @jsDefaultInvoice = $("input[name=defaultInvoice]")
    @bindEvent()

  bindEvent: ->
    @levels = properties.resource.address.shopProfileLevel
    @$profileForm.validator
      identifier: "input:not([name=defaultInvoice],[name=defaultInvoiceValue])"
      isErrorOnParent: true
    $(@addressSelect).on "change", @selectAddress
    @$profileForm.on "submit", @profileFormSubmit
    @$checkBusinessButton.on "click", @checkBusinessLicense
    @jsDefaultInvoice.on "change", @changeDefaultInvoice
    @fileUpload()
    _.each $(".address-select[data-level=1]"), (select, i)=>
      @initAddress($(select).closest(".control-group"))


  # 注册上传
  fileUpload: ()=>
    $("input[name=file]").fileupload
      url: "/api/user/files/upload?folderId=0"
      dataType: "html"
      done: (evt, data) =>
        thisButton = $(evt.target).closest(".btn")
        image = _.values(JSON.parse(data.result))[0]
        thisButton.siblings("img").attr("src", image).show()
        thisButton.siblings("input").val(image)

  #获取授权信息
  getAuthorInfo: ->
    $.ajax
      url: "/api/seller/shopAuthorizeInfo"
      type: "GET"
      success: (data)->
        _.each data.data, (author)->
          $(".author-table tbody").append(authorItemTemplate({id: author.id, data: JSON.parse author.jsonAuthorize}))
        _.each $(".author-table .author-area-name"), (item)->
          name = $(item).data("name").split(",")
          if name.length is 1
            $(item).html("""#{name[0]}""")
          else if name.length is 2
            $(item).html("""#{name[0]}&nbsp;<i class="icon-littlearrow"></i>&nbsp;#{name[1]}""")
          else
            $(item).html("""#{name[0]}&nbsp;<i class="icon-littlearrow"></i>&nbsp;#{name[1]}&nbsp;<i class="icon-littlearrow"></i>&nbsp;#{name[2]}""")

  tipModal: (icon, title, message)->
    modal = new Modal
      "icon": icon
      "title": title
      "content": message
    modal

  #校验店铺名
  valideShopName: (evt)=>
    shopName = $(evt.currentTarget).val()
    if shopName isnt ""
      $(evt.currentTarget).siblings(".note").remove()
      $(evt.currentTarget).spin("small")
      $.ajax
        url: "/api/user/verifyShop?name=" + $(evt.currentTarget).val() + "&operation=2"
        type: "GET"
        success: (data)=>
          $(evt.currentTarget).spin(false)
          if data.data
            $(evt.currentTarget).closest(".control-group").append("<span class='note'>#{i18n.ct('shopNameAvailable', 'shop')}</span>")
          else
            $(evt.currentTarget).closest(".control-group").append("<span class='note required'>#{i18n.ct('shopNameAlreadyRegistered', 'shop')}</span>")
        error: (data)=>
          $(evt.currentTarget).spin(false)
          modal = @tipModal("error", "#{i18n.ct('error', 'shop')}", data.responseJSON.message).show()

  changeDefaultInvoice: =>
    data = @jsDefaultInvoice.val()
    $(".select-detail").toggleClass("hide")
    $(".people").prop("checked",true)

  #组织店铺信息
  organizeShop: (form)->
    shop = $(form).serializeObject()
    shop.imageUrl = if shop.imageUrl isnt "" then shop.imageUrl else null
    shop.province = $("select[name=provinceId] option:selected").text()
    shop.city = $("select[name=cityId] option:selected").text()
    shop.region = $("select[name=regionId] option:selected").text()
    shop.companyProvince = $("select[name=companyProvinceId] option:selected").text()
    shop.companyCity = $("select[name=companyCityId] option:selected").text()
    shop.companyRegion = $("select[name=companyRegionId] option:selected").text()
    shop.defaultInvoice = if !shop.defaultInvoice then "0" else shop.defaultInvoiceValue
    shop

  #提交店铺信息
  profileFormSubmit: (evt)=>
    evt.preventDefault()
    data = @organizeShop(evt.currentTarget)
    $("body").spin("medium")
    $.ajax
      url: "/api/shop"
      type: "PUT"
      contentType: "application/json"
      data: JSON.stringify(data)
      success: (data)=>
        modal = @tipModal("success", "#{i18n.ct('modifySuccessfully', 'shop')}", "#{i18n.ct('shopInfoModifySuccessfully', 'shop')}")
        modal.show()
      complete: ->
        $("body").spin(false)

  checkBusinessLicense: ->
    licenseSrc = $(@).data("license")
    licenseModal = new Modal viewLicenseTemplate({imgUrl: licenseSrc})
    licenseModal.show()

module.exports = Profile

Modal = require("pokeball").Modal
addressSelect = require "common/address_select/view"
FileUpload = require("utils/module").plugins.upload
CommonDatepicker = require("utils/module").plugins.commonDatepicker
editBtnTemplate = Handlebars.templates["developer/company/company_detail/frontend_templates/button"]

class CompanyInfo extends addressSelect
  constructor: ($) ->
    @$form = $('.company-info-form')
    @bindEvent()

  bindEvent: ->
    @addressInit()
    $(document).on "click", '.js-control-edit', @changeToEdit
    $(document).on "click", '.js-cancel-edit', @cancelEdit
    $('.js-img-show').enlargePicture()

  # 地址初始化
  addressInit: () =>
    if @$form.data('company-info').status is 0 and $(".js-left-box").length
      @initAddress($('.js-left-box').find('.address-group'))
      @initAddress($('.js-right-box').find('.address-group'))
    else
      @initAddress()

  # 可编辑状态
  changeToEdit: (evt) =>
    @intoEdit()
    $('.form-btn').empty().append(editBtnTemplate({}))
    @$form.off().validator({
      isErrorOnParent: true,
      identifier: "input,textarea"
    })
    @$form.on "submit", @changeCompanyInfo
    $('.js-upload-img').on "click", @fileUpload
    @exchangeExtra()     # 转换成可编辑状态时需要执行的一些其他操作或取值

  # 表单切换成编辑状态
  intoEdit: () =>
    $('input,select,textarea', @$form).prop 'disabled', false
    $('select').selectric("refresh")
    year = (new Date()).getFullYear()
    $(".estab-datepicker").datepicker({
      maxDate: new Date(),
      yearRange: [year-120, year]
    })
    $(".datepicker").datepicker({ yearRange: [year-60, year+60] })
    new CommonDatepicker(@$form)
    $('.main-image').find('input').removeClass("hide")

  # 取消编辑
  cancelEdit: () ->
    window.location.reload()

  # 保存修改的公司信息
  changeCompanyInfo: (evt) =>
    evt.preventDefault()
    data = $(evt.target).serializeObject()
    oldCompanyInfo = @$form.data('company-info')
    address = @organizeAddress()
    scope = if _.isArray(data.scope) then data.scope else data.scope.split(',')
    data.scope = JSON.stringify scope
    data = _.extend oldCompanyInfo, data, address
    $.ajax
      url: '/api/company/info',
      type: "PUT",
      contentType: "application/json"
      data: JSON.stringify data
      success: () ->
        new Modal({
          icon: "info",
          title: "成功！",
          content: "基本消息变更成功，请等待审核"
        }).show () -> window.location.reload()

  # 组织获得地址数据
  organizeAddress: () ->
    address = $('.address-select option:selected')
    province = address.eq(0).text()
    city = address.eq(1).text()
    region = address.eq(2).text()
    return { province, city, region }

  # 上传
  fileUpload: (evt) ->
    $self = $(evt.currentTarget)
    new FileUpload($self.find("input[type=file]"), (data) ->
      imageUrl = data.path
      $self.find("img").attr("src", imageUrl).show()
      $self.find("img").css({"width":'70px', "height": '70px'})
      $self.find("input[type=hidden]").attr "value", imageUrl
    , '', 'image')

module.exports = CompanyInfo
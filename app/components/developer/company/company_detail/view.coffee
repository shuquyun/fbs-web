Modal = require("pokeball").Modal
FileUpload = require("utils/module").plugins.upload
developerCompanyInfo = require "developer/company/company_info/view"
editBtnTemplate = Handlebars.templates["developer/company/company_detail/frontend_templates/button"]

class PerfectCompanyDetail extends developerCompanyInfo
  constructor: ($) ->
    super($)
    @$form = $('.perfect-info-form')

  bindEvent: ->
    super

  # 地址初始化  继承company_info中的函数addressInit() 并  执行common/address_select中初始化地址的函数
  addressInit: () =>
    @initAddress()

  # 保存完善的公司信息
  changeCompanyInfo: (evt) =>
    evt.preventDefault()
    data = $(evt.target).serializeObject()
    oldCompanyInfo = @$form.data('company-info')
    data.companyHonour = @organizeHonour(data)
    address = @organizeAddress()
    data = _.extend oldCompanyInfo, data, address
    $.ajax
      url: '/api/company/developer/profile',
      type: "PUT",
      contentType: "application/json"
      data: JSON.stringify data
      success: (data) ->
        new Modal({
          icon: "info",
          title: "成功！",
          content: "完善公司消息成功！"
        }).show () -> window.location.reload()

  # 处理企业荣誉与备注
  organizeHonour: (data) ->
    honourImg = []
    _.map data.honourImg, (thisData) ->
      if thisData then honourImg.push(thisData) else ''
    _.map data.honourImg, (thisData) ->
      if !thisData then honourImg.push(thisData) else ''
    return JSON.stringify { honourImg, "honourRemark": data.honourRemark }

  # 此处这个函数无需任何特殊操作，空执行
  exchangeExtra: () ->

module.exports = PerfectCompanyDetail
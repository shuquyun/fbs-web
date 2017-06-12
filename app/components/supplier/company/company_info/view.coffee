Modal = require("pokeball").Modal
developerCompanyInfo = require "developer/company/company_info/view"
SelectOption = require "common/select_speciality/view"
editBtnTemplate = Handlebars.templates["developer/company/company_detail/frontend_templates/button"]

class CompanyInfo extends developerCompanyInfo
  constructor: ($) ->
    super

  # 获得专业与城市
  exchangeExtra: () ->
    $(".js-selector-group").selectSpecial()

  # 保存修改的公司信息
  changeCompanyInfo: (evt) =>
    evt.preventDefault()
    data = $(evt.target).serializeObject()
    oldCompanyInfo = @$form.data('company-info')
    if $(".each-city").length is 0
      new Modal({ icon: 'error', title: '信息不完善', content: '至少选择一个服务城市' }).show()
      return false
    if $(".each-speciality").length is 0
      new Modal({ icon: 'error', title: '信息不完善', content: '至少选择一个专业类型' }).show()
      return false
    data.special = _.map $(".each-speciality"), (current) ->
      return $(current).data()
    data.serviceCitys = _.map $(".each-city"), (current) ->
      return $(current).data()
    address = @organizeAddress()
    data = _.extend oldCompanyInfo, data, address
    $.ajax
      url: '/api/company/info',
      type: "PUT",
      contentType: "application/json"
      data: JSON.stringify data
      success: (data) ->
        new Modal({
          icon: "info",
          title: "成功！",
          content: "基本消息变更成功，请等待审核"
        }).show () -> window.location.reload()

  # 获得专业
  getSpeciality: () ->
    new SelectOption({
      "index": '.js-speciality-selector'
      "type": 'speciality'
      "api": '/api/base-major/tree'
    })

  # 获得地址
  getCity: () ->
    new SelectOption({
      "index": '.js-city-selector'
      "type": 'city'
      "api": '/api/address/0/children'
    })

module.exports = CompanyInfo
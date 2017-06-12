Modal = require("pokeball").Modal
developerCompanyDetail = require "developer/company/company_detail/view"

class CompanyInfoDescribe extends developerCompanyDetail
  constructor: ($)->
    super

  # 保存完善的公司信息
  changeCompanyInfo: (evt) =>
    evt.preventDefault()
    data = $(evt.target).serializeObject()
    data.companyId = @$form.data('company-id').id
    data.companyHonour = @organizeHonour(data)
    address = @organizeAddress()
    supplierProfile = _.extend data, address
    $.ajax
      url: '/api/company/supplier/profile',
      type: "PUT",
      contentType: "application/json"
      data: JSON.stringify supplierProfile
      success: (data) ->
        new Modal({
          icon: "info",
          title: "成功！",
          content: "描述信息变更成功！"
        }).show () -> window.location.reload()

module.exports = CompanyInfoDescribe
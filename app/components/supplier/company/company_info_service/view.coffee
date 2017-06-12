Modal = require("pokeball").Modal
supplierCompanyTax = require "supplier/company/company_info_tax/view"

class CompanyInfoService extends supplierCompanyTax
  constructor: ($)->
    super

  submitSpecialInfo: (data) ->
    brandJson = JSON.stringify _.map $('.js-brand-info'), (i) -> $(i).data('info')
    cooperateJson = JSON.stringify  _.map $('.js-cooperate-info'), (i) -> $(i).data('info')
    machineJson = JSON.stringify  _.map $('.js-machines-info'), (i) -> $(i).data('info')
    projectManagerJson = JSON.stringify  _.map $('.js-manager-info'), (i) -> $(i).data('info')
    specialData = { brandJson, cooperateJson, machineJson, projectManagerJson }
    supplierProfile = _.extend specialData, data.supplierProfile
    supplierProfile.oemJson = JSON.stringify supplierProfile.oems
    data = _.extend data, { supplierProfile }
    $.ajax
      url: '/api/company/supplier/info/3',
      type: "PUT",
      contentType: "application/json"
      data: JSON.stringify data
      success: (data) ->
        new Modal({
          icon: "info",
          title: "成功！",
          content: "服务信息变更成功，请等待审核"
        }).show () -> window.location.reload()

module.exports = CompanyInfoService
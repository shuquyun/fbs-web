Modal = require("pokeball").Modal
supplierCompanyTax = require "supplier/company/company_info_tax/view"

class CompanyInfoContact extends supplierCompanyTax
  constructor: ($) ->
    super

  submitSpecialInfo: (data) ->
    contacts = _.map $('.js-contact-info'), (i) -> $(i).data('info')
    specialData = { 'contactJson': JSON.stringify contacts }
    supplierProfile = data.supplierProfile
    data = _.extend supplierProfile, specialData
    $.ajax
      url: '/api/company/supplier/profile',
      type: "PUT",
      contentType: "application/json"
      data: JSON.stringify data
      success: (data) ->
        new Modal({
          icon: "info",
          title: "成功！",
          content: "信息变更成功"
        }).show () -> window.location.reload()

module.exports = CompanyInfoContact
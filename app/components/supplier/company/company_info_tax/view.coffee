Modal = require("pokeball").Modal
CommonDatepicker = require("utils/module").plugins.commonDatepicker
FileUpload = require("utils/module").plugins.upload
developerCompanyInfo = require "developer/company/company_info/view"
editBtnTemplate = Handlebars.templates["developer/company/company_detail/frontend_templates/button"]
tableModalTemplate = Handlebars.templates["user/register_company/frontend_templates/add_table_modal"]
optionTrTemplate = Handlebars.partials["supplier/company/company_info_tax/all_templates/_option_tr"]

class CompanyInfoTax extends developerCompanyInfo
  constructor: ($)->
    super($)
    @$form = $('.js-supplier-form-submit')

  # 初始化状态
  addressInit: () ->

  # 可编辑表单 绑定函数
  exchangeExtra: () ->
    $('.js-cancel-edit').on "click", @cancelEdit
    $('.js-add-edit-item').on "click", @addEdit
    $('.js-delete-item').on "click", @deleteTr

  changeCompanyInfo: (evt) =>
    evt.preventDefault()
    supplierProfile = $(evt.target).serializeObject()
    info = @$form.data('company-info')
    { id, name, type, subType } = info
    company = _.extend @organizeCompany(info), { id, name, type, subType }
    @submitSpecialInfo({ company, supplierProfile })

  submitSpecialInfo: (data) ->
    outputs = _.map $('.js-output-info'), (i) -> $(i).data('info')
    partners = _.map $('.js-partner-info'), (i) -> $(i).data('info')
    achievements = _.map $('.js-achievement-info'), (i) -> $(i).data('info')
    specialData = { outputs, partners, achievements }
    data = _.extend data, specialData
    $.ajax
      url: '/api/company/supplier/info/2',
      type: "PUT",
      contentType: "application/json"
      data: JSON.stringify data
      success: (data) ->
        new Modal({
          icon: "info",
          title: "成功！",
          content: "税务信息变更成功，请等待审核"
        }).show () -> window.location.reload()
  
  # 组织公司company数据
  organizeCompany: (data) ->
    { province, provinceId, city, cityId, region, regionId } = data
    return { province, provinceId, city, cityId, region, regionId }

  # table表单 填写
  addEdit: (evt) =>
    { type, data } = $(evt.target).data()
    if type is 'achievement' and data and data.joinAt.length is 10
      data.timeFlag = '1'
    @tableModal = new Modal(tableModalTemplate({ data, type }))
    @tableModal.show()
    @initAddress() if type is 'partner'
    if type is 'achievement'
      year = (new Date()).getFullYear()
      $(".datepicker").datepicker({
        maxDate: new Date(), yearRange: [year-120, year]
      })
      new CommonDatepicker(@$form)
    $('select').selectric('refresh')
    $('.set-new-tr-form').off().validator({ isErrorOnParent: true })
    $('.set-new-tr-form').on "submit", (event) => @addTr(event, evt)
    $('.js-upload-img').on "click", @fileUpload

  # 增加或修改一行
  addTr: (event, evt) =>
    event.preventDefault()
    $parent = $(evt.target).parent()
    formData = $(event.target).serializeObject()
    type = $(event.target).data('type')
    if type is 'partner'
      _.extend formData, @organizeAddress()
    if type is 'achievement' and (!formData.indexUrl or !formData.signUrl)
      @showModal('请确认首页与签字页图片是否上传')
      return false
    if type is 'brand' and !formData.logo
      @showModal('请确认logo是否上传')
      return false
    array = []
    array.push formData
    data = {}
    data[type] = array
    modalData = _.extend(data, { type })
    if type is 'achievement'
      modalData = _.extend(modalData, { timeFlag: '1' })
    if $(event.target).data('data')
      $parent.parent('tr').replaceWith(optionTrTemplate(modalData))
    else
      $parent.siblings('table').find('tbody').append(optionTrTemplate(modalData))
    @tableModal.close()
    $('.set-new-tr-form').off()
    $('.js-add-edit-item').off().on "click", @addEdit
    $('.js-delete-item').off().on "click", @deleteTr
    $('.js-img-show').off().enlargePicture()

  # 删除一行
  deleteTr: (evt) ->
    $(evt.target).parent().parent('tr').remove()

  # 表单错误提醒
  showModal: (note) ->
    new Modal({
      icon: "info",
      title: "信息未填写完整",
      content: note
    }).show()

module.exports = CompanyInfoTax
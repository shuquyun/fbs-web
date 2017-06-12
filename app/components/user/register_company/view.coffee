###
  注册组件
  author by terminus.io (zl)
###
Modal = require("pokeball").Modal
CommonDatepicker = require("utils/module").plugins.commonDatepicker
address = require "common/address_select/view"
FileUpload = require("utils/module").plugins.upload

optionTrTemplate = Handlebars.partials["user/register_company/all_templates/_option_tr"]

tableModalTemplate = Handlebars.templates["user/register_company/frontend_templates/add_table_modal"]

developerTemplate = Handlebars.templates["user/register_company/all_templates/developer_form"]
supplierTemplate = Handlebars.templates["user/register_company/all_templates/supplier_form"]

class Register extends address
  constructor: ($) ->
    @$form = $('.js-register-form')
    @$formContent = $('.js-form-content')
    @$companyName = $('#company-name')
    @$checkComBtn = $('.js-check-company')
    @$noRegister = $('.not-register')
    @$hasRegister = $('.has-register')
    @$selectComType = $('.js-select-company-type')
    @oldCompanyInfo = {}
    @supplierBaseData = {}
    @supplierSecondData = {}
    @tableModal
    @bindEvent()

  bindEvent: ->
    @init()
    @$el.on "focus", '#company-name', @hideNote
    @$el.on "click", '.js-create-company', @createCompany
    @$el.on "change", '.js-select-type', @renderDifferForm
    $(document).on "click", '.js-upload-img', @fileUpload

  # 初始化
  init: () =>
    companyName = $.query.get('companyName')
    applyId = $.query.get('applyId')
    urlType = if applyId is true then "last" else applyId
    if applyId
      $("body").spin("large")
      $.ajax
        url: "/api/company/apply/#{urlType}"
        type: "get"
        success: (data) =>
          $("body").spin(false)
          @oldCompanyInfo = data
          if data.type is 1  # 加入已存在的公司不成功
            @toggleClass([@$noRegister, @$checkComBtn], @$hasRegister)
            @$companyName.prop('value', data.companyName)
            $('#remark').prop('value', data.dataJson)
            @bindFunction(@$form, @joinCompany)
          else  # 创建新公司不成功
            @renderDifferForm({}, data.type, data)
    else
      if companyName   # 非正常创建新公司
        @$companyName.prop('value', companyName)
        @checkCompany(companyName)
      @bindFunction(@$form, @submitCompanyName)  # 正常创建新公司

  # 提交公司名字
  submitCompanyName: (evt) =>
    evt.preventDefault()
    @checkCompany(@$companyName.val())

  # 检查公司是否已注册
  checkCompany: (companyName) =>
    $.ajax
      url: "/api/company?companyName=#{companyName}"
      type: "get"
      success: (result) =>
        @$checkComBtn.addClass('hide')
        # 公司已存在
        if result.id
          @oldCompanyInfo = result
          @toggleClass(@$noRegister, @$hasRegister)
          @bindFunction(@$form, @joinCompany)
        # 公司未注册
        else
          @oldCompanyInfo = {}
          @toggleClass(@$hasRegister, @$noRegister)
  
  hideNote: () =>
    @bindFunction(@$form, @submitCompanyName)
    @toggleClass([@$hasRegister, @$noRegister, @$selectComType], @$checkComBtn)

  # 公司不存在时，创建新公司按钮
  createCompany: (evt) =>
    @toggleClass($(evt.target).parent('.not-register'), @$selectComType)

  # 选择注册类型
  renderDifferForm: (evt, type, data) =>
    subType = if evt.target then $(evt.target).val() else data.extra.subType
    @differTypeInfo(subType, type, data)
    if subType isnt '1'
      @bindFunction($('.js-base-info'), (event) => @goNextForm(event, 1))
      @bindFunction($('.js-special-info'), (event) => @goNextForm(event, 2))
      @bindFunction($('.js-submit-info'), @supplierSubmit)
      $(".js-go-parent").on "click", () => @showSwitchTab(0, 1)
      $(".js-go-prev").on "click", () => @showSwitchTab(1, 2)
    else
      @bindFunction(@$form, @developerSubmit)
    $('select').selectric('refresh')
    year = (new Date()).getFullYear()
    $(".register-time").datepicker({ maxDate: new Date(), yearRange: [year-120, year] })
    $(".datepicker").datepicker({ yearRange: [year-60, year+60] })
    new CommonDatepicker(@$form)
    @initAddress()
    $('.js-add-edit-item').on "click", @addEdit
    $('.js-delete-item').on "click", @deleteTr

  # 根据不同的 subType 展示不同的表单 type 表示不同的申请方式
  differTypeInfo: (subType, type, data) =>
    data = if data then JSON.parse data.dataJson else ''
    switch parseInt subType
      when 1
        if data
          data = data.company
          scope = JSON.parse(data.scope).join(',')
        name = if data then data.name else @$companyName.val()
        template = developerTemplate({ subType, name, scope, data })
        @$formContent.empty().append(template)
      when 2,3,4
        name = if data then data.company.name else @$companyName.val()
        template = supplierTemplate({ subType, name, data })
        @$formContent.empty().append(template)
    $('.js-selector-group').selectSpecial()

  # 跳转tab
  goNextForm: (event, index) =>
    event.preventDefault()
    data = $(event.target).serializeObject()  # 公司填写信息
    if index is 1 and !@checkFristForm(data)
      return false
    if index is 1
      $address = $('.address-select option:selected')
      data.province = $address.eq(0).text()
      data.city = $address.eq(1).text()
      data.region = $address.eq(2).text()
      data.special = _.map $(".each-speciality"), (current) ->
        return { "id": $(current).data("id"), "name": $(current).data("name")}
      data.serviceCitys = _.map $(".each-city"), (current) ->
        return { id, name, parentId, parentName } = $(current).data()
      @supplierBaseData = data
    if index is 2
      @supplierSecondData = data
    @showSwitchTab(index, index-1)
    $("body").animate({ scrollTop: 100 }, 10)

  # 校验第一张表
  checkFristForm: (data) =>
    if !@checkImageData(data)
      return false
    if !$('.js-city-id').val()
      @showModal('请至少选择一个服务城市')
      return false
    if !$('.js-speciality-id').val()
      @showModal('请至少选择一个专业类型')
      return false
    true

  # 展示哪一个tab,可能跳下一个也可能跳上一个
  showSwitchTab: (isShow, notShow) ->
    $('.tab').find('ul li').eq(notShow).removeClass('active')
    $('.tab').find('ul li').eq(isShow).addClass('active')
    $('.tab-contents').find('.tab-content').eq(notShow).css('display', 'none')
    $('.tab-contents').find('.tab-content').eq(isShow).css('display', 'block')
    $("body").animate({ scrollTop: 100 }, 10)

  # 开发商注册
  developerSubmit: (evt) =>
    $('.js-developer-btn').attr 'disabled', true
    evt.preventDefault()
    data = $('.js-base-info').serializeObject()  # 公司填写信息
    if !@checkImageData(data)
      $('.js-developer-btn').attr 'disabled', false
      return false
    $address = $('.address-select option:selected')
    data.province = $address.eq(0).text()
    data.city = $address.eq(1).text()
    data.region = $address.eq(2).text()
    scope = if _.isArray(data.scope) then data.scope else data.scope.split(',')
    data.scope = JSON.stringify scope
    data.type = if data.subType is '1' then '1' else '2'
    url = '/api/company/developer/register'
    @submit({ 'company': data }, url)

  # 供应商注册
  supplierSubmit: (evt) =>
    $('.js-supplier-btn').attr 'disabled', true
    evt.preventDefault()
    data = $(evt.target).serializeObject()

    subType = @supplierBaseData.subType
    type = if subType is '1' then '1' else '2'
    company = _.extend @supplierBaseData, { type }

    contacts = _.map $('.js-contact-info'), (i) -> $(i).data('info')
    if contacts.length is 0
      @showModal('联系人至少增加一条')
      $('.js-supplier-btn').attr 'disabled', false
      return false

    cooperates = _.map $('.js-cooperate-info'), (i) -> $(i).data('info')
    machines = _.map $('.js-machines-info'), (i) -> $(i).data('info')
    projectManagers = _.map $('.js-manager-info'), (i) -> $(i).data('info')
    brands = _.map $('.js-brand-info'), (i) -> $(i).data('info')
    tableData = { contacts, cooperates, machines, brands, projectManagers }
    supplierProfile = _.extend @supplierSecondData, tableData, data

    outputs = _.map $('.js-output-info'), (i) -> $(i).data('info')
    partners = _.map $('.js-partner-info'), (i) -> $(i).data('info')
    achievements = _.map $('.js-achievement-info'), (i) -> $(i).data('info')
    specialTableData = { outputs, partners, achievements }

    formData = _.extend { company }, { supplierProfile }, specialTableData
    url = '/api/company/supplier/register'
    # 共同处理 3把 数据
    @submit(formData, url)

  # 开发商 供应商提交 （将相同的部分写进来）
  submit: (data, url) =>
    status = @$form.data('user').status
    goUl = if status is 1 then '/user/my-company-review' else '/register-result'
    $.ajax
      url: url,
      type: "POST",
      contentType: "application/json"
      data: JSON.stringify data
      success: (data) ->
        new Modal({
          title: "申请成功",
          icon: 'success',
          content: '请等待审核通知'
        }).show(() ->
          $("body").spin("medium")
          window.location.href = goUl
        )

  # 申请加入存在的公司
  joinCompany: (evt) =>
    evt.preventDefault()
    data = $(evt.target).serializeObject()
    data.companyType = @oldCompanyInfo.type
    companyId = @oldCompanyInfo.companyId   # 非回填时的公司ID
    id = @oldCompanyInfo.id    # 回填时的公司ID
    data.companyId = if companyId then parseInt companyId else parseInt id
    data.companyName = data.name
    status = @$form.data('user').status
    url = if status is 1 then '/user/my-company-review' else '/register-result'
    $.ajax
      url: "/api/company/join",
      type: "GET",
      contentType: "application/json"
      data: data
      success: (data) ->
        new Modal({
          title: "申请加入公司成功",
          icon: 'success',
          content: '查看审核结果'
        }).show(() ->
          $("body").spin("medium")
          window.location.href = url
        )

  # table表单 填写
  addEdit: (evt) =>
    type = $(evt.target).data('type')
    data = $(evt.target).data('data')
    if type is 'achievement' and data and data.joinAt.length is 10
      data.timeFlag = '1'
    @tableModal = new Modal(tableModalTemplate({ data, type }))
    @tableModal.show()
    $form = $('.set-new-tr-form')
    if type is 'partner'
      @initAddress($form.find('.address-select').parent('.control-group'))
    if type is 'achievement'
      year = (new Date()).getFullYear()
      $(".datepicker").datepicker({ maxDate: new Date(), yearRange: [year-120, year] })
      new CommonDatepicker($form)
    $('select').selectric('refresh')
    @bindFunction($form, (event) => @addTr(event, evt))

  # 增加或修改一行
  addTr: (event, evt) =>
    event.preventDefault()
    $el = $(evt.target)
    formData = $(event.target).serializeObject()
    type = $(event.target).data('type')
    if type is 'partner'
      $address = $('.modal-address-select option:selected')
      formData.province = $address.eq(0).text()
      formData.city = $address.eq(1).text()
      formData.region = $address.eq(2).text()
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
      $parent = $el.parent()
      $parent.parent('tr').replaceWith(optionTrTemplate(modalData))
    else
      $parent = $el.parent().parent()
      $parent.parent().siblings('tbody').append(optionTrTemplate(modalData))
    @tableModal.close()
    $('.set-new-tr-form').off()
    $('.js-add-edit-item').off().on "click", @addEdit
    $('.js-delete-item').off().on "click", @deleteTr

  # 删除一行
  deleteTr: (evt) ->
    $(evt.target).parent().parent('tr').remove()

  # 开发商 供应商 图片检查
  checkImageData: (data) =>
    if !data.licenceImg
      @showModal('请确认营业执照图片是否上传')
      return false
    if data.subType is '2' and !data.idCard
      @showModal('请确认证件图片是否上传')
      return false
    if data.subType is '3' and (!data.idCard or !data.proxy or !data.authorizee)
      @showModal('请确认证件图片是否上传')
      return false
    if data.subType is '4' and (!data.idCard or !data.proxy or !data.authorizee)
      @showModal('请确认证件图片是否上传')
      return false
    else
      return true

  # 表单错误提醒
  showModal: (note) ->
    new Modal({ icon: "info", title: "信息未填写完整", content: note }).show()

  # 表单绑定函数
  bindFunction: ($form, fn) ->
    $form.off().validator({ isErrorOnParent: true })
    $form.on "submit", fn

  # 上传
  fileUpload: (evt) ->
    $self = $(evt.currentTarget)
    new FileUpload($self.find("input[type=file]"), (data) ->
      imageUrl = data.path
      $self.find("img").attr("src", imageUrl).show()
      $self.find("img").css({"width":'70px', "height": '70px'})
      $self.find("input[type=hidden]").attr "value", imageUrl
    , '', 'image')

  toggleClass: (add, move, className) ->
    className = if className then className else 'hide'
    if add.length is 1
      add.addClass(className)
    else
      _.map add, (each) -> $(each).addClass(className)
    if move.length is 1
      move.removeClass(className)
    else
      _.map move, (each) -> $(each).removeClass(className)

module.exports = Register

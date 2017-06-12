Modal = require "pokeball/components/modal"
applyTemplate = Handlebars.templates["developer/company/company_apply/frontend_templates/apply_modal"]
optionTemplate = Handlebars.templates["developer/company/company_apply/frontend_templates/role_option"]

class UserApplyManage
  constructor: () ->
    @$checkSuccess = $('.js-apply-success')
    @$checkFail = $('.js-apply-fail')
    @bindEvent()

  bindEvent: () ->
    @init()
    @$checkSuccess.on "click", @applySuccess
    @$checkFail.on "click", @applyFail
  
  # 获取公司所有角色
  init: () ->
    $.ajax
      url: "/api/company/role/all"
      type: "GET"
      success: (data) ->
        $.each $('.select-role'), (index, tr) ->
          $(tr).empty().append(optionTemplate({ data }))
          $('select').selectric()

  # 点击审核通过 组织数据
  applySuccess: (evt) =>
    $el = $(evt.target)
    applyId = $el.data('id')
    $role = $el.parent().siblings('.js-role-tr').find('.select-role')
    roleId = $role.val()
    roleName = $role.find('option:selected').data('name')
    data = { applyId, status: '1', roleId, roleName, remark: '' }
    if !roleId
      new Modal({
        title: "温馨提示",
        icon: "info",
        htmlContent: "请确认角色是否选择"
      }).show()
    else
      @applySubmit(data)

  # 点击审核不通过 组织数据
  applyFail: (evt) =>
    id = $(evt.target).data('id')
    new Modal(applyTemplate({ id })).show()
    $('.set-apply-fail-form').off().validator({
      isErrorOnParent: true
    })
    $('.set-apply-fail-form').on "submit", @formSubmit

  formSubmit: (evt) =>
    evt.preventDefault()
    data = _.extend($(evt.target).serializeObject(), { status: '-1' })
    @applySubmit(data)

  # 审核用户 提交
  applySubmit: (data) ->
    $.ajax
      url: "/api/company/apply/user-check"
      type: "GET"
      data: data
      success: (data) ->
        location.reload()

module.exports = UserApplyManage
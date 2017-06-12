###
  修改用户密码接口
  author by terminus.io (zl)
###
Tip = require "common/tip_and_alert/view"
Login = require "common/login/view"

class UpdatePassword

  constructor: ($) ->
    @$form = $(".update-pasword-form")
    @$passwordInput = $("#new-password")
    @$confirmPassInput = $("#confirm-password")
    @bindEvent()

  bindEvent: ->
    @$passwordInput.on "keyup", @passwordKeyUp
    @$confirmPassInput.on "keyup", @passwordConfirm
    @$form.validator({ isErrorOnParent: true })
    @$form.on "submit", @submitNewPassword

  # 检查密码是否相同
  passwordConfirm: () =>
    confirmPass = @$confirmPassInput.val()
    if confirmPass isnt ""
      password = @$passwordInput.val()
      closestGroup = @$confirmPassInput.closest(".control-group")
      closestGroup.find(".note-error").hide()
      closestGroup.find(".note").show()
      if password isnt confirmPass
        closestGroup.find(".note").hide()
        closestGroup.find(".note-error").show()
        $("button[type=submit]").attr("disabled", true)
      else
        closestGroup.find(".note").hide()
        $("button[type=submit]").removeAttr("disabled")

  # 提交修改密码
  submitNewPassword: (evt) ->
    evt.preventDefault()
    $("body").spin("large")
    $.ajax
      url: "/api/user/change_password"
      type: "POST"
      data: $(@).serialize()
      success: (data)=>
        new Tip
          parent: $(".update-password")
          type: "success", title: i18n.ct('success', 'user')
          message: i18n.ct('passwordModifiedSuccessfully', 'user')
          left: 300
          top: 180
        .alert()
        $(@).find("input").val("")
        $(".password-level div").removeClass("active")
      error: (jqXHR) ->
        if jqXHR.status is 401
          Login.showLoginModal()
        else
          new Tip
            parent: $(".update-password")
            type: "error"
            title: i18n.ct('passwordModifyingFailed', 'user')
            message: jqXHR.responseJSON.message
            left: 300
            top: 180
          .alert()
      complete: ->
        $("body").spin(false)

  # 校验密码强度
  passwordKeyUp: (evt) =>
    @passwordConfirm()
    pass = $(evt.target).val()
    lv = -1
    lv++ if pass.match(/[a-z]/)
    lv++ if pass.match(/[0-9]/)
    lv++ if pass.match(/[A-Z]/)
    lv++ if pass.match(/[!,@#$%^&*?_~]/)
    lv++ if pass.length > 10 and pass.length <= 16
    lv=-1 if pass.length < 6 or pass.length > 16
    @showStrength(lv)

  # 显示密码强度
  showStrength: (lv)->
    $(".password-level div").removeClass("active")
    switch lv
      when -1
        break
      when 0
        $(".weak-bar").addClass("active")
        break
      when 1,2
        $(".middle-bar").addClass("active")
        break
      else
        $(".strong-bar").addClass("active")

module.exports = UpdatePassword

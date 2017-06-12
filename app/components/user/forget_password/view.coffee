Modal = require("pokeball").Modal

class ForgetPassword

  constructor: ($)->
    @forgetPasswordForm = $(".forget-password-form")
    @jsVerifyCode = $(".js-verify-code")
    @verifyCodeInput = $("#verify-code")
    @getCodeButton = $(".get-code")
    @mobilePhone = $("#mobile-phone")
    @confirmPassInput = $("#confirm-password")
    @passwordInput = $("#password")
    @isChecked = 1
    @bindEvent()

  bindEvent: ->
    @forgetPasswordForm.validator
      isErrorOnParent: true
    @jsVerifyCode.on "click", @refreshVerifyCode
    @verifyCodeInput.on "keyup", @verifyCode
    @forgetPasswordForm.on "submit", @confirmUserInfo
    @getCodeButton.on "click", @getCode
    @mobilePhone.on "keyup", @mobileValidator
    @mobilePhone.on "blur", @mobileValidator
    @confirmPassInput.on "keyup", @validatePassword
    @passwordInput.on "keyup", @validatePassword

  verifyCode: =>
    if @verifyCodeInput.val().length is 4 && @getCodeButton.data("disab") && @getCodeButton.data("delay") is 60
      @getCodeButton.removeAttr "disabled"
    else
      @getCodeButton.attr "disabled", "disabled"

  refreshVerifyCode: =>
    @jsVerifyCode.attr "src", "/api/user/captcha?date=#{new Date().getTime()}"

  modalTip = (icon, title, message)->
    tip = new Modal
      "icon": icon
      "title": title
      "content": message
    tip

  mobileValidator: (evt)=>
    $self = $(evt.currentTarget)
    pattern = /^1[3-9]\d{9}$/
    mobile = $self.val()
    $self.siblings(".required").remove()
    if pattern.test mobile
      @isChecked = 1
      @getCodeButton.data "disab", "true"
      @verifyCode()
    else
      @isChecked = 0
      @getCodeButton.data "disab", ""
      @verifyCode()

  setIntervalId: ($code)->
    intervalId = setInterval =>
      delay = parseInt($code.data("delay"))
      if delay == 1 or delay == NaN
        $code.text("#{i18n.ct('reacquireCaptcha', 'user')}").prop("disabled", false)
        $code.data("delay", 60)
        clearInterval intervalId
        return
      $code.data("delay", delay - 1)
      $code.text("#{delay - 1}#{i18n.ct('secondsAfter', 'user')}")
    , 1000

  getCode: (evt)=>
    $self = $(evt.currentTarget)
    $self.text("#{i18n.ct('sendingCaptcha', 'user')}").prop("disabled", true)
    $.ajax
      url: "/api/user/reset-password-by-mobile/send-sms?mobile=#{$("#mobile-phone").val()}&captcha=#{$("#verify-code").val()}"
      type: "POST"
      success: (data)=>
        modalTip("success","#{i18n.ct('confirmCaptchaFp', 'user')}", "#{i18n.ct('clickToReacquireFp', 'user')}").show()
        @setIntervalId($self)
      error: (data)=>
        $self.text("获取手机验证码")
        options = {icon: "error", title: "oops!", content: data.responseJSON.message}
        new Modal(options).show()

  validatePassword: (evt)=>
    password = @passwordInput.val()
    confirmPassword = @confirmPassInput.val()
    closestGroup = @confirmPassInput.closest(".control-group")
    # closestGroup.find(".note").show()
    $self = $(evt.currentTarget)
    if password isnt confirmPassword
      @isChecked = 0
      $self.siblings(".required-error").remove()
      if $self.prop("id") is 'confirm-password'
        closestGroup.find(".note").hide()
      if confirmPassword
        @confirmPassInput.siblings(".required-error").remove()
        @confirmPassInput.parent().append("<span class=\"required-error required\"><i>&times;</i> #{i18n.ct('passwordDiff', 'user')}</span>")
    else
      @isChecked = 1
      $self.siblings(".note").remove()
      @confirmPassInput.siblings(".required-error").remove()

  confirmUserInfo: (evt)=>
    $self = $(evt.currentTarget)
    if @isChecked is 1
      $("body").spin("large")
      $.ajax
        url: "/api/user/reset-password-by-mobile"
        type: "POST"
        data: $self.serialize()
        success: (data)->
          window.location.href = "/forget-password-success"
        complete: ->
          $("body").spin(false)

module.exports = ForgetPassword

###
  注册用户组件
  author by terminus.io (zl)
###
Modal = require("pokeball").Modal

class RegisterUser
  constructor: ($)->
    @$form = $('.js-register-form')
    @$mobile = $('#mobile-phone')
    @$email = $('#email')
    @$passwordInput = $('#password')
    @$confirmPassword = $('#confirm-password')
    @$code = $('.js-get-code')
    @mobileSingle = true
    @emailSingle = true
    @bindEvent()

  bindEvent: ->
    @$mobile.on "blur", @checkMobile
    @$email.on "blur", @checkEmail
    @$code.on "click", @getCode
    @$passwordInput.on "keyup", @passwordKeyUp
    @$confirmPassword.on "keyup", @passwordConfirm
    @$form.validator isErrorOnParent: true
    @$form.on "submit", @gotoNext

  # 检查手机号码唯一性
  checkMobile: (evt) =>
    $el = $(evt.currentTarget)
    @mobileSingle = true
    @$code.attr 'disabled', true
    $el.siblings('.note-error').html '<i class="icon-hsh icon-hsh-tanhao"></i> 请输入11位中国大陆手机号'
    if /^1[3|4|5|7|8]\d{9}$/.test $el.val()
      $.ajax
        url: "/api/user/mobile-available?mobile=#{$el.val()}"
        type: "GET"
        success: (data) =>
          if data.isAvailable is true && data.value is "ok"
            @$code.attr 'disabled', false
            $el.siblings('.note-success').html '<i class="icon-hsh icon-hsh-gou1"></i> 该手机号未注册'
          else
            @mobileSingle = false
            $el.siblings('.note-error').html '<i class="icon-hsh icon-hsh-tanhao"></i> 该手机号已注册'
            $el.parent('div').removeClass('success').addClass('error')

  # 检查邮箱唯一性
  checkEmail: (evt) =>
    $el = $(evt.currentTarget)
    @emailSingle = true
    $el.siblings('.note-error').html '<i>&times;</i> 请输入正确的邮箱格式'
    if /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/.test $el.val()
      $.ajax
        url: "/api/user/email-available?email=#{$el.val()}"
        type: "GET"
        success: (data) =>
          if !data.isAvailable || data.value is "you"
            @emailSingle = false
            $el.siblings('.note-error').html '<i class="icon-hsh icon-hsh-tanhao"></i> 该邮箱已经注册过'
            $el.parent('div').removeClass('success').addClass('error')

  # 获得验证码
  getCode: (evt) =>
    evt.stopPropagation()
    $.ajax
      url: "/api/user/register-by-mobile/send-sms?mobile=#{@$mobile.val()}"
      type: "POST"
      success: (data) =>
        new Modal({
          icon: "info",
          title: "验证码已发送,请注意查收",
          content: "如果长时间未收到，可以点击按钮重新获取验证码"
        }).show()
        @$code.attr 'disabled', true
        @setIntervalId(@$code)

  # 设定获取验证码倒计时
  setIntervalId: (target) ->
    intervalId = setInterval ->
      delay = parseInt(target.data("delay"))
      if delay is 1
        target.text("再次点击发送").removeAttr("disabled")
        target.data("delay", 60)
        clearInterval intervalId
        return
      target.data("delay", delay - 1)
      target.text "#{delay}秒后重发"
    , 1000

  # 检验密是否一致
  passwordConfirm: () =>
    confirmPass = @$confirmPassword.val()
    if confirmPass isnt ""
      closestGroup = @$confirmPassword.closest('.control-group')
      closestGroup.find(".note-error").hide()
      if @$passwordInput.val() isnt confirmPass
        closestGroup.find(".note-error").show()
        closestGroup.find(".note-success").hide()
        $("button[type=submit]").attr("disabled", true)
      else
        closestGroup.find(".note-error").hide()
        closestGroup.find(".note-success").show()
        $("button[type=submit]").removeAttr("disabled")

  # 注册用户表单提交  并下一步
  gotoNext: (evt) =>
    evt.preventDefault()
    data = @$form.serializeObject()
    if !@mobileSingle || !@emailSingle
      if !@mobileSingle
        @$mobile.parent('div').removeClass('success').addClass('error')
      if !@emailSingle
        @$email.parent('div').removeClass('success').addClass('error')
      return false
    $.ajax
      url: "/api/user/register-by-mobile"
      type: "POST"
      data: data
      success: (data) ->
        window.location.href = '/register-company'

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
  showStrength: (lv) ->
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

module.exports = RegisterUser

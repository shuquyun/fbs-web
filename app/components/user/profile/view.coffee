###
  用户资料修改组件
  author by terminus.io (zl)
###
Modal = require("pokeball").Modal
addressSelect = require "common/address_select/view"
properties = require "user/resources/properties"
Login = require "common/login/view"

updateMobileTemplate = Handlebars.templates["user/profile/frontend_templates/update_mobile"]

class Profile extends addressSelect

  constructor: ($)->
    @$userProfileForm = $("#user-profile-form")
    @nickNameInput = $("input[name=username]")
    @mobilePhone = "#mobile-phone"
    @jsVerifyCode = ".js-verify-code"
    @verifyCodeInput = "#verify-code"
    @getCodeButton = (".get-code")
    @$userProfileForm.validator
      identifier: "input"
      isErrorOnParent: true
    setYear()
    @submit = $("#js-user-profile-submit")
    @$emailInput = $("input[name=email]")
    @phoneGroup = $(".control-phone")
    @bindEvents()
    super

  that = this

  bindEvents: ->
    that = this
    @disableSubmitOrNot()
    @levels = properties.resource.address.userProfileLevel
    $(document).on "click", @jsVerifyCode, @refreshVerifyCode
    $(document).on "keyup", @verifyCodeInput, @verifyCode
    $(".user-profile li").addClass("active")
    @$userProfileForm.on "submit", @updateUserProfile
    @nickNameInput.on "focus", @errorRemove
    @nickNameInput.on "blur", @nickNameValidator
    $("#js-swtich-avatar").on "click", @editAvatar
    $("#js-change-mobile").on "click", @editMobile
    $(document).on "keyup", @mobilePhone, @mobileValidator
    @$emailInput.on "focus", @errorRemove
    @$emailInput.on "focusout", @emailValidor
    $(document).on "click", @getCodeButton, @getCode
    @fileUpload()
    if @nickNameInput.val()
      @nickNameInput.blur()

  # 注册上传
  fileUpload: ()=>
    $("input[name=file]").fileupload
      url: "/api/user/files/upload?folderId=0"
      dataType: "html"
      done: (evt, data) =>
        thisButton = $(evt.target).closest(".btn")
        image = _.values(JSON.parse(data.result))[0]
        thisButton.siblings("img").attr("src", image).show()
        thisButton.siblings("input").val(image)

  verifyCode: =>
    if $(@verifyCodeInput).val().length is 4 && $(@getCodeButton).data("disab")
      $(@getCodeButton).removeAttr "disabled"
    else
      $(@getCodeButton).attr "disabled", "disabled"

  refreshVerifyCode: =>
    $(@jsVerifyCode).attr "src", "/api/user/captcha?date=#{new Date().getTime()}"

  #弹出MODAL
  modalTip = (icon, title, message)->
    modal = new Modal
      "icon": icon
      "title": title
      "content": message
    modal

  #判断字符长度
  getLength: (string)->
    length = 0
    chars = string.split("")
    $.each chars, (i, d)->
      if d.charCodeAt(0) < 299
        length++
      else
        length += 1
    length

  #供应商名称校验
  nickNameValidator: (evt)=>
    input = $(evt.currentTarget)
    originName = input.data("nick")
    currentName = input.val()
    parent = input.parent()
    if !$.trim(currentName)
      parent.removeClass("success").addClass("required error empty")
    else if @getLength(currentName) < 5 || @getLength(currentName) > 25
      parent.removeClass("success").addClass("required error")
    else if /^\d*$/.test currentName
      parent.removeClass("success").addClass("required error error-number")
    else if /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test currentName
      parent.removeClass("success").addClass("required error error-email")
    else if !(/^[\d_a-zA-Z]*$/.test(currentName))
      parent.removeClass("success").addClass("required error error-notchar")
    else
      if /^_.*|.*_$/.test currentName
        parent.removeClass("success").addClass("required error error-forline")
      else if originName isnt currentName
        $.ajax
          url: "/api/user/username-available?username=" + currentName
          type: "GET"
          success: (data)=>
            if data then parent.addClass("success") else parent.removeClass("success").addClass("required error error-exists")
            @disableSubmitOrNot()
          error: (data) ->
      else
        parent.removeClass("success")
        @disableSubmitOrNot()
    @disableSubmitOrNot()

  errorRemove: ->
    $(@).parent().removeClass("empty required error error-phone error-email error-notchar error-forline error-exists error-hasemail error-erroremail")

  #设置生日
  setYear= ->
    today = new Date()
    year = today.getFullYear()
    $(".datepicker").datepicker({maxDate: today, yearRange: [year-120, year]})

  #编辑手机号
  editMobile: (evt)=>
    return false if @$el.find(".update-mobile").length > 0
    @phoneGroup.append(updateMobileTemplate())
    $(".update-mobile", @phoneGroup).slideDown "fast", (evt)=>
      @disableSubmitOrNot()
      $(".close", @phoneGroup).on "click", @removeUpdateMobile
    $(".update-mobile-form", @phoneGroup).validator
      isErrorOnParent: true
    $(".update-mobile-form", @phoneGroup).on "submit", @updateMobile

  # 移除更新手机的面板
  removeUpdateMobile: (evt)=>
    menu = $(evt.currentTarget).closest(".update-mobile")
    menu.slideUp "fast", =>
      menu.remove()
      @disableSubmitOrNot()

  #修改手机号时获取手机验证码
  getCode: ->
    input = $(@).closest(".update-mobile-form").find("input[name=mobile]")
    $(@).attr "disabled", true
    input.attr "readonly", true
    $.ajax
      url: "/api/user/change-mobile/send-sms?mobile=#{$("#mobile-phone").val()}&checkType=2&captcha=#{$("#verify-code").val()}"
      type: "POST"
      success: (data)=>
        modalTip("success", "#{i18n.ct('confirmCaptcha', 'user')}", "#{i18n.ct('clickToReacquire', 'user')}").show()
        setIntervalId($(@))
      error: (data)=>
        that.refreshVerifyCode()
        modalTip("error", "#{i18n.ct('error', 'user')}", data.responseJSON.message).show =>
          $(@).removeAttr "disabled"
          input.removeAttr "readonly"
  
  # 检查邮箱唯一性
  emailValidor: (evt) =>
    $el = $(evt.currentTarget)
    @emailSingle = true
    $el.siblings('.note-error').html '<i>&times;</i> 请输入正确的邮箱格式'
    if !$.trim($el.val())
      $el.parent('div').removeClass("success").addClass("required error empty")
    else if /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/.test $el.val()
      $.ajax
        url: "/api/user/email-available?email=#{$el.val()}"
        type: "GET"
        success: (data) =>
          if !data.isAvailable
            $el.siblings('.note-error').html '<i>&times;</i> 该邮箱已经注册过'
            $el.parent('div').removeClass('success').addClass('required error')
            @disableSubmitOrNot()
          else
            $el.parent('div').addClass('success')
            @disableSubmitOrNot()
    @disableSubmitOrNot()

  #发送验证码设置倒计时
  setIntervalId = ($this)->
    intervalId = setInterval =>
      delay = parseInt($this.data("delay"))
      if delay == 1 or delay == NaN
        $this.text("#{i18n.ct('reacquireCaptcha', 'user')}").removeAttr("disabled")
        $this.closest(".update-mobile-form").find("input[name=mobile]").removeAttr "readonly"
        $this.data("delay", 60)
        clearInterval intervalId
        return
      $this.data("delay", delay - 1)
      $this.text("#{delay - 1}#{i18n.ct('secondsAfter', 'user')}")
    , 1000

  #编辑头像
  editAvatar: (evt)->
    new Modal
      toggle: "image-selector"
    .show (image_url)->
      $("#user-profile-form #user-avatar").attr "src", image_url
      $("#user-profile-form input[name='avatar']").val image_url
      $("img.avatar").removeClass("disappear")

  #验证手机格式
  mobileValidator: (event) =>
    pattern = /^1[3-9]\d{9}$/
    mobile = $(event.currentTarget).val()
    $(event.currentTarget).siblings(".required").remove()
    if pattern.test mobile
      $(@getCodeButton).data "disab", "true"
      @verifyCode()
    else
      $(@getCodeButton).data "disab", ""
      @verifyCode()

  #提交修改手机
  updateMobile: (evt)=>
    mobile = $("#mobile-phone").val()
    $.ajax
      url: "/api/user/change-mobile"
      type: "POST"
      data: $(evt.currentTarget).serialize()
      success: (data)=>
        $(".update-mobile", @phoneGroup).remove()
        @disableSubmitOrNot()
        new Modal
          "icon": "success"
          "title": "#{i18n.ct('updateSuccessfully', 'user')}"
          "content": "#{i18n.ct('cellphoneUpdateSuccessfully', 'user')}"
        .show()
        $("#inputMobile").val(mobile)
      error: (data)=>
        $("#verification-code").val("")
        $("#password").val("")
        modalTip("error", "#{i18n.ct('error', 'user')}", data.responseJSON.message).show()

  #组织个人信息
  organizeProfile: (_form)->
    profile = $(_form).serializeObject()
    delete profile.birth if !profile.birth
    profile.province = $("[name=provinceId] option:selected").text()
    profile.city = $("[name=cityId] option:selected").text()
    profile.region = $("[name=regionId] option:selected").text()
    profile

  disableSubmitOrNot: =>
    if $(".required").length + $(".update-mobile-form").length > 0
      @submit.attr "disabled", "disabled"
      false
    else
      @submit.removeAttr "disabled"
      true

  #修改个人信息
  updateUserProfile: (evt)->
    evt.preventDefault()
    profile = Profile::organizeProfile(@)
    $.ajax
      url: "/api/user/my-profile"
      type: "PUT"
      data: JSON.stringify(profile)
      contentType: "application/json"
      success: (data)->
        window.location.reload()
      error: (xhr)->
        if xhr.status is 401
          Login.showLoginModal()
        else
          modalTip("error", "#{i18n.ct('updateError', 'user')}", xhr.responseJSON.message).show()

module.exports = Profile

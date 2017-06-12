###
  登录框组件
  author by terminus.io (jsann)
###
Language = {}
Modal = require("pokeball").Modal
loginModalTemplate = Handlebars.templates["common/login/frontend_templates/login_modal"]

class Login

  constructor: ($)->
    @loginType = $("#login-type")
    @loginName = $("#login-name")
    @loginPassword = $("#login-password")
    @userName = $("#loginId")
    @subName = $("#subname")
    @password = $("#password")
    @submitBtn = $("[type=submit]")
    @loginForm = $(".user-login-form")
    @registerTip = $(".js-register-tip")
    @normalTip = $(".js-normal-tip")
    @registerWord = $(".js-register-word")
    @normalWord = $(".js-normal-word")
    @keep = $(".keep-group")
    @emailActiveBtn = $(".emailActive")
    @bindEvent()

  bindEvent: ->
    @userName.on "focus", @textChange
    @subName.on "focus", @textChange
    @password.on "focus", @textChange
    @userName.on "blur", @userNameValidator
    @subName.on "blur", @subNameValidator
    @password.on "blur", @passwordValidator
    @loginForm.on "submit", @userLogin
    @emailActiveBtn.on "click", @toActiveEmail
    @initSubmit()
    @getMinHeight()

  initSubmit: ->
    @submitBtn.removeAttr "disabled"

  ###*
   * 设置登陆组件的最小高度为window的高度
   * 否则overlay会铺不满
   * @return {[type]} [description]
  ###
  getMinHeight: ->
    $(".login-screen").css("min-height", $(window).height())

  ###
   * 判断登录类型
   * @return {[type]} [description]
  ###
  validatorLoginName: ->
    val = @userName.val()
    if /^1[3|4|5|7|8][0-9]{9}$/.test val
      @loginType.val(3)
    else if /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test val
      @loginType.val(2)
    else
      @loginType.val(1)

  textChange: (evt)=>
    @errorTips($(evt.currentTarget).parent())
    @errorWall("empty")
    @submitBtn.removeAttr("disabled")
    if $(evt.currentTarget).attr("name") is "loginBy"
      @tipRegister("focus")

  ###
   * 校验用户名
   * @return {Boolean} 是否校验通过
  ###
  userNameValidator: =>
    parent = @userName.parent()
    value = @userName.val()
    if !$.trim(value)
      @errorTips parent, "#{i18n.ct('usernameEmpty', 'common')}"
      @tipRegister("focus")
      return false
    else if /^1[3|4|5|7|8][0-9]{9}$/.test value
      $.ajax
        url: "/api/user/mobile-available?mobile=#{value}"
        type: "GET"
        success: (data) =>
          if data.isAvailable is true && data.value is "ok"
            @tipRegister("login", value)
            @submitBtn.attr("disabled", "disabled")
          else
            @tipRegister("focus")
        error: (data) ->
    true

  tipRegister: (type, value) =>
    if /^1[3|4|5|7|8][0-9]{9}$/.test value
      @registerTip.attr "href", "register"
      @registerWord.text("#{i18n.ct('cellphoneNotRegister', 'common')}")
    else
      @registerTip.attr "href", "register-email"
      @registerWord.text("#{i18n.ct('accountNotRegister', 'common')}")
    switch type
      when "login"
        @registerTip.addClass("hide")
        @registerWord.addClass("hide")
        @normalTip.removeClass("hide")
        @normalWord.removeClass("hide")
      when "focus"
        @registerTip.removeClass("hide")
        @registerWord.removeClass("hide")
        @normalTip.addClass("hide")
        @normalWord.addClass("hide")
  ###
   * 校验密码
   * @return {Boolean} 是否校验通过
  ###
  passwordValidator: =>
    parent = @password.parent()
    val = @password.val()
    if !$.trim(val)
      @errorTips parent, "#{i18n.ct('passwordEmpty', 'common')}"
      return false
    # else if !/^[^\s]{6,16}$/.test val
    #   @errorTips parent, "#{i18n.ct('passwordLength', 'common')}"
    #   return false
    true

  ###
   * 提交登录
   * @param  {OBJECT} event JQUERY EVENT
   * @return {[type]}       [description]
  ###
  userLogin: (event) =>
    event.preventDefault()
    data = @loginForm.serializeObject()
    @submitBtn.attr("disabled", "disabled")
    if !@userNameValidator() || !@passwordValidator()
      return false
    @validatorLoginName()
    if data.loginBy.indexOf(":") isnt -1
      url = "/api/seller/login"
      data.username = data.loginBy
    else
      url = "/api/user/login"
      data = @loginForm.serialize()
    $.ajax
      url: url
      type: "POST"
      data: data
      dataType: "json"
      success: (data) =>
        if data.notActive
          @keep.find(".keep").addClass("hide")
          @keep.find(".email-active").removeClass("hide")
        else if data.redirect
          window.location.href = data.redirect
        else
          @errorWall "#{i18n.ct('emailNotActivated', 'common')}<a class='js-send-email' href='javascript:;'>#{i18n.ct('activateNow', 'common')}</a>"
      error: (data) =>
        if /^用户不存在$/.test data.responseJSON?.message
          @tipRegister("login", @userName.val())
        else if /^用户/.test data.responseJSON?.message
          @errorTips @loginName, data.responseJSON?.message, =>
            @submitBtn.removeAttr "disabled"
        else
          @errorTips @loginPassword, data.responseJSON?.message, =>
            @submitBtn.removeAttr "disabled"

  ###
   * 错误提示
   * @param  {DOM or jQuery} parent  添加错误提示的目标
   * @param  {String} message 消息
   * @param  {Function} callback 回调函数
   * @return {[type]}         [description]
  ###
  errorTips: (parent, message, callback) =>
    # clearTimeout @errotTipsTimeout
    parent = $(parent)
    # if arguments.length
    if !message
      parent.find("input").animate {"padding": "7px 10px 5px 60px"}, 300
      parent.removeClass("error").find(".error-tips").animate {bottom: 25, opacity: 0}, 300, ->
        $(@).remove()
    else
      parent.addClass("error")
      error = $("<span class='error-tips' title='#{message}'>#{message}</span>").appendTo(parent)
      parent.find("input").animate {"padding": "4px 10px 20px 60px"}, 300
      error.animate {bottom: 3, opacity: 1}, 300
      @errotTipsTimeout = setTimeout =>
        @errorTips(parent)
        callback && callback()
      , 2000

  ###
   * 错误提示
   * @param  {String} message 消息
   * @param  {Boolean} often   默认true，不自动消失
   * @return {[type]}         [description]
  ###
  errorWall: (message, often) ->
    wall = $(".error-wall")
    ls = wall.find("ul")
    if message is "empty"
      clearTimeout @errorWallTimeout
      wall.animate {height: 0}, 300, ->
        ls.css({"margin-top": 0}).html("")
      return false
    if !message || !often?
      often = true
    if message
      msgWrap = $("<li>#{message}</li>").appendTo ls
    if !wall.height()
      wall.animate {height: "16px"}, 300
    else
      li = ls.find("li:not(.removed)")
      margin = (li.length - 1) * li.height()
      ls.stop().animate {"margin-top": - margin}, 300, ->
        ls.find(".removed").remove()
        if li.length > 5
          ls.css({"margin-top": 0}).html ls.find("li:last")
    if !often
      @errorWallTimeout = setTimeout ->
        msgWrap.addClass("removed")
        @errorWall()
      , 2000


  tipRegister: (type) =>
    if type is "login"
      @keep.find(".keep").addClass("hide")
      @keep.find(".keeped").removeClass("hide")
    else if type is "focus"
      @keep.find(".keeped").addClass("hide")
      @keep.find(".keep").removeClass("hide")

  toActiveEmail: =>
    $.ajax
      url: "/api/user/email_active"
      type: "GET"
      success: (data) =>
        @recoverLoginStyle()
        new Modal
          "icon": "success"
          "title": "发送成功!"
          "content": "激活链接已送达您的邮箱，请前往查看！"
        .show()
      error: (data) =>
        @recoverLoginStyle()
        new Modal
          "icon": "error"
          "title": "出错啦！"
          "content": "未知故障！"
        .show()

  recoverLoginStyle: =>
    @keep.find(".email-active").addClass("hide")
    @keep.find(".keep").removeClass("hide")
    @submitBtn.removeAttr "disabled"

Login.showLoginModal = () =>
  $modal = $(loginModalTemplate({target: window.location.href}))
  new Modal($modal).show()
  new Login((selector) => $modal.find(selector))

module.exports = Login

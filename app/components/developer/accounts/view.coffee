Modal = require("pokeball").Modal
accountTemplate = Handlebars.templates["developer/accounts/frontend_templates/account"]
joinAccountTemplate = Handlebars.templates["developer/accounts/frontend_templates/join_account"]

class AccountsManage
  constructor: ($)->
    @accountCreate = $(".js-create-account")
    @accountEdit = $(".js-edit-account")
    @accountJoin = $(".js-join-account")
    @modal = {}
    @roleData = {}
    @mobileSingle = true
    @emailSingle = true
    @bindEvents()

  bindEvents: ->
    @accountCreate.on "click", @editAccount   # 创建该公司下的新用户
    @accountEdit.on "click", @editAccount   # 该公司下的用户进行编辑
    @accountJoin.on "click", @joinAccount    # 将用户加入该公司
    $(document).on "confirm:change-unbind", @accountUnbind
    $(document).on "confirm:change-bind", @accountBind
    $(document).on "confirm:rejoin", @accountReJoin
    @getAllRole()

  getAllRole: =>
    $.ajax
      url: "/api/company/role/all"
      type: "GET"
      success: (data) =>
        @roleData = data

  editAccount: (evt, result) =>
    data = if evt then $(evt.currentTarget).data("info") else result
    new Modal(accountTemplate({ data, auth: @roleData })).show()
    $('select').selectric("refresh")
    $(".account-form").validator isErrorOnParent: true
    $(".account-form").on "submit", @submitAccount
    $('#mobile').on "blur", @checkMobile
    $('#email').on "blur", @checkEmail
    $('#password').on "keyup", @passwordKeyUp

  joinAccount: (evt) =>
    @modal = new Modal(joinAccountTemplate({ auth: @roleData }))
    @modal.show()
    $('select').selectric("refresh")
    $(".js-join-account-form").validator isErrorOnParent: true
    $(".js-join-account-form").on "submit", @checkUserName

  # 检查用户是否存在
  checkUserName: (evt) =>
    evt.preventDefault()
    data = $(evt.target).serializeObject()
    $form = $(".js-join-account-form")
    $submit = $(".js-join-account-submit")
    $submit.attr "disabled", true
    $(".js-join-user").on "focus", @hideNote
    $.ajax
      url: "/api/user/sub/bind/get?username=#{data.username}"
      contentType: "application/json"
      success: (userData) =>
        if userData.hasUser
          $(".js-have-exist").removeClass("hide")
          $submit.text("邀请用户").attr "disabled", false
          $(".js-user-id").attr "value", userData.user.id
          $form.off().on "submit", (evt) => @submitJoinAccount(evt)
        else
          @modal.close()
          @editAccount()
      complete: () ->
        $submit.removeAttr("disabled")

  # 邀请用户进入公司
  submitJoinAccount: (evt) ->
    evt.preventDefault()
    data = $(evt.target).serializeObject()
    $.ajax
      url: "/api/company/invites"
      contentType: "application/json"
      data: data
      success: () ->
        window.location.reload()

  # 重新邀请用户
  accountReJoin: (evt, id) ->
    roleId = $(".js-edit-account").data("info").roleId
    data = { "userId": id, roleId }
    $.ajax
      url: "/api/company/invites"
      contentType: "application/json"
      data: data
      success: () ->
        window.location.reload()

  # 重新写用户名时 重新检测用户
  hideNote: () =>
    $(".js-have-exist").addClass("hide")
    $form = $(".js-join-account-form")
    $form.off().validator isErrorOnParent: true
    $form.on "submit", @checkUserName

  # 添加/编辑用户 提交
  submitAccount: (evt) =>
    evt.preventDefault()
    data = $(evt.currentTarget).serializeObject()
    if !data.userId && (!@mobileSingle || !@emailSingle)
      if !@mobileSingle and !@emailSingle
        @showError($("#mobile"))
        @showError($("#email"))
      else if !@emailSingle
        @showError($("#email"))
      else if !@mobileSingle
        @showError($("#mobile"))
      return false
    urlPart = if data.userId then "/#{data.userId}" else ""
    type = if data.userId then "PUT" else "POST"
    data.roleName = $('.js-select-role option:selected').text()
    $.ajax
      url: "/api/company/sub#{urlPart}"
      type: type
      data: JSON.stringify(data)
      contentType: "application/json"
      success: () ->
        window.location.reload()

  # 解除公司
  accountUnbind: (evt, id) ->
    $("body").spin("small")
    $.ajax
      url: "/api/company/sub/#{id}"
      type: "DELETE"
      success: ->
        location.reload()

  # 绑定公司
  accountBind: (evt, id) ->
    $("body").spin("small")
    $.ajax
      url: "/api/company/sub/backup/#{id}"
      type: "PUT"
      success: ->
        location.reload()

  # 检查手机号码唯一性
  checkMobile: (evt) =>
    $el = $(evt.currentTarget)
    @mobileSingle = true
    $el.siblings('.note-error').html '<i class="icon-hsh icon-hsh-tanhao"></i> 请输入11位中国大陆手机号'
    if /^1[3|4|5|7|8]\d{9}$/.test $el.val()
      $.ajax
        url: "/api/user/mobile-available?mobile=#{$el.val()}"
        type: "GET"
        success: (data) =>
          if data.isAvailable is true && data.value is "ok"
            $el.siblings('.note-success').html '<i class="icon-hsh icon-hsh-gou1"></i> 该手机号未注册'
          else
            @mobileSingle = false
            $el.siblings('.note-error').html '<i class="icon-hsh icon-hsh-tanhao"></i> 该手机号已注册'
            @showError($el)
  
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
            @showError($el)

  # 校验密码强度
  passwordKeyUp: (evt) =>
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

  # 显示错误
  showError: ($el) ->
    $el.parent('div').removeClass('success').addClass('error')

module.exports = AccountsManage

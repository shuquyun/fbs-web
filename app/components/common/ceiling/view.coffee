###
  吊顶组件
  author by terminus.io (zl)
###

class Ceiling

  constructor: ($) ->
    @$userName = $("#js-user-name")
    @$userAction = $("#js-user-action")
    @$userCartCount = $("#js-cart-count")
    @$sellerCenterLink = $(".js-seller-center-link")
    @$time = $("#js-time")
    @$favorite = $("#js-add-to-favorite")
    @$smallCart = $("#header-cart")
    @$logout = $("#js-ceiling-user-logout")
    @$login = $("#js-login-in")
    @$register = $("#js-user-register")
    @bindEvent()

  bindEvent: ->
    @showTime()
    @getCartCount()
    @$favorite.on("click", @addToFavorite)
    @$logout.on("click", @userLogout)
    @$login.on("click", @userLogin)
    @$register.on("click", @userRegister)

  # 根据时间判断时段
  showTime: =>
    now = new Date()
    hour = now.getHours()
    time = switch
      when hour < 11
        "#{i18n.ct('morning', 'common')}！"
      when 11 <= hour and hour < 13
        "#{i18n.ct('noon', 'common')}！"
      when 13 <= hour and hour < 18
        "#{i18n.ct('afternoon', 'common')}！"
      else
        "#{i18n.ct('evening', 'common')}！"
    @$time.append time

  userRegister: ->
    window.location.href = "/register"

  # 用户登出
  userLogout: (evt) ->
    $.ajax
      type: "POST"
      url: "/api/user/logout"
      success: ->
        window.location.href = "/"

  # 跳转到用户登录页
  userLogin: (evt) ->
    target = top.location.href
    window.location.href = "/login?target=#{target}"

  # 获取购物车数量
  getCartCount: () =>
    if (@$userCartCount.length > 0)
      $.ajax
        url: "/api/carts/count",
        type: "GET",
        success: (data) =>
          if data
            this.$userCartCount.text(data)
        error: (data) =>

  # 添加收藏
  addToFavorite: ->
    window = top.window
    document = top.document
    if window.sidebar and window.sidebar.addPanel # Mozilla Firefox Bookmark
      window.sidebar.addPanel document.title, window.location.href, ""
    else if window.external and ("AddFavorite" of window.external) # IE Favorite
      window.external.AddFavorite location.href, document.title
    else if window.opera and window.print # Opera Hotlist
      @title = document.title
    else # webkit - safari/chrome
      alert "#{i18n.ct('notSupport', 'common')} " + ((if navigator.userAgent.toLowerCase().indexOf("mac") isnt -1 then "Command/Cmd" else "CTRL")) + " + D #{i18n.ct('toAdd', 'common')}"

module.exports = Ceiling

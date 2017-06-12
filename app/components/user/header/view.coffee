class Header
  constructor: ($) ->
    @$navBtn = $('.nav-toggle-btn')
    @$navUl = @$navBtn.next('ul')
    @$logout = $("#js-user-logout")
    @bindEvent()

  bindEvent: =>
    @$navBtn.on('click', @navClick)
    @$navUl.on("click", (event) => event.stopPropagation())  # 菜单内部点击事件不透传
    $("html").on("click", @closeMenu)
    @$logout.on("click", @logoutEvent)

  navClick: (event)=>
    event.preventDefault()
    # 禁止透传
    event.stopPropagation()
    $self = $(event.currentTarget)

    # 按钮高亮
    $(self).toggleClass('active')

    # 展开菜单
    $self.next('ul').slideToggle(200)
    $self.next('ul').find('.float-menu').slideToggle(200)

    # 其他按钮不高亮
    $otherMenus = $('.nav-toggle-btn').not($self).removeClass('active').next('ul')

    # 其他已经显示的菜单收起
    $otherMenus.each (i) =>
      if $(i).is(":visible")
        $(i).slideToggle(200)
        $(i).find('.float-menu').slideToggle(200)

  # 点击外部, 关闭所有菜单
  closeMenu: =>
    $menu = $('.nav-toggle-btn.active').removeClass('active').next('ul')
    if $menu.is(":visible")
      $menu.slideToggle(200)
      $menu.find('.float-menu').slideToggle(200)

  # 用户登出
  logoutEvent: =>
    $.ajax
      type: "POST"
      url: "/api/user/logout"
      success: =>
        window.location.href = '/'

module.exports = Header

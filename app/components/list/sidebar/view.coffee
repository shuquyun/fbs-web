selectTemplate = Handlebars.templates['list/sidebar/all_templates/select']
sidebarItemTemplate = Handlebars.partials['list/sidebar/all_templates/_sidebar_item']
Modal = require('pokeball').Modal
RULES =
  'division':
    name: '分部分项'
    fn: (path, querys) ->
      "[data-tag-id=#{querys.tag}]"

  'measurement':
    name: '措施费'
    fn: (path, querys) ->
      "[data-tag-id=#{querys.tag}]"

  'other':
    name: ''
    fn: (path, querys) ->
      "[data-tag-id=#{querys.billSheetId}]"

class ListSidebar
  constructor: ->
    @wrapEl = $ '.main-left'
    $('.dropdown').dropdown()
    @bindEvt()
    @addActive()

  bindEvt: ->
    ## 拉开侧边栏
    @wrapEl.on 'click', '.list-pull-control', (e)=>
      @wrapEl.toggleClass 'pull'
    ## 添加页签
    @wrapEl.on 'click', '.icon-jiahao1', (e)=>
      @beforeAddSheet e
    ## 添加
    @wrapEl.on 'click', '.sidebar-add-item button', (e)=>
      @addSheet e
    ## 重命名
    @wrapEl.on 'click', '.icon-bianji', (e)->
      $ e.target
        .parents 'li'
        .toggleClass '_edit'
    ## 重命名
    @wrapEl.on 'click', '.edit-item-btn', (e)->
      liEl = $(e.target).parents 'li'
      input = liEl.find 'input'
      liEl.children 'a'
        .text input.val()
      liEl.toggleClass '_edit'
    ## 删除
    @wrapEl.on 'click', '.icon-trash', (e)=>
      @deleteSheet e

  addActive: ->
    path = window.location.pathname
    querys = @_extractQuery()
    for name, value of RULES
      @addClass value.fn(path, querys) if path.indexOf(name) isnt -1

  addClass: (flag) ->
    console.log flag
    $ flag
    .addClass 'active'

  beforeAddSheet: (e) ->
    $el = $ e.currentTarget

    $.ajax
      url: "/api/bill-sheets/#{$.query.get('billId')}"
      data:
        type: $el.data 'type'
        status: '-1'
      success: (result) =>
        if result.length isnt 0
          @sheets = result
          $select = $el
                      .parents '.js-list-item'
                      .find '.js-sidebar-add'

          $select.prepend selectTemplate { data: result }
          $select.toggle()
          $select
            .find 'select'
            .selectric()
        else
          new Modal
            title: '无可添加页签'
            icon: 'error'
          .show()


  addSheet: (e) ->
    $el = $ e.currentTarget
            .siblings '.selectric-wrapper'

    curItem = null

    for item in @sheets
      curItem = item if item.id is parseInt $el.find('select').val()

    query =
      id: curItem.id
      type: curItem.type
      status: 1

    $.ajax
      url: "/api/bill-sheets"
      type: 'PUT'
      contentType: 'application/json'
      data: JSON.stringify query
      success: (result) ->
        if result is true
          curItem.bidId = $.query.get('bidId')
          $ e.currentTarget
            .parents '.js-list-item'
            .find 'ul'
            .append sidebarItemTemplate curItem

          $el.parent().toggle()
          $el.remove()

  deleteSheet: (e) ->
    $el = $ e.currentTarget
            .parents 'li'

    query =
      id: $el.data 'tag-id'
      type: $el.data 'type'
      status: -1

    $.ajax
      url: "/api/bill-sheets"
      type: 'PUT'
      contentType: 'application/json'
      data: JSON.stringify query
      success: (result) ->
        if result
          if $el.hasClass('active')
            $el.remove()
            href = $('.list-sidebar li a').eq(0).attr 'href'
            window.location.href = href
          else
            $el.remove()


  _extractQuery: ->
    query = window.location.search.split('?')[1];
    queryObj = {};

    query
      .split '&'
      .map (q) =>
        arr = q.split('=');
        queryObj[arr[0]] = arr[1];

    queryObj

module.exports = ListSidebar

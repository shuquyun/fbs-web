###
  站点管理组件
  author by terminus.io (zl)
###
Tip = require "common/tip_and_alert/view"
Modal = require("pokeball").Modal
Pagination = require("pokeball").Pagination

class SystemSiteManage

  siteTemplate = Handlebars.templates["system/site_manage/frontend_templates/site"]
  payTypeTemplate = Handlebars.templates["system/site_manage/frontend_templates/pay_type"]

  constructor: ->
    @$jsNewSite = $(".js-sites-new")
    @$jsEditSite = $(".js-sites-config-edit")
    @$isOuterCheckbox = $("input[name=isOuter]")
    @jsPaySetting = $(".js-pay-setting")
    @paytypeForm = ".paytype-form"
    @bindEvent()

  bindEvent: ->
    layouts = @$el.find("table").data("layouts")
    @$jsNewSite.on "click", ->
      siteModal = new Modal siteTemplate({layouts})
      siteModal.show()
      $(".sites-form").validator({
        isErrorOnParent: true
      })

    @$jsEditSite.on "click", ->
      siteModal = new Modal siteTemplate({layouts, site: $(@).closest("tr").data("site")})
      siteModal.show()
      $(".sites-form").validator({
        isErrorOnParent: true
      })

    $(document).on "submit", ".sites-form", @siteFormSubmit
    $(document).on "confirm:delete-site", @deleteSite
    $(document).on "confirm:release-site", @releaseSite
    @jsPaySetting.on "click", @paySetting
    $(document).on "submit", @paytypeForm, @paytypeSubmit
    @importItems()

  ###*
   * 批量导入
   * @return {[type]} [description]
  ###
  importItems: =>
    el = $(".js-import")
    el.fileupload
      url: "/api/design-content/import-site"
      dataType: "html"
      start: =>
        el.spin("medium")
      done: (event, data) =>
        location.reload()
      fail: (evt, data) ->
        jqXHR = data.jqXHR
        content = if jqXHR.status is 413
          "上传的文件超过规定大小"
        else
          jqXHR.responseJSON.message
        new Modal
          icon: "error"
          title: "您的当前状态:"
          content: content
        .show()
      always: =>
        el.spin(false)
      error: ->
        el.spin(false)

  paySetting: ->
    site = $(@).data()
    $.ajax
      url: "/api/owner/current_pay_channel"
      type: "GET"
      data: {id: site.id, type: 1}
      success: (data) ->
        new Modal(payTypeTemplate({data: data, site: site})).show()

  paytypeSubmit: (event) ->
    event.preventDefault()
    if !$(@).find("input:checked").length
      new Modal
        icon: "info"
        title: "#{Language.tips}"
        content: "#{Language.oneAtLeast}"
      .show()
      return false
    site = $(@).data("site")
    data =
      id: $(@).data("id")
      ownerId: site.id
      ownerName: site.userName
      type: 1
      channel: []
    $(@).find("input:checked").each (i, el) ->
      data.channel.push $(el).val()
    data.channel = data.channel.join ","
    type = if data.id then "PUT" else "POST"
    $.ajax
      type: type
      url: "/api/owner/pay_channel"
      contentType: "application/json"
      data: JSON.stringify data
      success: (data) ->
        window.location.reload()

  #提交站点信息
  siteFormSubmit: (evt)->
    evt.preventDefault()
    site = $(@).serializeObject()
    layoutInfos = site.layout.split("@")
    site.app = layoutInfos[1]
    site.layout = layoutInfos[0]
    if site.id
      $.ajax
        url: "/api/design/sites/#{site.id}"
        type: "PUT"
        contentType: "application/json;charset=utf-8"
        data: JSON.stringify(site)
        success: (data)->
          window.location.reload()
    else
      $.ajax
        url: "/api/design/sites"
        type: "POST"
        contentType: "application/json;charset=utf-8"
        data: JSON.stringify(site)
        success: (data)->
          window.location.reload()

  #删除站点
  deleteSite: (evt, data)->
    $(".sites").spin("medium")
    $.ajax
      url: "/api/design/sites/#{data}"
      type: "DELETE"
      success: (data)->
        window.location.reload()
      complete: ->
        $(".sites").spin(false)

  #发布站点
  releaseSite: (evt, data)->
    site = $(".site[data-id=#{data}]").data("site")
    siteId = data
    designTemplateId = site.designInstanceId
    $.ajax
      url: "/api/design/sites/#{siteId}/release"
      type: "POST"
      success: =>
        new Tip({parent: $("body"), type: "success", "title": "#{Language.publishSuccessfully}", message: "#{Language.templateTakingEffect}"}).alert()
        left = $(window).width() / 2 - $(".alert").width() / 2
        top = $(window).height() / 2 - $(".alert").height() / 2
        $(".alert").css("left", left).css("top", top)

module.exports = SystemSiteManage

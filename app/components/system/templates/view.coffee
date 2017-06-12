###
  模版管理组件
  author by terminus.io (zl)
###
Tip = require "common/tip_and_alert/view"
Modal = require("pokeball").Modal
templateTemplate = Handlebars.templates["system/templates/frontend_templates/template"]
templateOptionTemplate = Handlebars.templates["system/templates/frontend_templates/template_option"]
copyTemplateTemplate = Handlebars.templates["system/templates/frontend_templates/copy_template"]

Tip = require "common/tip_and_alert/view"

class Templates

  constructor: ->
    @$jsTemplateNew = $(".js-templates-new")
    @jsTemplateForm = ".template-form"
    @$jsTemplatesConfigEdit = $(".js-edit-template")
    @jsTemplatesCopy = $(".js-templates-copy")
    @copyTemplateForm = ".copy-template-form"
    @bindEvent()

  bindEvent: ->
    @$jsTemplateNew.on "click", @templateNew
    @$jsTemplatesConfigEdit.on "click", @templatesEdit
    @jsTemplatesCopy.on "click", @templatesCopy
    $(document).on "confirm:delete", @deleteTemplate
    $(document).on "confirm:release", @releaseTemplate
    $(document).on "confirm:set-default", @setDefault
    $(document).on "submit", @jsTemplateForm, @templateFormSubmit
    $(document).on "change", "select[name=app]", @changeTemplateSrc
    $(document).on "submit", @copyTemplateForm, @copyTemplateSubmit
    @importItems()

  setDefault: (event, id) =>
    data = id.split("@")
    $.ajax
      url: "/api/design/templates/#{data[1]}/default"
      type: "PUT"
      data: {app: data[0], key: data[1]}
      success: =>
        location.reload()

  ###*
   * 批量导入
   * @return {[type]} [description]
  ###
  importItems: =>
    el = $(".js-import")
    el.fileupload
      url: "/api/design-content/import-shop-template"
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

  templatesCopy: =>
    new Modal(copyTemplateTemplate()).show()
    $(@jsTemplatesCopy).validator()
    $("select[name=app]").trigger("change")

  changeTemplateSrc: (event) =>
    templates = []
    $("table[type=#{$(event.currentTarget).val()}]").find("tbody tr").each (i, el) =>
      templates.push
        name: $(el).find("td:first").text()
        key: $(el).data("template").key
    $("select[name=srcKey], select[name=destKey]").html(templateOptionTemplate({data: templates}))

  copyTemplateSubmit: (event) =>
    event.preventDefault()
    data = $(event.currentTarget).serializeObject()
    $.ajax
      url: "/api/design/templates/#{data.app}/move"
      type: "POST"
      data: data
      success: (data) =>
        window.location.reload()

  #新建模版
  templateNew: ->
    $(@).spin()
    $.ajax
      url: "/api/design/templates/getShopLayouts"
      type: "GET"
      success: (data)->
        templateModal = new Modal templateTemplate({apps: data})
        templateModal.show()
      complete: =>
        $(@).spin(false)

  #修改模版名称
  templatesEdit: ->
    $(@).spin()
    $.ajax
      url: "/api/design/templates/getShopLayouts"
      type: "GET"
      success: (data)=>
        templateModal = new Modal templateTemplate({apps: data, data: $(@).closest("tr").data("template")})
        templateModal.show()
      complete: =>
        $(@).spin(false)

  #模版信息提交
  templateFormSubmit: (evt)->
    evt.preventDefault()
    data = $(".template-form").serializeObject()
    if $("input[name=key]").length is 1
      type = "PUT"
      url = "/api/design/templates"
    else
      type = "POST"
      url = "/api/design/templates"
    $.ajax
      url: url
      type: type
      contentType: "application/json"
      data: JSON.stringify(data)
      success: ->
        window.location.reload()

  #发布模版
  releaseTemplate: (evt, data)->
    data = data.split("@")
    $.ajax
      url: "/api/design/templates/#{data[1]}/release?app=#{data[0]}"
      type: "POST"
      success: (d)->
        new Tip({parent: $("body"), type: "success", "title": "#{Language.publishSuccessfully}", message: "#{Language.templateTakingEffect}"}).alert()
        left = $(window).width() / 2 - $(".alert").width() / 2
        top = $(window).height() / 2 - $(".alert").height() / 2
        $(".alert").css("left", left).css("top", top)
        $(".template-#{data} button").remove()
        $("#template-#{data[0]}-#{data[2]} .need-delete-button").remove()

  #删除模版
  deleteTemplate: (evt, data)->
    data = data.split("@")
    $.ajax
      url: "/api/design/templates/#{data[1]}?app=#{data[0]}"
      type: "DELETE"
      success: (data)->
        window.location.reload()

module.exports = Templates

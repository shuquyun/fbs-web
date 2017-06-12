Modal = require("pokeball").Modal
FileUpload = require("utils/module").plugins.upload
tableModalTemplate = Handlebars.templates["user/register_company/frontend_templates/add_table_modal"]

class CompanyInfoProduct
  constructor: ($)->
    @$form = $('.js-supplier-form-submit')
    @tableModal = ''
    @bindEvent()

  bindEvent: =>
    $('.js-add-edit-item').on "click", @addEdit
    $(document).on "confirm:delete", @deleteTr
    $('.js-img-show').enlargePicture()

  # table表单 填写
  addEdit: (evt) =>
    type = $(evt.target).data('type')
    data = $(evt.target).data('data')
    images = if data and data.images then data.images else ['', '', '']
    @tableModal = new Modal(tableModalTemplate({ data, type, images }))
    @tableModal.show()
    $('.set-new-tr-form').off().validator({ isErrorOnParent: true })
    $('.set-new-tr-form').on "submit", (event) => @addTr(event)
    $('.js-upload-img').on "click", @fileUpload

  addTr: (event) =>
    event.preventDefault()
    products = $(event.target).serializeObject()
    data = $(event.target).data('data')
    images = []
    noImages = []
    _.map products.images, (thisData) ->
      if thisData then images.push(thisData) else ''
    _.map products.images, (thisData) ->
      if !thisData
        noImages.push(thisData)
        images.push(thisData)
    products.images = if noImages.length is 3 then [] else images
    type = if data then 'PUT' else 'POST'
    $.ajax
      url: '/api/company/supplier/product',
      type: type,
      contentType: "application/json"
      data: JSON.stringify products
      success: (data) =>
        @tableModal.close()
        new Modal({
          icon: "info",
          title: "成功！",
          content: "变更产品信息成功"
        }).show () -> window.location.reload()

  # 删除一行产品
  deleteTr: (evt, id) ->
    $.ajax
      url: "/api/company/supplier/product/#{id}",
      type: 'DELETE',
      contentType: "application/json"
      success: (data) ->
        new Modal({
          icon: "info",
          title: "成功！",
          content: "删除产品信息成功"
        }).show () -> window.location.reload()

  # 上传
  fileUpload: (evt) ->
    $self = $(evt.currentTarget)
    new FileUpload($self.find("input[type=file]"), (data) ->
      imageUrl = data.path
      $self.find("img").attr("src", imageUrl).show()
      $self.find("img").css({"width":'70px', "height": '70px'})
      $self.find("input[type=hidden]").attr "value", imageUrl
    , '', 'image')

module.exports = CompanyInfoProduct
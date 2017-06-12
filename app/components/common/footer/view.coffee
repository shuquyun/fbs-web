###
  页底组件
###
Modal = require("pokeball").Modal
footerTemplate = Handlebars.templates["common/footer/frontend_templates/footerTemplate"]
class Footer
  constructor: ->
    @$jsClickModal = $(".click-modal")
    @bindEvent()

  bindEvent: ->
    @$jsClickModal.on "click", @clickModal

  #点击弹出图
  clickModal: ->
    target = $(@).data("target")
    width = $(@).data("width")
    height = $(@).data("height")
    footerModal = new Modal footerTemplate({target: target, height: height, width: width})
    footerModal.show()

module.exports = Footer


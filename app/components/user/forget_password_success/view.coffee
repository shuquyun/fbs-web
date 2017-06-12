class ForgetPasswordSuccess
  constructor: ->
    @bindEvent()
  bindEvent: ->
    $(".js-start-shopping").on "click", ->
      window.location.href = "/login"
module.exports = ForgetPasswordSuccess

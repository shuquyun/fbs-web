class AuthContainer
  constructor: ($)->
    window.userAuth = $("#auth-div").data("auth")
    # $("#auth-div").removeAttr("data-auth")

module.exports = AuthContainer
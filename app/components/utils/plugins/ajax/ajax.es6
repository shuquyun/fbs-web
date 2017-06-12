const Modal = require("pokeball").Modal,
      Login = require("common/login/view")

function ajaxModal (options) {
  options = _.extend({icon: "error", title: "oops!", content: "系统生病了，程序猿GG正在抢救"}, options)
  new Modal(options).show()
}

let needSpin = false

$.ajaxSetup({
  cache: false,
  error: (jqXHR, textStatus, errorThrown) => {
    switch (jqXHR.status) {
      case 401:
        Login.showLoginModal()
      case 404:
        return true
      case 502, 503:
        ajaxModal()
      case 504:
        ajaxModal({content: "啊，网络不是很给力哦~"})
      default:
        ajaxModal({content: jqXHR.responseJSON.message || "系统生病了，程序猿GG正在抢救"})
    }
  },
  beforeSend: (xhr, b) => {
    let type = b.type.toUpperCase()
    if((type == 'POST' || type == "PUT") && b.dataType != "html") {
      $("body").spin('small', {backgroundColor: "#ffffff", opacity: 0.4})
      needSpin = true
    }
  },
  complete: (xhr, status) => {
    if(needSpin) {
      $("body").spin(false)
    }
  }

})

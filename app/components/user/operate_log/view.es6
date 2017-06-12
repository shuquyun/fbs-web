const CommonDatepicker = require("utils/module").plugins.commonDatepicker

class LoginLog {
  constructor() {
    this.bindEvent()
  }

  bindEvent() {
    this.init()
  }

  init() {
    $(".datepicker").datepicker({ maxDate: new Date() })
    new CommonDatepicker("#form-search")
  }
}

module.exports = LoginLog
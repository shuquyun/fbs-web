const ajax = require("utils/plugins/ajax/ajax"),
      handlebars = require("utils/core/handlebars/handlebars"),
      number = require("utils/plugins/numbers"),
      array = require("utils/plugins/array"),
      commonDatepicker = require("utils/plugins/common_datepicker"),
      input_amount = require("utils/plugins/input_amount"),
      selectric = require("utils/plugins/selectric"),
      addressUnit = require("utils/plugins/address_unit"),
      cookie = require("utils/plugins/cookie"),
      filter = require("utils/plugins/filter"),
      placeholder = require("utils/plugins/placeholder"),
      upload = require("utils/plugins/upload"),
      enlargePicture = require('utils/plugins/enlarge_picture'),
      selectSpecial = require('utils/plugins/company_select_special'),
      cosUpload = require('utils/plugins/cos_upload'),
      table = require("utils/plugins/table"),
      datePickerHour = require('utils/plugins/datepicker_hour')

const utils = {
  core: {
    handlebars
  },
  plugins: {
    ajax,
    array,
    number,
    selectric,
    commonDatepicker,
    addressUnit,
    cookie,
    filter,
    placeholder,
    upload,
    enlargePicture,
    selectSpecial,
    cosUpload,
    table,
    datePickerHour
  }
}

module.exports = utils

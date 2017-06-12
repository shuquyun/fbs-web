const SelectOption = require("common/select_speciality/view")

$.fn.selectSpecial = function(options = {}) {
  _.each($(this), (i) => {
    const index = $(i)
    const type = $(i).data("type")
    const api = $(i).data("api")
    new SelectOption(_.extend(
      options, { index, type, api }))
  })
  return $(this)
}
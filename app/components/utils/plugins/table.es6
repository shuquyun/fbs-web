const TableForm = require("common/table_form/view")

$.fn.tableForm = function(options = {}) {
  _.each($(this), (i) => {
    new TableForm(_.extend(options, {
      container: i || ".js-table-container"
    }))
  })

  return $(this)
}

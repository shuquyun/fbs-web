datepickerHour = require('common/date_select/view')
$.fn.datepickerHour = () ->
  @each ->
    $this = $(this)
    data = $this.data()
    return if data.datepickerHour
    data.datepickerHour = new datepickerHour(this)

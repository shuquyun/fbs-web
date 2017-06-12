const selectHourTemplates = Handlebars.templates['common/date_select/frontend_templates/select_item'],
      inputDateTemplates = Handlebars.templates['common/date_select/frontend_templates/input']
class DateSelect {
  constructor(el) {
    this.$el = $(el)
    this.$el.after(selectHourTemplates({ data: _.range(8, 19) }))
    this.$parentDiv = this.$el.closest('div')
    this.$currentSelect = this.$parentDiv.find('.js-hour-select')
    this.cloneInput()
    this.$inputDate = this.$parentDiv.find('.datepicker-date')
    this.initHour()
    this.bindEvent()
  }

  bindEvent() {
    this.$inputDate.datepicker()
    this.$currentSelect.on('change', (evt) => this.selectHour(evt))
    this.$inputDate.on('change', (evt) => this.selectDate(evt))
  }

  selectHour(evt) {
    const date = this.$inputDate.val()
    const hour = $(evt.currentTarget).val()
    if (date) {
      this.$el.val(moment(date).format('YYYY-MM-DD') + ` ${hour}:00:00`)
    }
  }

  selectDate(evt) {
    const $self = $(evt.currentTarget)
    const date = $self.val()
    const hour = this.$currentSelect.val()
    this.$el.val(moment(date).format('YYYY-MM-DD') + ` ${hour}:00:00`)
  }

  cloneInput() {
    const placeholder = this.$el.prop('placeholder')
    this.$el.hide().after(inputDateTemplates({ placeholder }))
  }

  initHour() {
    const val = this.$el.val()
    this.$currentSelect.selectric()
    if (val) {
      const hour = moment(val).hour()
      this.$inputDate.val(moment(val).format('YYYY-MM-DD'))
      this.$currentSelect.find(`option[value=${hour}]`).prop('selected', true)
      this.$currentSelect.selectric('refresh')
    }
  }
}

module.exports = DateSelect

const dropContentTemplates = Handlebars.templates['common/dropdown_more/frontend_templates/drop_content'],
      dropItemTemplates = Handlebars.templates['common/dropdown_more/frontend_templates/item']
class DropDownMore {
  constructor(e, data) {
    this.$el = $(e)
    this.$el.hide()
    this.renderDropdown(data, this.$el)
    this.$dropdown = this.$el.siblings('.drop-down-more')
    this.initInput()
    this.bindEvent()
  }

  bindEvent() {
    this.$dropdown.on('click', '.caret-content', (evt) => this.toggleDropdown(evt))
    this.$dropdown.on('change', '.js-checkbox-select', (evt) => this.toggleItem(evt))
    this.$dropdown.on('click', '.js-dropdown-item-delete', (evt) => this.deleteItem(evt))
    $(document).on('click', (evt) => this.closeDropdown(evt))
  }

  renderDropdown(data, $el) {
    const placeholder = $el.prop('placeholder')
    const val = $el.val()
    this.$el.after(dropContentTemplates({ data, placeholder }))
    val && this.eachDropItem($el.siblings('.drop-down-more'), val)
  }

  eachDropItem($parent, val) {
    _.each(val.split(','), (i) => {
      $parent.find(`input[type=checkbox][data-key=${i}]`).prop('checked', true)
    })
  }

  initInput() {
    _.each(this.$dropdown.find('.dropdown-menu input[type=checkbox]:checked'), (i) => {
      const key = $(i).data('key')
      const name = $(i).siblings('span').text()
      this.renderItem({ key, name })
    })
    this.assign()
  }

  closeDropdown(evt) {
    if ($(evt.target).closest(".drop-down-more").length === 0 && $(evt.target).closest(".dropdown-item").length === 0) {
      this.$dropdown.find('.dropdown-content').hide()
    }
  }

  toggleDropdown(evt) {
    this.$dropdown.parent('div').removeClass('error empty')
    this.$dropdown.find('.dropdown-content').toggle()
  }

  toggleItem(evt) {
    const $self = $(evt.currentTarget)
    const key = $self.data('key')
    const name = $self.siblings('span').text()
    if ($self.prop('checked')) {
      this.renderItem({ key, name })
    } else {
      this.$dropdown.find(`.dropdown-item[data-key=${key}]`).remove()
      this.$dropdown.find('.dropdown-item').length === 0 && this.$dropdown.find('.placeholder').show()
    }
    this.assign()
  }

  renderItem(data) {
    this.$dropdown.find('.placeholder').hide()
    this.$dropdown.find('.dropdown-selector').append(dropItemTemplates(data))
  }

  deleteItem(evt) {
    const $self = $(evt.currentTarget)
    const key = $self.closest('.dropdown-item').data('key')
    $self.closest('.dropdown-item').remove()
    this.$dropdown.find(`.dropdown-menu input[data-key=${key}]`).prop('checked', false)
    if (this.$dropdown.find('.dropdown-item').length === 0) {
      this.$dropdown.find('.placeholder').show()
    }
    this.assign()
  }

  assign() {
    const data = this.organizeData()
    this.$el.val(data)
  }

  organizeData() {
    return _.map(this.$dropdown.find('.dropdown-menu input[type=checkbox]:checked'), (i) => {
      return $(i).data('key')
    })
  }
}

module.exports = DropDownMore

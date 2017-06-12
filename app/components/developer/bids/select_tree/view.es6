const SelectTree = require("common/select_tree/view")
const itemTemplates = Handlebars.templates['developer/bids/select_tree/frontend_templates/item'],
      containerTemplates = Handlebars.templates['developer/bids/select_tree/frontend_templates/container']
class CommonSelectTree {
  constructor(container, data) {
    this.container = container
    this.$jsSelectId = $(container).find('.js-select-id')
    this.placeholder = this.$jsSelectId.prop('placeholder')
    this.$jsSelectId.hide().after(containerTemplates({ placeholder: this.placeholder }))
    this.$jsInputSelect = $(container).find('.js-select-toggle')
    this.$jsPlaceholder = $(container).find('.js-placeholder-show')
    new SelectTree({
      container: $(container).find('.js-show-container'),
      search: false,
      selectMore: true,
      data: data,
      initTree: this.$jsSelectId.val() ? this.$jsSelectId.val().split(',') : null,
      afterSelect: (e, id, checked) => this.getModels(e, id, checked)
    })
    this.bindEvent()
  }

  bindEvent() {
    this.$jsInputSelect.on('click', (evt) => this.toggleSelect(evt))
    $(document).on('click', (evt) => this.closeSelectMore(evt))
    $(this.container).on('click', '.js-select-delete', (evt) => this.deleteSelctItem(evt))
  }

  closeSelectMore(evt) {
    if (!$(evt.target).closest(this.container).length) {
      $(this.container).find('.js-show-container').addClass('hide')
    }
  }

  toggleSelect(evt) {
    $(evt.currentTarget).next('.js-show-container').toggleClass('hide')
  }

  deleteSelctItem(evt) {
    const $self = $(evt.currentTarget)
    const id = $self.data('id')
    $(this.container).find(`.js-tree-item[data-id=${id}]`).trigger('click')
  }

  getModels(e, id, checked) {
    const $self = $(e.currentTarget)
    const name = $self.data('name')
    const selectIds = this.$jsSelectId.val()
    let ids = selectIds ? selectIds.split(',') : []
    if (checked) {
      this.$jsPlaceholder.hide()
      this.$jsInputSelect.append(itemTemplates({ id, name }))
      ids.push(id.toString())
    } else {
      ids = _.without(ids, id.toString())
      $(this.container).find(`.select-item[data-id=${id}]`).remove()
      if (!ids.length) {
        this.$jsPlaceholder.show()
      }
    }
    if (ids.length) {
      $(e.target).closest(this.container).removeClass('error')
    }
    this.$jsSelectId.val(_.uniq(ids))
  }
}

module.exports = CommonSelectTree

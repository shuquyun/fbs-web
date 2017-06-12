const childTr = Handlebars.partials["common/table_form/frontend_templates/_child_tr"]
const parentTr = Handlebars.partials["common/table_form/frontend_templates/_parent_tr"]
const tableTpl = Handlebars.templates["common/table_form/frontend_templates/table"]

class TableForm {
  constructor(options) {
    this.options = options
    this.$el = $(this.options.container)
    this.data = this.options.data || this.$el.data("tableInfo") || []
    // this.flattenData = this.flatten(this.data)s
    this.dataDom = $(tableTpl({data: this.data}))
    this.$el.data("tableForm", this)
    this.bindEvent()
  }

  bindEvent() {
    // this.renderTable()
    // this.organizeData()
    $(".js-modal-td", this.$el).on("click", (e) => this.modalEvent(e))
    $(".js-combine-column", this.$el).on("click", (e) => this.combineEvent(e))
    $(".js-pack-event", this.$el).on("click", (e) => this.packEvent(e))
  }

  flatten (arr, level = 0){
    const result = []
    const recursion = (arr, level = 0) => {
      arr.level = arr.level || level
      //有就用自己的level，没有就判断是不是别人给它的，别人给的一般代表自己是子树, 然后给的时候 +1
      arr.forEach((item) => {
        item.level = arr.level
        result.push(item)
        item.children && recursion(item.children, arr.level + 1)
      })

      delete arr.level
    }

    recursion(arr)

    return result
  }

  setStatus(id, options) {
    $(`.js-child-node[data-id=${id}]`).data(options)
  }

  getStatus(id) {
    $(`.js-child-node[data-id=${id}]`).data()
  }

  getChildren(id) {
    return $(`.js-child-node[data-id='${id}'] .js-child-node`, this.dataDom)
  }

  renderTable() {
    this.$el.empty().append(tableTpl({data: this.data}))
  }

  modalEvent(e) {
    const $self = $(e.currentTarget)
    const type = $self.data('modal')
    $(document).trigger(`modal-show:${type}`, [e, $self])
  }

  combineEvent(e) {
    const $self = $(e.currentTarget)
    const isCombine = $self.data('combine')
    const $totalTh = $self.closest("th")
    const totalId = $totalTh.data("total")
    const $relativeItem = $(`[data-subtotal=${totalId}]`, this.$table)
    $totalTh.toggleClass("expand")

    isCombine ? $relativeItem.hide() : $relativeItem.show()
  }

  checkEvent(e) {

  }

  packEvent(e) {
    e.preventDefault()
    const $self = $(e.currentTarget)
    const $tr = $self.closest("tr")
    const id = $tr.data("id")
    this.setStatus(id, {expanded: $self.hasClass("expanded")})
    $self.toggleClass("expanded")

    const childrenIds = _.without(_.map(this.getChildren(id), (i) => {
      if (!$(i).data("hide")) {
        return $(i).data("id")
      }

      return undefined
    }), undefined)

    _.each(childrenIds, (i) => $(`tr[data-id=${i}]`).toggleClass("hide"))
  }
}

module.exports = TableForm

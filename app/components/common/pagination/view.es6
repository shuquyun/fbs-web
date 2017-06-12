const Pagination = require('pokeball').Pagination

export default class CommonPagination {
  constructor($) {
    this.$pagiantion = $('.js-pagination')
    this.initPagiantion()
  }

  initPagiantion() {
    const pageSize = $.query.get('pageSize') || 20
    let options = this.$pagiantion.data('options')
    options = _.extend(this.getdefaultOptions(), options)
    new Pagination(this.$pagiantion).total(this.$pagiantion.data('total')).show(pageSize, options)
  }

  getdefaultOptions() {
    return {
      page_text: '',
    }
  }
}

module.exports = CommonPagination

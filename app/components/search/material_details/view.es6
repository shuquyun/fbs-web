class SearchMaterialDetails {
  constructor($) {
    this.$jsItemtr = $('.js-tr-item')
    this.$jsPirceBtn = $('.js-price-btn')
    this.bindEvent()
  }

  bindEvent() {
    this.$jsItemtr.on('click', (evt) => this.toggleTrContent(evt))
    this.$jsPirceBtn.on('click', (evt) => this.togglePriceContent(evt))
  }

  toggleTrContent(evt) {
    const $self = $(evt.currentTarget)
    $self.toggleClass('expand')
    $self.next('tr').toggleClass('hide')
  }

  togglePriceContent(evt) {
    const $self = $(evt.currentTarget)
    const type = $self.data('type')
    $self.addClass('active').siblings('.js-price-btn').removeClass('active')
    if (type === 'platform') {
      $('.js-platform-price').removeClass('hide')
      $('.js-history-price').addClass('hide')
    } else {
      $('.js-platform-price').addClass('hide')
      $('.js-history-price').removeClass('hide')
    }
  }
}

module.exports = SearchMaterialDetails

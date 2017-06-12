const Modal = require('pokeball').Modal
class SearchBidsDetails {
  constructor($) {
    this.$jsSupplierApply = $('.js-supplier-apply')
    this.bindEvent()
  }

  bindEvent() {
    this.$jsSupplierApply.on('click', (evt) => this.applySupplier(evt))
  }

  //供应商报名
  applySupplier(evt) {
    const bidId = $(evt.currentTarget).data('id')
    $.ajax({
      url: `/api/bids/${bidId}/suppliers`,
      method: 'POST',
      success: () => {
        new Modal({ icon: 'success', content: '报名成功' }).show(() => {
          window.location.reload()
        })
      }
    })
  }
}

module.exports = SearchBidsDetails

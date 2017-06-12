const Modal = require('pokeball').Modal

class SupplierBidsConfirm {
  constructor($) {
    this.$jsBidsConfirmPass = $('.js-bids-confirm-pass')
    this.bindEvent()
  }

  bindEvent() {
    this.$jsBidsConfirmPass.on('click', () => this.passConfirmBids())
  }

  passConfirmBids() {
    const bidId = $.query.get('bidId')
    bidId && $.ajax({
      url: `/api/bids/${bidId}/suppliers/confirm/inventories`,
      method: 'PUT',
      success: () => {
        new Modal({ icon: 'success', content: '确认成功' }).show(() => {
          window.location.reload()
        })
      }
    })
  }
}

module.exports = SupplierBidsConfirm

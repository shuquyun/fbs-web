const Modal = require('pokeball').Modal
class SupplierBidsFile {
  constructor($) {
    this.$jsListEdit = $('.js-list-edit')
    this.bindEvent()
  }

  bindEvent() {
    this.$jsListEdit.on('click', (evt) => this.editList(evt))
  }

  editList(evt) {
    const $self = $(evt.currentTarget)
    const billId = $self.data('billId')
    const bidId = $self.data('bidId')
    const connectId = $.query.get('id')
    const newTab = window.open('', '_blank')
    const type = $self.data('type')
    $.ajax({
      url: '/api/bill/copy',
      method: 'POST',
      data: JSON.stringify({ billId, bidId, connectId, type }),
      contentType: 'application/json',
      success: (data) => {
        newTab.location.href = `/list/config?bidId=${bidId}&billId=${data}`
      },
      error: (error) => {
        newTab.close()
        new Modal({icon: "error", title: "oops!", content: error.responseJSON.message }).show()
      }
    })
  }
}

module.exports = SupplierBidsFile

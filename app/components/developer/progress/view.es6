const Modal = require('pokeball').Modal
const bidDiscardTemplates = Handlebars.templates['developer/progress/frontend_templates/bid_discard']

class DeveloperProgress {
  constructor($) {
    this.$jsBidDiscard = $('.js-bid-discard')
    this.bindEvent()
  }

  bindEvent() {
    this.$jsBidDiscard.on('click', (evt) => this.discardBids(evt))
  }

  discardBids(evt) {
    const bidId = $(evt.currentTarget).data('bidId')
    new Modal(bidDiscardTemplates({ bidId })).show()
    this.initForm()
  }

  initForm() {
    $('.js-form-bid-discard').validator({
      isErrorOnParent: true
    })
    $('.js-form-bid-discard').on('submit', (evt) => this.submitDiscardBids(evt))
  }

  submitDiscardBids(evt) {
    evt.preventDefault()
    const bidData = $(evt.currentTarget).serializeObject()
    $.ajax({
      url: `/api/bids/${bidData.bidId}/discard`,
      method: 'PUT',
      data: { discardReason: bidData.discardReason },
      success: () => {
        window.location.reload()
      }
    })
  }
}

module.exports = DeveloperProgress

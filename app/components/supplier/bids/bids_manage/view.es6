const abandonReasonTemplates = Handlebars.templates['supplier/bids/bids_manage/frontend_templates/reason']
const Modal = require('pokeball').Modal
const CommonDatepicker = require("utils/module").plugins.commonDatepicker
class SupplierBidsManage {
  constructor($) {
    this.$jsBidsAbandon = $('.js-bids-abandon')
    this.$jsBidsUndo = $('.js-bids-undo')
    this.$jsBidsInvite = $('.js-bids-invite')
    this.$jsBidsReject =  $('.js-bids-reject')
    this.$jsFormBids = $('.js-form-bids-filter')
    this.bindEvent()
  }

  bindEvent() {
    this.$jsBidsAbandon.on('click', (evt) => this.abandonBids(evt))
    this.$jsBidsUndo.on('click', (evt) => this.undoBids(evt))
    this.$jsBidsInvite.on('click', (evt) => this.toggleInviteBids(evt, true))
    this.$jsBidsReject.on('click', (evt) => this.toggleInviteBids(evt, false))
    $('.datepicker', this.$jsFormBids).datepicker()
    new CommonDatepicker(this.$jsFormBids)
  }

  toggleInviteBids(evt, decision) {
    const id = $(evt.currentTarget).data('id')
    $.ajax({
      url: `/api/bid/suppliers/${id}/decision?decision=${decision}`,
      method: 'PUT',
      success: () => {
        window.location.reload()
      }
    })
  }

  //撤回投标
  undoBids(evt) {
    const id = $(evt.currentTarget).data('id')
    $.ajax({
      url: `/api/bid/suppliers/${id}/reply/undo`,
      method: 'PUT',
      success: () => {
        new Modal({ icon: 'success', content: '撤回投标成功' }).show(() => {
          window.location.reload()
        })
      }
    })
  }

  //弃标
  abandonBids(evt) {
    const id = $(evt.currentTarget).data('id')
    new Modal(abandonReasonTemplates({ id })).show()
    this.initBidsReasonForm()
  }

  initBidsReasonForm() {
    $('.js-form-bids-reason').validator({
      isErrorOnParent: true
    })
    $('.js-form-bids-reason').on('submit', (evt) => this.submitAbandonReason(evt))
  }

  submitAbandonReason(evt) {
    evt.preventDefault()
    const abandonData = $(evt.currentTarget).serializeObject()
    $.ajax({
      url: `/api/bid/suppliers/${abandonData.id}/abandon`,
      method: 'PUT',
      data: JSON.stringify(abandonData),
      contentType: 'application/json',
      success: () => {
        new Modal({ icon: 'success', content: '弃标成功' }).show(() => {
          window.location.reload()
        })
      }
    })
  }
}

module.exports = SupplierBidsManage

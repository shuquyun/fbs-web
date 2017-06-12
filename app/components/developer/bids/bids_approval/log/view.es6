const approvalSelectTemplates = Handlebars.templates['developer/bids/bids_approval/log/frontend_templates/select']
const Modal = require('pokeball').Modal
class BidsApproval {
  constructor($) {
    this.$jsBidsApproval = $('.js-bids-approval-submit')
    this.$jsInputOpinion = $('input[name=opinion]')
    this.bindEvent()
  }

  bindEvent() {
    this.$jsBidsApproval.on('click', (evt) => this.submitBidsApproval(evt))
  }

  submitBidsApproval(evt) {
    const $self = $(evt.currentTarget)
    const status = $self.data('status')
    const type = $self.data('type')
    const refId = $self.data('id')
    const opinion = this.$jsInputOpinion.val()
    if (status) {
      this.sendAjax({ refId, type, status, opinion })
    } else {
      new Modal(approvalSelectTemplates({ refId, type, status, opinion })).show()
      this.initForm()
      $('.selectric').selectric()
    }
  }

  sendAjax(approvalData) {
    approvalData.refId && $.ajax({
      url: `/api/bids/${approvalData.refId}/approveLogs`,
      method: 'POST',
      data: JSON.stringify(approvalData),
      contentType: 'application/json',
      success: () => {
        window.location.reload()
      }
    })
  }

  initForm() {
    $('.js-form-approval').off().validator({
      isErrorOnParent: true
    })
    $('.js-form-approval').on('submit', (evt) => this.submitApprovalNopass(evt))
  }

  submitApprovalNopass(evt) {
    evt.preventDefault()
    const approvalData = $(evt.currentTarget).serializeObject()
    this.sendAjax(approvalData)
  }
}

module.exports = BidsApproval

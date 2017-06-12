const Modal = require('pokeball').Modal
class BidsSet {
  constructor($) {
    this.$jsBidsSetSubmit = $('.js-bids-set-submit')
    this.$jsApprovalStatus = $('.js-approval-status')
    this.bindEvent()
  }

  bindEvent() {
    this.$jsBidsSetSubmit.on('click', (evt) => this.submitBidsSet(evt))
    $(document).on('confirm:deleteBid', (evt, id) => this.deleteBids(evt,id))
  }

  deleteBids(evt, id) {
    $.ajax({
      url: `/api/bids/${id}`,
      type: 'DELETE',
      success: () => {
        new Modal({ icon: 'success', content: '删除成功' }).show(() => {
          window.location.href = '/developer/bids'
        })
      }
    })
  }

  //提交立项
  submitBidsSet(evt) {
    const id = $(evt.currentTarget).data('id')
    const needApprove = this.$jsApprovalStatus.data('needApprove')
    $.ajax({
      url: `/api/bids/${id}/submit`,
      method: 'PUT',
      success: (data) => {
        console.log(data)
        if (needApprove) {
          new Modal({ icon: 'success', content: '提交立项成功,等待审批' }).show(() => {
            window.location.reload()
          })
        } else {
          window.location.href = `/developer/bids-details/supplier-select?bidId=${id}`
        }
      }
    })
  }
}

module.exports = BidsSet

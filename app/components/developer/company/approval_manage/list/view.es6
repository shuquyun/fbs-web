class ApprovalManage {
  constructor($) {
    this.$jsApprovalOpen = $('.js-approval-open')
    this.$jsApprovalForbid = $('.js-approval-forbid')
    this.$jsApprovalDelete = $('.js-approval-delete')
    this.bindEvent()
  }

  bindEvent() {
   this.$jsApprovalForbid.on('click', (evt) => this.forbidApproval(evt))
   this.$jsApprovalOpen.on('click', (evt) => this.openApproval(evt))
   this.$jsApprovalDelete.on('click', (evt) => this.deleteApproval(evt))
  }

  deleteApproval(evt) {
    const id = $(evt.currentTarget).data('id')
    $.ajax({
      url: `/api/company/approval/flows/${id}`,
      method: 'DELETE',
      success: () => {
        window.location.reload()
      }
    })
  }

  forbidApproval(evt) {
    const id = $(evt.currentTarget).data('id')
    $.ajax({
      url: `/api/company/approval/flows/${id}/disable`,
      method: 'PUT',
      success: () => {
        window.location.reload()
      }
    })
  }

  openApproval(evt) {
    const id = $(evt.currentTarget).data('id')
    $.ajax({
      url: `/api/company/approval/flows/${id}/enable`,
      method: 'PUT',
      success: () => {
        window.location.reload()
      }
    })
  }
}

module.exports = ApprovalManage

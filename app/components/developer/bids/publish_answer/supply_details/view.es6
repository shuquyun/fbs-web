const Modal = require('pokeball').Modal
const FileUpload = require('utils/module').plugins.upload
const confirmFileTemplates = Handlebars.templates['developer/bids/publish_answer/supply_details/frontend_templates/confirm_file']
class BidsSupplyDetails {
  constructor($) {
    this.$jsBidsFileConfirm = $('.js-bids-file-confirm')
    this.$jsUploadFile = $('.js-upload-file')
    this.$jsAttachDelete = $('.js-file-delete')
    this.jsFileSubmit = '.js-supply-file-submit'
    this.$jsApprovalStatus = $('.js-approval-status')
    this.$jsListNeed = $('.js-list-supply-need')
    this.$jsListPublish = $('.js-list-publish')
    this.bindEvent()
  }

  bindEvent() {
    this.$jsBidsFileConfirm.on('click', (evt) => this.confirmBidsFile(evt))
    this.$jsUploadFile.on('click', (evt) => this.uploadFile(evt))
    this.$jsAttachDelete.on('click', (evt) => this.deleteAttachment(evt))
    $(document).on('click', this.jsFileSubmit, (evt) => this.submitBidsFiles(evt))
    this.$jsListNeed.on('click', (evt) => this.needListCreate(evt))
    this.$jsListPublish.on('click', (evt) => this.publishList(evt))
  }

  //发布和撤回清单
  publishList(evt) {
    const $self = $(evt.currentTarget)
    const id = $self.data('id')
    const action = $self.data('action')
    $.ajax({
      url: `/api/bids/files/${id}/status?action=${action}`,
      method: 'PUT',
      success: () => {
        window.location.reload()
      }
    })
  }

  //需创建补充清单
  needListCreate(evt) {
    const id = $(evt.currentTarget).data('id')
    $.ajax({
      url: `/api/issued/bids/${id}?status=1`,
      method: 'PUT',
      success: () => {
        $('.js-list-supply-create').removeClass('hide')
      }
    })
  }

  uploadFile(evt) {
    const $self = $(evt.currentTarget)
    new FileUpload($self.find('input[type=file]'), (data) => {
      const type = $self.data('type')
      const bidId = $self.data('bidId')
      const connectId = $self.data('connectId')
      this.submitAttachment(data, type, bidId, connectId)
    })
  }

  submitAttachment(data, type, bidId, connectId) {
    bidId && $.ajax({
      url: '/api/bids/files',
      method: 'POST',
      data: JSON.stringify({ bidId, connectId, filename: data.name, fileUrl: data.path, fileSize: data.size, type }),
      contentType: 'application/json',
      success: (data) => {
        window.location.reload()
      }
    })
  }

  //删除招标附件
  deleteAttachment(evt) {
    const id = $(evt.currentTarget).data('id')
    $.ajax({
      url: `/api/bids/files/${id}`,
      method: 'DELETE',
      success: () => {
        new Modal({ icon: 'success', content: '删除成功' }).show(() => {
          window.location.reload()
        })
      }
    })
  }

  //确认提交文件列表
  confirmBidsFile(evt) {
    const fileData = $(evt.currentTarget).data('file')
    if (fileData.supplementFiles.length || $('.js-table-list').find('.item-tr').length) {
      new Modal(confirmFileTemplates(fileData)).show()
    } else {
      new Modal({ icon: 'error', 'content': '请上传附件或发布清单！' }).show()
    }
  }

  submitBidsFiles(evt) {
    const $self = $(evt.currentTarget)
    const bidId = $self.data('bidId')
    const issuedBidId = $self.data('issuedBidId')
    const needApprove = this.$jsApprovalStatus.data('needApprove')
    $.ajax({
      url: '/api/issued/supplement/files/submit',
      method: 'POST',
      data: JSON.stringify({ bidId, issuedBidId }),
      contentType: 'application/json',
      success: () => {
        if (needApprove) {
          new Modal({ icon: 'success', content: '提交成功，等待审批' }).show(() => {
            window.location.reload()
          })
        } else {
          window.location.href = `/developer/bids-details/publish-answer?bidId=${bidId}`
        }
      }
    })
  }

}

module.exports = BidsSupplyDetails

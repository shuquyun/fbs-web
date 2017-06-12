const Modal = require('pokeball').Modal
const FileUpload = require('utils/module').plugins.upload
const  attachmentItemTemplates = Handlebars.templates['supplier/bids/bids_reply/common/frontend_templates/attachment_item']

class SupplierBidsClarify {
  constructor($) {
    this.$jsUploadFile = $('.js-upload-file')
    this.jsFileDelete = '.js-file-delete'
    this.$jsListEdit = $('.js-list-edit')
    this.$jsListPublish = $('.js-list-publish')
    this.bindEvent()
  }

  bindEvent() {
    this.initForm()
    this.$jsUploadFile.on('click', (evt) => this.uploadFile(evt))
    $(document).on('confirm:clarify', (evt, id) => this.confirmClarify(evt, id))
    $(document).on('click', this.jsFileDelete, (evt) => this.deleteFile(evt))
    this.$jsListEdit.on('click', (evt) => this.editList(evt))
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

  editList(evt) {
    const $self = $(evt.currentTarget)
    const billId = $self.data('billId')
    const bidId = $self.data('bidId')
    const connectId = $self.data('connectId')
    const newTab = window.open('', '_blank')
    $.ajax({
      url: '/api/bill/copy',
      method: 'POST',
      data: JSON.stringify({ billId, bidId, connectId, type: 15 }),
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

  //删除file
  deleteFile(evt) {
    const $self = $(evt.currentTarget)
    const id = $self.data('id')
    id && $.ajax({
      ulr: `/api/bids/files/${id}`,
      method: 'DELETE',
      success: () => {
        new Modal({ icon: 'success', content: '删除成功' }).show(() => {
          $self.closest('.bids-file-content').remove()
        })
      }
    })
  }

  uploadFile(evt) {
    const $self = $(evt.currentTarget)
    new FileUpload($self.find('input[type=file]'), (data) => {
      const type = $self.data('type')
      this.submitAttachment(data, type, $self)
    })
  }

  submitAttachment(fileData, type, $self) {
    const bidId = $.query.get('bidId')
    const connectId = $self.data('connectId')
    bidId && $.ajax({
      url: '/api/bids/files',
      method: 'POST',
      data: JSON.stringify({ bidId, filename: fileData.name, fileUrl: fileData.path, fileSize: fileData.size, type, connectId }),
      contentType: 'application/json',
      success: (data) => {
        fileData.id = data
        fileData.type = type
        fileData.createdAt = (new Date).getTime()
        this.$jsUploadFile.closest('.bids-content').append(attachmentItemTemplates(fileData))
      }
    })
  }

  initForm() {
    $('.js-form-clarify').validator({
      isErrorOnParent: true
    })
    $('.js-form-clarify').on('submit', (evt) => this.submitClarify(evt))
  }

  confirmClarify(evt, id) {
   $(`.js-clarify-submit-${id}`).trigger('click')
  }

  submitClarify(evt) {
    evt.preventDefault()
    const clarifyData = $(evt.currentTarget).serializeObject()
    $.ajax({
      url: '/api/bid/suppliers/clarify',
      method: 'PUT',
      data: JSON.stringify(clarifyData),
      contentType: 'application/json',
      success: () => {
        new Modal({ icon: 'success', content: '提交成功' }).show(() => {
          window.location.reload()
        })
      }
    })
  }
}

module.exports = SupplierBidsClarify

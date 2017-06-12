const confirmFileTemplates = Handlebars.templates['supplier/bids/bids_reply/common/frontend_templates/confirm'],
      attachmentItemTemplates = Handlebars.templates['supplier/bids/bids_reply/common/frontend_templates/attachment_item']
const Modal = require('pokeball').Modal
const FileUpload = require('utils/module').plugins.upload

class SupplierBidsReply {
  constructor($) {
    this.$jsCheckBoxMain = $('.js-checkbox-main')
    this.$jsTrItem = $('.js-tr-item')
    this.$jsBidsConfirm = $('.js-bids-confirm')
    this.$jsBidsInventory = $('.js-bids-inventory')
    this.$jsBidsAttachment = $('.js-bids-attachment')
    this.$jsBidsAbandon = $('.js-bids-abandon')
    this.$jsUploadFile = $('.js-upload-file')
    this.jsFileDelete = '.js-file-delete'
    this.$jsListPublish = $('.js-list-publish')
    this.bindEvent()
  }

  bindEvent() {
    this.$jsCheckBoxMain.on('click', (evt) => this.toggleCheckBox(evt))
    this.$jsTrItem.on('click', 'input[name=checkbox]', () => this.checkAll())
    this.$jsBidsConfirm.on('click', (evt) => this.confirmFiles(evt))
    this.$jsBidsAbandon.on('click', (evt) => this.abandonBids(evt))
    this.$jsUploadFile.on('click', (evt) => this.uploadFile(evt))
    $(document).on('click', this.jsFileDelete, (evt) => this.deleteFile(evt))
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

  //删除file
  deleteFile(evt) {
    const $self = $(evt.currentTarget)
    const id = $self.data('id')
    id && $.ajax({
      url: `/api/bids/files/${id}`,
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
      this.submitAttachment(data, type)
    })
  }

  submitAttachment(fileData, type) {
    const bidId = $.query.get('bidId')
    const connectId = $.query.get('id')
    connectId && bidId && $.ajax({
      url: '/api/bids/files',
      method: 'POST',
      data: JSON.stringify({ bidId, filename: fileData.name, fileUrl: fileData.path, fileSize: fileData.size, type, connectId }),
      contentType: 'application/json',
      success: (data) => {
        // fileData.id = data
        // fileData.type = type
        // fileData.createdAt = (new Date()).getTime()
        // this.$jsUploadFile.closest('.bids-content').append(attachmentItemTemplates(fileData))
        window.location.reload()
      }
    })
  }

  confirmFiles(evt) {
    const accessoryList = this.$jsBidsAttachment.data('attachment')
    const inventoryList = this.organizeFileItems()
    if (!accessoryList.length) {
      new Modal({ icon: 'warning', content: '请上传回标附件！'}).show()
    } else if (!inventoryList.length) {
      new Modal({ icon: 'warning', content: '请选择需要回标的清单！'}).show()
    } else {
      new Modal(confirmFileTemplates({ accessoryList, inventoryList })).show()
      $('.js-file-submit').off().on('click', (evt) => this.submitBidsFiles(evt))
    }
  }

  organizeFileItems() {
    return _.map(this.$jsTrItem.find('input[name=checkbox]:checked'), (i) => { return $(i).data('item') })
  }

  abandonBids(evt) {
    const id = $(evt.currentTarget).data('id')
    id && $.ajax({
      url: `/api/bid/suppliers/${id}/reply/undo`,
      method: 'PUT',
      success: () => {
        new Modal({ icon: 'success', content: '回标撤回成功' }).show(() => {
          window.location.reload()
        })
      }
    })
  }

  organizeFileIds() {
    return _.map(this.$jsTrItem.find('input[name=checkbox]:checked'), (i) => { return $(i).data('id') })
  }

  submitBidsFiles(evt) {
    const id = $.query.get('id')
    const fileIds = this.organizeFileIds()
    const $self = $(evt.currentTarget)
    $self.spin('small')
    id && $.ajax({
      url: `/api/bid/suppliers/${id}/reply`,
      method: 'PUT',
      data: JSON.stringify(fileIds),
      contentType: 'application/json',
      success: () => {
        $self.spin(false)
        new Modal({ icon: 'success', content: '确认回标成功' }).show(() => {
          window.location.reload()
        })
      },
      error: (error) => {
        new Modal({ icon: 'error', title: 'oops!', content: error.responseJSON.message }).show(() => {
          $self.spin(false)
        })
      }
    })
  }

  toggleCheckBox(evt) {
    const $self = $(evt.currentTarget)
    this.$jsTrItem.find('input[name=checkbox]').prop('checked', $self.prop('checked'))
  }

  checkAll() {
    if (this.$jsTrItem.find('input[name=checkbox]').length === this.$jsTrItem.find('input[name=checkbox]:checked').length) {
      this.$jsCheckBoxMain.prop('checked', true)
    } else {
      this.$jsCheckBoxMain.prop('checked', false)
    }
  }
}

module.exports = SupplierBidsReply

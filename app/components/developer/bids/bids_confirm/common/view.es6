const uploadItemTemplates= Handlebars.partials['developer/bids/bids_confirm/confirm_info/all_templates/_attach_item'],
      startBidsConfirmTemplates = Handlebars.templates["developer/bids/bids_confirm/common/frontend_templates/confirm"],
      downLoadTemplates = Handlebars.templates['developer/bids/bids_evaluate/common/frontend_templates/download'],
      listItemTemplates = Handlebars.templates['developer/bids/bids_evaluate/common/frontend_templates/list']
const Modal = require('pokeball').Modal
const FileUpload = require('utils/module').plugins.upload
class BidsConfirm {
  constructor($) {
    this.$jsCheckBoxMain = $('.js-checkbox-main')
    this.$jsBidsInventoryConfirm = $('.js-bids-inventory-confirm')
    this.$jsBidsStart = $('.js-bids-confirm-start')
    this.jsBidsStartConfirm = '.js-bids-start-confirm'
    this.$jsUploadFile = $('.js-upload-file')
    this.clarifyAttachDelete = '.js-clarify-attch-delete'
    this.$jsTableBidsConfirm = $('.js-table-bids-confirm')
    this.$jsAttachmentDownload = $('.js-attachment-download')
    this.$jsListPublish = $('.js-list-publish')
    this.$jsListControl  = $('.js-list-control')
    this.jsListEdit = '.js-list-edit'
    this.bindEvent()
  }

  bindEvent() {
    this.initForm()
    this.$jsCheckBoxMain.on('click', (evt) => this.toggleCheckBox(evt))
    $('.js-tr-item input:checkbox').on('click', () => this.checkAll())
    this.$jsBidsStart.on('click', (evt) => this.startBidsConfirm(evt))
    this.$jsBidsInventoryConfirm.on('click', () => this.confirmBidsInventory())
    $(document).on('click', this.jsBidsStartConfirm, (evt) => this.submitBidsStart(evt))
    this.$jsUploadFile.on('click', (evt) => this.uploadFile(evt))
    $(document).on('click', this.clarifyAttachDelete, (evt) => this.deleteClarifyAttach(evt))
    this.$jsAttachmentDownload.on('click', (evt) => this.downloadAttachment(evt))
    this.$jsListPublish.on('click', (evt) => this.publishList(evt))
    this.$jsListControl.on('click', (evt) => this.jumpListView(evt))
    $(document).on('click', this.jsListEdit, (evt) => this.editList(evt))
  }

  //查看编辑投标清单
  jumpListView(evt) {
    const $self = $(evt.currentTarget)
    const type = $self.data('type')
    const list = $self.data('list')
    const bidId = $self.data('bidId')
    if (list.length === 1) {
      if (type === 'edit') {
        this.editEvaluateInventory(list[0])
      } else {
        window.open(`/list/details?bidId=${bidId}&billId=${list[0].fileUrl}`)
      }
    } else {
      new Modal(listItemTemplates({ type, list })).show()
    }
  }

  editList(evt) {
    const fileData = $(evt.currentTarget).data('list')
    this.editEvaluateInventory(fileData)
  }

  editEvaluateInventory(fileData) {
    fileData.billId = fileData.fileUrl
    //回标清单对应状态 11，12，13 开发商回复最终清单type 17，18，19
    fileData.type = fileData.type + 6
    const newTab = window.open('', '_blank')
    $.ajax({
      url: '/api/bill/copy',
      method: 'POST',
      data: JSON.stringify(fileData),
      contentType: 'application/json',
      success: (data) => {
        newTab.location.href = `/list/config?bidId=${fileData.bidId}&billId=${data}`
      },
      error: (error) => {
        newTab.close()
        new Modal({icon: "error", title: "oops!", content: error.responseJSON.message }).show()
      }
    })
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

  //下载回标附件
  downloadAttachment(evt) {
    const $self = $(evt.currentTarget)
    const id = $self.data('id')
    const bidId = $self.data('bidId')
    $.ajax({
      url: `/api/bids/${bidId}/files/connect?type=10&connectId=${id}`,
      method: 'GET',
      success: (data) => {
        new Modal(downLoadTemplates({ data })).show()
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

  initForm() {
    $('.js-form-bids-confirm').validator({
      isErrorOnParent: true
    })
    $('.js-form-bids-confirm').on('submit', (evt) => this.submitBidsConfirm(evt))
  }

  submitBidsConfirm(evt) {
    evt.preventDefault()
    const confirmData = $(evt.currentTarget).serializeObject()
    const bidId = $.query.get('bidId')
    if (this.$jsTableBidsConfirm.find('.js-tr-item').length) {
      $.ajax({
        url: `/api/bids/${bidId}/confirm`,
        method: 'PUT',
        data: JSON.stringify(confirmData),
        contentType: 'application/json',
        success: () => {
          new Modal({ icon: 'success', content: '提交定标成功' }).show(() => {
            window.location.reload()
          })
        }
      })
    } else {
      new Modal({ icon: 'warning', content: '暂无定标供应商！' }).show()
    }
  }

  submitAttachment(fileData, type, $self) {
    const bidId = $.query.get('bidId')
    bidId && $.ajax({
      url: '/api/bids/files',
      method: 'POST',
      data: JSON.stringify({ bidId, filename: fileData.name, fileUrl: fileData.path, fileSize: fileData.size, type }),
      contentType: 'application/json',
      success: (data) => {
        fileData.id = data
        fileData.type = type
        fileData.filename = fileData.name
        fileData.createdAt = (new Date()).getTime()
        fileData.fileType = 1
        $self.closest('.upload-content').after(uploadItemTemplates(fileData))
      }
    })
  }

  deleteClarifyAttach(evt) {
    const $self = $(evt.currentTarget)
    const id = $self.data('id')
    $.ajax({
      url: `/api/bids/files/${id}`,
      method: 'DELETE',
      success: () => {
        $self.closest('.file-content').remove()
      }
    })
  }

  //确认中标清单
  confirmBidsInventory(evt) {
    const ids = _.map($('.js-tr-item').find('input:checkbox:checked'), (i) => { return $(i).data('id') })
    if (ids.length) {
      $.ajax({
        url: '/api/bids/confirm/inventories',
        method: 'PUT',
        data: JSON.stringify(ids),
        contentType: 'application/json',
        success: () => {
          new Modal({ icon: 'success', content: '确定中标清单成功' }).show(() => {
            window.location.reload()
          })
        }
      })
    } else {
      new Modal({ icon: 'error', content: '至少选择一个供应商！' }).show()
    }
  }

  //确认中标
  submitBidsStart(evt) {
    const startConfirms = $(evt.currentTarget).data('startConfirms')
    const bidId = $.query.get('bidId')
    if (startConfirms.length) {
      $.ajax({
        url: `/api/bids/${bidId}/confirm/start`,
        method: 'PUT',
        data: JSON.stringify(startConfirms),
        contentType: 'application/json',
        success: () => {
          new Modal({ icon: 'success', content: '发起定标成功' }).show(() => {
            window.location.reload()
          })
        }
      })
    } else {
      new Modal({ icon: 'error', content: '至少选择一个供应商！' }).show()
    }
  }

  //发起中标
  startBidsConfirm(evt) {
    const companyData = _.map($('.js-tr-item').find('input:checkbox:checked'), (i) => {
      const supplierName = $(i).data('supplierName')
      const finalFee = $(i).data('finalFee')
      const supplierId = $(i).data('id')
      return { supplierName, finalFee, supplierId }
    })
    if (companyData.length) {
      new Modal(startBidsConfirmTemplates({ companyData })).show()
    } else {
      new Modal({ icon: 'error', content: '至少选择一个供应商！' }).show()
    }
  }

  toggleCheckBox(evt) {
    $('.js-tr-item').find('input:checkbox').prop('checked', $(evt.currentTarget).prop('checked'))
  }

  checkAll() {
    const length = $('.js-tr-item').find('input:checkbox').length
    if ($('.js-tr-item').find('input:checkbox:checked').length === length) {
      this.$jsCheckBoxMain.removeClass("indeterminate").prop("checked", true).attr("indeterminate", false)
    } else if (!$('.js-tr-item').find('input:checkbox:checked').length) {
      this.$jsCheckBoxMain.removeClass("indeterminate").prop("checked", false).attr("indeterminate", false)
    } else {
      this.$jsCheckBoxMain.removeClass("indeterminate").prop("checked", false).attr("indeterminate", true)
    }
  }

}

module.exports = BidsConfirm

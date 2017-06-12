const Modal = require('pokeball').Modal
const clarifyTemplates = Handlebars.templates['developer/bids/bids_evaluate/common/frontend_templates/clarify'],
      uploadItemTemplates= Handlebars.partials['developer/bids/bids_evaluate/common/all_templates/_attach_item'],
      downLoadTemplates = Handlebars.templates['developer/bids/bids_evaluate/common/frontend_templates/download'],
      supplierInviteTemplates = Handlebars.templates['developer/bids/bids_evaluate/common/frontend_templates/supplier_invite'],
      listItemTemplates = Handlebars.templates['developer/bids/bids_evaluate/common/frontend_templates/list']
const FileUpload = require('utils/module').plugins.upload
const SelectTree = require("developer/bids/select_tree/view")
class BidsEvaluate {
  constructor($) {
    this.$jsClarifySend = $('.js-clarify-send')
    this.$jsSupplierInvite = $('.js-supplier-invite')
    this.$jsClarifyGroup = $('.js-clarify-group')
    this.clarifyAttachDelete = '.js-clarify-attch-delete'
    this.jsUploadFile = '.js-upload-file'
    this.jsFormClarify = '.js-form-clarify'
    this.$jsFormEvaluate = $('.js-form-attachment-evaluate')
    this.$jsCheckBoxMain = $('.js-checkbox-main')
    this.$jsBidsEvaluate = $('.js-bids-evaluate')
    this.$jsApprovalStatus = $('.js-approval-status')
    this.$jsAttachmentDownload = $('.js-attachment-download')
    this.$jsSupplierShow = $('.js-supplier-reply-show')
    this.$jsListNeed = $('.js-list-answer-need')
    this.$jsListPublish = $('.js-list-publish')
    this.$jsListControl  = $('.js-list-control')
    this.$jsListEvaluateCreate = $('.js-list-evaluate-create')
    this.bindEvent()
  }

  bindEvent() {
    this.initForm(this.$jsFormEvaluate)
    this.$jsClarifySend.on('click', (evt) => this.sendClarify(evt))
    $(document).on('click', this.jsUploadFile, (evt) => this.uploadFile(evt))
    $(document).on('click', this.clarifyAttachDelete, (evt) => this.deleteClarifyAttach(evt))
    $(document).on('submit', '.js-form-clarify', (evt) => this.submitClarify(evt))
    this.$jsFormEvaluate.on('submit', (evt) => this.submitAttachmentEvaluate(evt))
    this.$jsCheckBoxMain.on('click', (evt) => this.toggleCheckBox(evt))
    $('.js-tr-item input:checkbox').on('click', () => this.checkAll())
    this.$jsBidsEvaluate.on('click', (evt) => this.submitBidsEvaluate(evt))
    this.$jsAttachmentDownload.on('click', (evt) => this.downloadAttachment(evt))
    this.$jsSupplierShow.on('click', (evt) => this.showSupplierRelpy(evt))
    this.$jsListNeed.on('click', () => this.needListEvaluateCreate())
    this.$jsListPublish.on('click', (evt) => this.publishList(evt))
    this.$jsSupplierInvite.on('click', (evt) => this.inviteSupplier(evt))
    $(document).on('submit', '.js-form-invite', (evt) => this.submitSupplierInvite(evt))
    this.$jsListControl.on('click', (evt) => this.jumpListView(evt))
    this.$jsListEvaluateCreate.on('click', (evt) => this.createEvaluateList(evt))
  }

  //查看编辑投标清单
  jumpListView(evt) {
    const $self = $(evt.currentTarget)
    const type = $self.data('type')
    const list = $self.data('list')
    const bidId = $.query.get('bidId')
    if (list.length === 1) {
      if (type === 'view') {
        window.open(`/list/details?bidId=${bidId}&billId=${list[0].fileUrl}`)
      }
    } else {
      new Modal(listItemTemplates({ type, list })).show()
    }
  }

  //创建澄清清单
  createEvaluateList(evt) {
    const bidId = $(evt.currentTarget).data('bidId')
    const companyIds = this.organizeCompanyIds()
    if (companyIds.length) {
      window.open(`/list/config?bidId=${bidId}&companyIds=${companyIds}&type=14`)
    } else {
      new Modal({ icon: 'warning', content: '请至少选择一个供应商！' }).show()
    }
  }

  //邀请平台供应商
  inviteSupplier(evt) {
    const major = $(evt.currentTarget).data('major')
    const bidId = $.query.get('bidId')
    $.ajax({
      url: `/api/company/list-bid-superior-supplier?bidId=${bidId}`,
      method: 'get',
      success: (data) => {
        if (data.length) {
          this.inviteModal = new Modal(supplierInviteTemplates({ major }))
          this.inviteModal.show()
          this.initSelect(data)
          this.initForm($('.js-form-invite'))
          $('.datepicker-hour').datepickerHour()
        } else {
          new Modal({ icon: 'warning', content: '暂无平台供应商或平台供应商已入围！' }).show()
        }
      }
    })
  }

  initSelect(data) {
    data =  _.map(data, (i) => {
      return { id: i.id, name: i.name, linkStatus: i.extra ? !i.extra.superior : true }
    })
    new SelectTree('.js-select-container', data)
  }

  submitSupplierInvite(evt) {
    evt.preventDefault()
    const inviteData = $(evt.currentTarget).serializeObject()
    const bidId = $.query.get('bidId')
    inviteData.ids = inviteData.ids.split(',')
    $.ajax({
      url: `/api/bids/${bidId}/suppliers/quotes`,
      method: 'POST',
      data: JSON.stringify(inviteData),
      contentType: 'application/json',
      success: () => {
        this.inviteModal.close()
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

  needListEvaluateCreate() {
    const bidId = $.query.get('bidId')
    bidId && $.ajax({
      url: `/api/bids/${bidId}/clarifylogs?status=1`,
      method: 'PUT',
      success: () => {
        $('.js-list-evaluate-create').removeClass('hide')
      }
    })
  }

  //显示回标供应商
  showSupplierRelpy(evt) {
    const check = $(evt.currentTarget).prop('checked')
    if (check) {
      $('.js-tr-item.no-reply').hide()
    } else {
      $('.js-tr-item.no-reply').show()
    }
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

  uploadFile(evt) {
    const $self = $(evt.currentTarget)
    new FileUpload($self.find('input[type=file]'), (data) => {
      const type = $self.data('type')
      this.submitAttachment(data, type, $self)
    })
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
        fileData.filename = fileData.name
        fileData.createdAt = (new Date()).getTime()
        fileData.fileType = 1
        $self.closest('.upload-content').after(uploadItemTemplates(fileData))
      }
    })
  }

  //发起澄清
  sendClarify(evt) {
    const inventories = this.organizeInventory()
    const companyIds = this.organizeCompanyIds()
    if (companyIds.length) {
      new Modal(clarifyTemplates({ inventories, companyIds })).show()
    } else {
      new Modal({icon: 'error', content: '至少选择一个供应商！' }).show()
    }
    $('.js-form-clarify select').selectric()
    this.initForm($('.js-form-clarify'))
  }

  //序列化清单
  organizeInventory() {
    return _.map($('.js-inventory-tr'), (i) => { return { id: $(i).data('id'), name: $(i).data('name') } })
  }

  //序列化公司id
  organizeCompanyIds() {
    return _.map($('.js-tr-item').find('input:checkbox:checked'), (i) => { return parseInt($(i).data('id'))})
  }

  initForm($form) {
    $form.validator({
      isErrorOnParent: true
    })
  }

  //提交评标
  submitBidsEvaluate(evt) {
    const needApprove = this.$jsApprovalStatus.data('needApprove')
    const bidId = $.query.get('bidId')
    const status = this.judgeAttachmentEvaluate($(evt.currentTarget))
    if (status) {
      bidId && $.ajax({
        url: `/api/bids/${bidId}/evaluate`,
        method: 'PUT',
        success: () => {
          if (needApprove) {
            new Modal({ icon: 'success', content: '提交评标成功,等待审批' }).show(() => {
              window.location.reload()
            })
          } else {
            window.location.href = `/developer/bids-details/confirm?bidId=${bidId}`
          }
        }
      })
    } else {
      new Modal({ icon: 'error', content: '请保存评标附件及评价' }).show()
    }
  }

  judgeAttachmentEvaluate($self) {
    const techEvaluation = parseInt($self.data('tech'))
    const creditEvaluation = parseInt($self.data('credit'))
    const businessEvaluation = parseInt($self.data('business'))
    return techEvaluation && creditEvaluation && businessEvaluation
  }

  //提交评价附件
  submitAttachmentEvaluate(evt) {
    evt.preventDefault()
    const evaluateData = $(evt.currentTarget).serializeObject()
    $.ajax({
      url: `/api/bids/${evaluateData.bidId}/evaluateTempInfo`,
      method: 'PUT',
      data: JSON.stringify(evaluateData),
      contentType: 'application/json',
      success: () => {
        window.location.reload()
      }
    })
  }

  //提交澄清
  submitClarify(evt) {
    evt.preventDefault()
    const bidId = $.query.get('bidId')
    const clarifyData = $(evt.currentTarget).serializeObject()
    clarifyData.companyIds = clarifyData.companyIds.split(',')
    if (clarifyData.clarifyInventoryId || $('.js-clarify-file').length) {
      $.ajax({
        url: `/api/bids/${bidId}/clarify`,
        method: 'POST',
        data: JSON.stringify(clarifyData),
        contentType: 'application/json',
        success: () => {
          new Modal({ icon: 'success', content: '发起成功' }).show(() => {
            window.location.reload()
          })
        }
      })
    } else {
      new Modal({ icon: 'warning', content: '附件和清单至少选择一种！' }).show()
    }
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
}

module.exports = BidsEvaluate

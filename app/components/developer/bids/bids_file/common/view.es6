const confirmFileTemplates = Handlebars.templates['developer/bids/bids_file/common/frontend_templates/confirm_file'],
      assignManagerTemplates = Handlebars.templates['developer/bids/bids_file/common/frontend_templates/manager_assign']
const Modal = require('pokeball').Modal
const FileUpload = require('utils/module').plugins.upload
const SelectTree = require("developer/bids/select_tree/view")
class BidsFile {
  constructor($) {
    this.$jsBidsFileConfirm = $('.js-bids-file-confirm')
    this.$jsManagerAssign = $('.js-manager-assign')
    this.$jsUploadFile = $('.js-upload-file')
    this.$jsAttachDelete = $('.js-file-delete')
    this.jsFileSubmit = '.js-file-submit'
    this.$jsApprovalStatus = $('.js-approval-status')
    this.$jsBidsOperator = $('.js-bids-operator')
    this.$jsListPublish = $('.js-list-publish')
    this.bindEvent()
  }

  bindEvent() {
    this.$jsBidsFileConfirm.on('click', (evt) => this.confirmBidsFile(evt))
    this.$jsManagerAssign.on('click', (evt) => this.assignManager(evt))
    this.$jsUploadFile.on('click', (evt) => this.uploadFile(evt))
    this.$jsAttachDelete.on('click', (evt) => this.deleteAttachment(evt))
    $(document).on('click', this.jsFileSubmit, (evt) => this.submitBidsFiles(evt))
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

  uploadFile(evt) {
    const $self = $(evt.currentTarget)
    new FileUpload($self.find('input[type=file]'), (data) => {
      const type = $self.data('type')
      this.submitAttachment(data, type)
    })
  }

  submitAttachment(data, type) {
    const bidId = $.query.get('bidId')
    bidId && $.ajax({
      url: '/api/bids/files',
      method: 'POST',
      data: JSON.stringify({ bidId, filename: data.name, fileUrl: data.path, fileSize: data.size, type }),
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
    if (!fileData.accessoryList.length) {
      new Modal({ icon: 'warning', content: '请上传招标附件！' }).show()
    } else if (!$('.js-inventory-effect-item').length) {
      new  Modal({ icon: 'warning', content: '请发布招标清单！'}).show()
    } else {
      new Modal(confirmFileTemplates(fileData)).show()
    }
  }

  submitBidsFiles(evt) {
    const $self = $(evt.currentTarget)
    const bidId = $self.data('bidId')
    const issueBidOperatorId = $('.js-bids-operator').find('select[name=issueBidOperatorId] option:selected').val()
    const issueBidOperatorName = $('.js-bids-operator').find('select[name=issueBidOperatorId] option:selected').text()
    const qaOperatorId = $('.js-bids-operator').find('select[name=qaOperatorId] option:selected').val()
    const qaOperatorName = $('.js-bids-operator').find('select[name=qaOperatorId] option:selected').text()
    const needApprove = this.$jsApprovalStatus.data('needApprove')
    const status = this.$jsBidsFileConfirm.data('status')
    $.ajax({
      url: `/api/bids/${bidId}/bidFiles`,
      method: 'PUT',
      data: JSON.stringify({ bidId, issueBidOperatorId, issueBidOperatorName, qaOperatorId, qaOperatorName }),
      contentType: 'application/json',
      success: () => {
        if (needApprove) {
          new Modal({ icon: 'success', content: '提交成功，等待审批' }).show(() => {
            if (status === 2) {
              window.location.href = `/developer/bids-details/supplier-select?bidId=${bidId}`
            } else {
              window.location.reload()
            }
          })
        } else if (status === 6) {
          window.location.href = `/developer/bids-details/publish-answer?bidId=${bidId}`
        } else {
          window.location.href = `/developer/bids-details/supplier-select?bidId=${bidId}`
        }
      }
    })
  }

  initForm() {
    $('.js-form-operator').validator({
      isErrorOnParent: true
    })
    $('.js-form-operator').on('submit', (evt) => this.sumitOperatorAssign(evt))
  }

  sumitOperatorAssign(evt) {
    evt.preventDefault()
    const operatorData = $(evt.currentTarget).serializeObject()
    const bidId = $.query.get('bidId')
    $.ajax({
      url: `/api/bids/${bidId}/costOperators?costOperatorIds=${operatorData.costOperatorIds}&costOperatorRemark=${operatorData.costOperatorRemark}`,
      method: 'PUT',
      success: () => {
        window.location.reload()
      }
    })
  }

  initSelectMore() {
    const userData = this.$jsBidsOperator.data('users')
    const data = _.map(userData, (i) => {
      return { id: i.userId, name: i.realName }
    })
    new SelectTree('.js-select-container', data)
  }

  assignManager(evt) {
    const costoperator = $(evt.currentTarget).data('costoperator')
    this.operatorModal = new Modal(assignManagerTemplates({ costoperator }))
    this.operatorModal.show()
    this.initSelectMore()
    this.initForm()
  }
}

module.exports = BidsFile

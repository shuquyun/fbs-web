const Modal = require('pokeball').Modal
const CommonDatepicker = require("utils/module").plugins.commonDatepicker

class DeveloperIndex {
  constructor($) {
    this.$jsMessageSet = $('.js-message-set')
    this.$jsCheckBoxMain = $('.js-checkbox-main')
    this.$jsCheckItem = $('.js-message-tr input[type=checkbox]')
    this.$jsForm = $('.js-form-filter')
    this.$jsTitleTab = $('.js-title-tab')
    this.$jsApprovalShow = $('.js-approval-show')
    this.$jsMessageShow = $('.js-message-show')
    this.bindEvent()
  }

  bindEvent() {
    this.$jsMessageSet.on('click', () => this.setMessageRead())
    this.$jsCheckBoxMain.on('click', (evt) => this.checkAll(evt))
    this.$jsCheckItem.on('click', () => this.judegeCheckAll())
    $('.datepicker', this.$jsForm).datepicker()
    new CommonDatepicker(this.$jsForm)
    this.$jsTitleTab.on('click', (evt) => this.filterApproval(evt))
    this.$jsApprovalShow.on('click', (evt) => this.showApprovalDetails(evt))
    this.$jsMessageShow.on('click', (evt) => this.setOneMessageRead(evt))
  }

  //过滤审批
  filterApproval(evt) {
    const $self = $(evt.currentTarget)
    const status = $self.data('status')
    const type = $self.data('type')
    const tab = $self.data('tab')
    if (status) {
      if (type === 3 && tab) {
        window.location.search = $.query.set('disabledStatusStr', status).remove('statusStr').remove('pageSize')
      } else {
        window.location.search = $.query.set('statusStr', status).remove('disabledStatusStr').remove('pageSize')
      }
    } else {
      window.location.search = $.query.remove('statusStr').remove('disabledStatusStr').remove('pageSize')
    }
  }

  checkAll(evt) {
    const check = $(evt.currentTarget).prop('checked')
    this.$jsCheckItem.prop('checked', check)
  }

  judegeCheckAll() {
    if (this.$jsCheckItem.length === $('.js-message-tr input[type=checkbox]:checked')) {
      this.$jsCheckBoxMain.prop('checked', true)
    } else {
      this.$jsCheckBoxMain.prop('checked', false)
    }
  }

  setMessageRead() {
    const messageData = this.organizeMessageIds()
    if (messageData.length) {
      this.sendAjax(messageData, 'reload')
    } else {
      new Modal({ icon: 'warning', content: '至少选择一条消息' }).show()
    }
  }

  sendAjax(message, type, $self) {
    let newTab
    if (type === 'open') {
      newTab = window.open("", "_blank")
    }
    $.ajax({
      url: '/api/message/reads',
      method: 'PUT',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: () => {
        if (type === 'reload') {
          window.location.reload()
        } else {
          this.showMessageDetails($self, newTab)
        }
      }
    })
  }

  setOneMessageRead(evt) {
    const $self = $(evt.currentTarget)
    const id = $self.data('id')
    const msgRead = $self.data('msgRead')
    if (msgRead) {
      const newTab = window.open("", "_blank")
      this.showMessageDetails($self, newTab)
    } else {
      this.sendAjax([{ id, msgRead }], 'open', $self)
    }
  }

  organizeMessageIds() {
    return _.map($('.js-message-tr input[type=checkbox]:checked'), (i) => {
      const id = $(i).data('id')
      const msgRead = $(i).data('msgRead')
      return { id, msgRead }
    })
  }

  showApprovalDetails(evt) {
    const $self = $(evt.currentTarget)
    const refId = $self.data('refId')
    const type = parseInt($self.data('type'))
    this.openApprovalDetails(refId, type)
  }

  openApprovalDetails(refId, type) {
    let url
    const newTab = window.open('', '_blank')
    switch (type) {
      case 0:
        url = `/developer/bids-details/set?bidId=${refId}`
        break
      case 1:
        url = `/developer/bids-details/file?bidId=${refId}`
        break
      case 2:
        url = `/developer/bids-details/supplier-select?bidId=${refId}`
        break
      case 3:
        url = `/developer/bids-details/supply-details?issuedId=${refId}`
        break
      case 4:
        url = `/developer/bids-details/answer-details?answerId=${refId}`
        break
      case 5:
        url = `/developer/bids-details/evaluate?bidId=${refId}`
        break
      case 6:
        url = `/developer/bids-details/confirm?bidId=${refId}`
        break
      default:
        url = '/developer/bids'
    }
    newTab.location.href = url
  }

  showMessageDetails($self, newTab) {
    const type = $self.data('type')
    const extra = $self.data('extra')
    this.openMessageDetails(extra, type, newTab)
  }

  openMessageDetails(extra, type, newTab) {
    let url
    switch (type) {
      case 1: case 5:
        url = `/developer/bids-details/file?bidId=${extra.bidId}`
        break
      case 2: case 3:
        url = `/developer/bids-details/supplier-select?bidId=${extra.bidId}`
        break
      case 4:
        url = '/supplier/bids?type=registered'
        break
      case 6:
        url = `/developer/bids-details/supply-details?issuedId=${extra.issuedId}`
        break
      case 7: case 8:
        url = `/developer/bids-details/publish-answer?bidId=${extra.bidId}`
        break
      case 9:
        url = `/developer/bids-details/open?bidId=${extra.bidId}`
        break
      case 10: case 12: case 14:
        url = `/supplier/bids-details/reply-file?bidId=${extra.bidId}&id=${extra.bidSupplierId}`
        break
      case 11: case 13: case 15:
        url = `/supplier/bids-details/answer-file?bidId=${extra.bidId}&id=${extra.bidSupplierId}`
        break
      case 16: case 17:
        url = `/developer/bids-details/evaluate?bidId=${extra.bidId}`
        break
      case 18:
        url = `/supplier/bids-details/clarify-file?bidId=${extra.bidId}&id=${extra.bidSupplierId}`
        break
      case 19:
        url = '/supplier/bids'
        break
      case 20: case 21:
        url = `/developer/bids-details/confirm?bidId=${extra.bidId}`
        break
      case 22: case 23: case 24:
        url = `/supplier/bids-details/inventory-confirm?bidId=${extra.bidId}&id=${extra.bidSupplierId}`
        break
      default:
        url = '/index'
    }
    newTab.location.href = url
  }
}

module.exports = DeveloperIndex

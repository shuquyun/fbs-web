const inviteSupplierTemplate = Handlebars.templates['developer/bids/supplier_select/waiting/frontend_templates/invite'],
      inviteSupplierItemTemplates = Handlebars.partials['developer/bids/supplier_select/waiting/all_templates/_invite_item'],
      optionItemTemplates = Handlebars.templates['developer/bids/supplier_select/waiting/frontend_templates/option']
const Modal = require('pokeball').Modal

class SupplierSelect {
  constructor($) {
    this.$jsSupplierInvite = $('.js-supplier-invite')
    this.$jsSupplierEnter = $('.js-supplier-enter')
    this.$jsSupplierDelete = $('.js-supplier-waiting-delete')
    this.$jsSupplierSumit = $('.js-supplier-submit')
    this.$jsApprovalStatus = $('.js-approval-status')
    this.jsSupplierAdd = '.js-supplier-add'
    this.jsSupplierItemDelete = '.js-supplier-item-delete'
    this.jsSupplierSelect = '.js-supplier-company'
    this.$jsTableSupplierWaiting = $('.js-table-supplier-waiting')
    this.jsSupplierContact = '.js-supplier-contact'
    this.bindEvent()
  }

  bindEvent() {
    this.$jsSupplierInvite.on('click', (evt) => this.inviteSupplier(evt))
    this.$jsSupplierEnter.on('click', (evt) => this.enterSupplier(evt))
    $(document).on('confirm:enter', (evt, id) => this.confirmEnterSupplier(evt, id))
    this.$jsSupplierDelete.on('click', (evt) => this.deleteSupplierWaiting(evt))
    this.$jsSupplierSumit.on('click', (evt) => this.submitSupplier(evt))
    $(document).on('click', this.jsSupplierAdd, (evt) => this.addInviteSupplier(evt))
    $(document).on('click', this.jsSupplierItemDelete, (evt) => this.deleteSupplierItem(evt))
    $(document).on('change', this.jsSupplierSelect, (evt) => this.changeSupplierSelect(evt))
    $(document).on('change', this.jsSupplierContact, (evt) => this.changeSupplierContact(evt))
  }

  //邀请库内供应商
  inviteSupplier(evt) {
    const major = $(evt.currentTarget).data('major')
    const bidId = $.query.get('bidId')
    $.ajax({
      url: `/api/supplier/manage/index/searchBidSuppliers?specialId=${major.specialityIds}&pageSize=1000&bidId=${bidId}`,
      method: 'GET',
      success: (data) => {
        if (data.total) {
          new Modal(inviteSupplierTemplate({ major, suppliers: data.data })).show()
          this.initForm()
          this.initSelectric()
        } else {
          new Modal({ icon: 'warning', content: '暂无库内供应商或供应商已入围！' }).show()
        }
      }
    })
  }

  changeSupplierContact(evt) {
    const $self = $(evt.currentTarget)
    const name = $self.find('option:selected').text()
    $self.closest('.group-content').find('.js-contact-name').val(name)
  }

  changeSupplierSelect(evt) {
    const $self = $(evt.currentTarget)
    const id = $self.find('option:selected').val()
    id && $.ajax({
      url: `/api/company/supplier/contacts/${id}`,
      method: 'GET',
      success: (data) => {
        data.unshift({ phone: '', name: '请选择' })
        $self.closest('.js-supplier-invite-item').find('.js-supplier-contact').html(optionItemTemplates({ users: data }))
        this.initSelectric()
        this.checkSelectOption('js-supplier-company')
      }
    })
  }

  deleteSupplierItem(evt) {
    $(evt.currentTarget).closest('.js-supplier-invite-item').remove()
    this.checkSelectOption('js-supplier-company')
  }

  addInviteSupplier(evt) {
    const $self = $(evt.currentTarget)
    const suppliers = $self.data('suppliers')
    $self.closest('.control-group').before(inviteSupplierItemTemplates({ suppliers }))
    this.initForm()
    this.initSelectric()
    this.checkSelectOption('js-supplier-company')
  }

  checkSelectOption(select) {
    $(`.selectric-${select}`).find('.selectric-items li').show()
    this.initSelectOption(select)
  }

  initSelectOption(select) {
    _.each($(`.${select}`), (i) => {
      const $self = $(i)
      const index = $self.find('option:selected').data('index')
      $(`.${select}`).not($self).closest(`.selectric-${select}`).find(`.selectric-items li[data-index=${index}]`).hide()
    })
  }

  initSelectric() {
    $('.select').selectric()
  }

  initForm() {
    $('.js-form-invite').off().validator({
      isErrorOnParent: true
    })
    $('.js-form-invite').on('submit', (evt) => this.submitSupplierInvite(evt))
  }

  submitSupplierInvite(evt) {
    evt.preventDefault()
    const inviteData = $(evt.currentTarget).serializeObject()
    const bidId = $.query.get('bidId')
    $.ajax({
      url: `/api/bid/${bidId}/suppliers`,
      method: 'POST',
      data: JSON.stringify(inviteData.invite),
      contentType: 'application/json',
      success: () => {
        new Modal({ icon: 'success', content: '供应商邀请成功' }).show(() => {
          window.location.reload()
        })
      }
    })
  }

  //供应商入围
  enterSupplier(evt) {
    const id = $(evt.currentTarget).data('id')
    this.sendSelectAjax(id)
  }

  confirmEnterSupplier(evt, id) {
    this.sendSelectAjax(id)
  }

  sendSelectAjax(id) {
    $.ajax({
      url: `/api/bid/suppliers/${id}/select`,
      method: 'PUT',
      contentType: 'application/json',
      success: () => {
        window.location.reload()
      }
    })
  }

  //删除入围供应商
  deleteSupplierWaiting(evt) {
    const $self = $(evt.currentTarget)
    const id = $self.data('id')
    const status = $self.data('status')
    $.ajax({
      url: `/api/bid/suppliers/${id}`,
      method: 'DELETE',
      success: () => {
        if (status === 1) {
          window.location.reload()
        } else {
          $self.closest('tr').remove()
        }
      }
    })
  }

  //供应商入围
  submitSupplier(evt) {
    const bidId = $.query.get('bidId')
    const needApprove = this.$jsApprovalStatus.data('needApprove')
    const status = $(evt.currentTarget).data('status')
    const length = this.$jsTableSupplierWaiting.find('.js-tr-item').length
    if (length) {
      bidId && $.ajax({
        url: `/api/bids/${bidId}/suppliers/submit`,
        method: 'PUT',
        success: () => {
          if (needApprove) {
            new Modal({ icon: 'success', content: '提交成功，等待审批' }).show(() => {
              if (status === 2) {
                window.location.href = `/developer/bids-details/file?bidId=${bidId}`
              } else {
                window.location.reload()
              }
            })
          } else if (status === 8){
            window.location.href = `/developer/bids-details/publish-answer?bidId=${bidId}`
          } else {
            window.location.href = `/developer/bids-details/file?bidId=${bidId}`
          }
        }
      })
    } else {
      new Modal({ icon: 'warning', content: '暂无待入围供应商！'}).show()
    }
  }
}

module.exports = SupplierSelect

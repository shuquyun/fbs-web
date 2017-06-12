const Modal = require('pokeball').Modal
const CommonDatepicker = require("utils/module").plugins.commonDatepicker
const projectBaseTemplates = Handlebars.partials['developer/bids/bids_manage/common/all_templates/_base_info'],
      registerDeadlineTemplates = Handlebars.partials['developer/bids/bids_manage/common/all_templates/_register_date']
import { bidsData } from 'developer/bids/bids_manage/common/constant/bids'

const SelectTree = require("developer/bids/select_tree/view")

class BidsManage {
  constructor($) {
    this.$jsFormBids = $('.js-form-bids')
    this.$jsProjectBase = $('.js-project-base')
    this.projectSelect = '.js-project-select'
    this.$jsBidName = $('input[name=bidName]')
    this.$jsBidWay = $('.js-bid-way')
    this.$jsRegisterDeadLine = $('.js-register-deadline')
    this.$jsInputPrice = $('.js-input-price')
    this.jsProjectName = '.js-project-name'
    this.$jsSelectBidType = $('.js-select-bid-type')
    this.$jsSpecialityId = $('.js-speciality-id')
    this.jsCheckedItem = '.js-speciality-container .js-checked-item'
    this.bindEvent()
  }

  bindEvent() {
    this.initForm()
    this.initSelect()
    this.getSpecialty()
    this.initDatePicker()
    this.initSelectMore()
    new CommonDatepicker(this.$jsFormBids)
    $(document).on('change', this.projectSelect, (evt) => this.selectProject(evt))
    this.$jsBidWay.on('change', (evt) => this.changeBidWay(evt))
    this.$jsInputPrice.on('input propertychange', (evt) => this.serializeInput(evt))
    this.$jsSelectBidType.on('change', () => this.initBidName())
    $(document).on('change', this.jsCheckedItem, () => this.initBidName())
  }

  //千分位
  serializeInput(evt) {
    const $self = $(evt.currentTarget)
    const val = $self.val().replace(/,/g, '')
    $self.val(val.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'))
  }

  initDatePicker() {
    $('.datepicker', this.$jsFormBids).datepicker()
    $('.datepicker-hour').datepickerHour()
  }

  initBidName() {
    const status = this.$jsBidName.data('init')
    const projectName = $(this.jsProjectName).val()
    const bidType = $('select[name=bidType] option:selected').val()
    const bidTypeName = $('select[name=bidType] option:selected').text()
    const speciality = $('.js-speciality-container .name:first').text()
    if (!status) {
      if (projectName && bidType && speciality) {
        const bidName = projectName + '_' + bidTypeName + '_' + speciality
        this.$jsBidName.val(bidName)
      }
    }
  }

  getSpecialty() {
    $.ajax({
      url: '/api/base-major/tree/1',
      type: 'GET',
      success: (data) => {
        new SelectTree('.js-speciality-container', data[0].children)
      }
    })
  }

  initSelectMore() {
    new SelectTree('.js-notice-container', bidsData)
  }

  initSelect() {
    const projectId = $.query.get('projectId') || $('.js-project-select option:first').val()
    this.renderProjectBase(projectId)
  }

  selectProject(evt) {
    const projectId = $(evt.currentTarget).find('option:selected').val()
    this.renderProjectBase(projectId)
  }

  renderProjectBase(projectId) {
    if (projectId) {
      $.ajax({
        url: `/api/bids/default?projectId=${projectId}`,
        method: 'GET',
        success: (data) => {
          this.$jsProjectBase.html(projectBaseTemplates(data))
          $('.js-company-name-input').val(data.bidCompany)
          this.initBidName()
        }
      })
    }
  }

  initForm() {
    this.$jsFormBids.off().validator({
      identifier: 'input[type=text],textarea,[required]',
      isErrorOnParent: true
    })
    this.$jsFormBids.on('submit', (evt) => this.submitBids(evt))
  }

  changeBidWay(evt) {
    if ($(evt.currentTarget).val() == 1) {
      this.$jsRegisterDeadLine.append(registerDeadlineTemplates())
      this.initForm()
      $('.datepicker-hour').datepickerHour()
    } else {
      this.$jsRegisterDeadLine.children().remove()
      this.initForm()
    }
  }

  submitBids(evt) {
    evt.preventDefault()
    const $self = $(evt.currentTarget)
    const bidsData = $self.serializeObject()
    bidsData.speciality = bidsData.speciality.split(',')
    bidsData.bidFileOperatorName = $self.find('select[name=bidFileOperatorId] option:selected').text()
    bidsData.tenderFinalistsOperatorName = $self.find('select[name=tenderFinalistsOperatorId] option:selected').text()
    bidsData.estimatedAmount = bidsData.estimatedAmount.replace(/,/g, '')
    bidsData.bidBonds = bidsData.bidBonds.replace(/,/g, '')
    const method = bidsData.id ? 'PUT' : 'POST'
    $.ajax({
      url: '/api/bids',
      method: method,
      data: JSON.stringify(bidsData),
      contentType: 'application/json',
      success: (data) => {
        new Modal({ icon: 'success', content: '保存成功' }).show(() => {
          window.location.href = `/developer/bids?projectId=${bidsData.projectId}`
        })
      },
    })
  }
}

module.exports = BidsManage

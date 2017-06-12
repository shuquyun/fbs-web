const openBidsPersonTemplates = Handlebars.partials['developer/bids/publish_answer/common/all_templates/_open_person'],
      openBidsDateTemplates = Handlebars.partials['developer/bids/publish_answer/common/all_templates/_open_date'],
      dateItemTemplates = Handlebars.templates['developer/bids/publish_answer/common/frontend_templates/date_item']
const Modal = require('pokeball').Modal
const SelectTree = require("developer/bids/select_tree/view")

class PublishAnswer {
  constructor($) {
    this.$jsOpenTypeSelect = $('.js-open-type-select')
    this.$jsSwitchGroup = $('.js-switch-group')
    this.$openBidsForm = $('.js-form-bids-open')
    this.$jsDateLineChange = $('.js-dateline-change')
    this.bindEvent()
  }

  bindEvent() {
    this.initForm()
    this.initSelectMore()
    this.initDatePicker()
    this.$jsOpenTypeSelect.on('change', (evt) => this.switchConfigContent(evt))
    this.$jsDateLineChange.on('click', (evt) => this.changeDateLine(evt))
    $(document).on('submit', '.js-form-bids-open', (evt) => this.submitOpenBidsForm(evt))
    $(document).on('confirm:link', (evt, id) => this.linkConfirmAttachment(evt, id))
    $(document).on('confirm:answerLink', (evt, id) => this.linkAnswerDetails(evt, id))
    this.initPersonInput()
  }

  initDatePicker() {
    $('.datepicker').datepicker({ minDate: new Date() })
    $('.datepicker-hour').datepickerHour()
  }

  linkConfirmAttachment(evt, id) {
    const bidId = $.query.get('bidId')
    window.open(`/developer/bids-details/supply-details?issuedId=${id}&bidId=${bidId}`)
  }

  linkAnswerDetails(evt, id) {
    const bidId = $.query.get('bidId')
    window.open(`/developer/bids-details/answer-details?answerId=${id}&bidId=${bidId}`)
  }

  initForm() {
    $('.js-form-bids-open').validator({
      isErrorOnParent: true
    })
  }

  initPersonInput() {
    const userData = this.$openBidsForm.data('users')
    const $jsBidsPerson = $('.js-bids-person-open')
    if ($jsBidsPerson.length) {
      const vals = ($jsBidsPerson.val()).split(',')
      const names = _.map(userData, (i) => {
        if (_.indexOf(vals, (i.userId).toString()) > -1) {
          return i.realName
        } else {
          return null
        }
      })
      $('.js-bids-person-open').val(_.compact(names))
    }
  }

  initSelectMore() {
    const userData = this.$openBidsForm.data('users')
    const data = _.map(userData, (i) => { return { id: i.userId, name: i.realName } })
    new SelectTree('.js-select-container', data)
  }

  //切换开标
  switchConfigContent(evt) {
    const $self = $(evt.currentTarget)
    const openType = $self.find('option:selected').val()
    if (openType == 1) {
      this.$jsSwitchGroup.html(openBidsDateTemplates())
      this.initDatePicker()
    } else {
      this.$jsSwitchGroup.html(openBidsPersonTemplates())
      this.initSelectMore()
    }
    this.initForm()
  }

  changeDateLine(evt) {
    const $self = $(evt.currentTarget)
    const title = $self.data('title')
    const name = $self.data('name')
    const date = $self.data('date')
    const id = this.$openBidsForm.find('input[name=id]').val()
    const bidId = $.query.get('bidId')
    new Modal(dateItemTemplates({ title, name, date, id, bidId })).show()
    this.initDatePicker()
    this.initDateForm()
  }

  initDateForm() {
    $('.js-form-date').off().validator({
      isErrorOnParent: true
    })
    $('.js-form-date').on('submit', (evt) => this.submitDate(evt))
  }

  submitDate(evt) {
    evt.preventDefault()
    const dateData = $(evt.currentTarget).serializeObject()
    this.sendAjax('PUT', dateData)
  }


  submitOpenBidsForm(evt) {
    evt.preventDefault()
    const configData = $(evt.currentTarget).serializeObject()
    this.sendAjax('POST', configData)
  }

  sendAjax(method, data) {
    const url = method === 'PUT' ? '/api/issued/bid' : '/api/bids/issue'
    $.ajax({
      url: url,
      method: method,
      data: JSON.stringify(data),
      contentType: 'application/json',
      success: () => {
        if (method === 'PUT') {
          window.location.reload()
        } else {
          new Modal({ icon: 'success', content: '发标成功' }).show(() => {
            window.location.href = `/developer/bids-details/open?bidId=${data.bidId}`
          })
        }
      }
    })
  }
}

module.exports = PublishAnswer

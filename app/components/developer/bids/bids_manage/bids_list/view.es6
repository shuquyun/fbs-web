const Modal = require('pokeball').Modal
const SelectTree = require("developer/bids/select_tree/view")
const MajorSelect = require('common/major_select/view')
const operatorItemTemplates = Handlebars.templates['developer/bids/bids_manage/bids_list/frontend_templates/operator']
class BidsList extends MajorSelect {
  constructor($) {
    super($)
    this.$jsProjectSubmit = $('.js-project-submit')
    this.$jsProjectId = $('.js-project-id')
    this.$jsBidsSubmit = $('.js-bids-submit')
    this.$jsTableBids = $('.js-table-bids')
    this.$jsOperatorChange = $('.js-operator-change')
    this.bindEvents()
  }

  bindEvents() {
    this.$jsProjectSubmit.on('click', (evt) => this.queryProject(evt))
    $(document).on('confirm:deleteBid', (evt,id) => this.deleteBids(evt,id))
    this.$jsOperatorChange.on('click', (evt) => this.changeOperator(evt))
  }

  //更变经办人
  changeOperator(evt) {
    const users = this.$jsTableBids.data('users')
    const bidId = $(evt.currentTarget).data('bidId')
    $.ajax({
      url: `/api/bids/${bidId}/operators`,
      method: 'GET',
      success: (data) => {
        new Modal(operatorItemTemplates({ data: _.extend(data, { users }) })).show()
        this.initSelect(data.costOperators)
        this.initForm()
      }
    })
  }

  initForm() {
    $('.js-form-operator').off().validator({
      isErrorOnParent: true
    })
    $('.js-form-operator').on('submit', (evt) => this.submitOperator(evt))
  }

  submitOperator(evt) {
    evt.preventDefault()
    const operatorData = $(evt.currentTarget).serializeObject()
    $.ajax({
      url: `/api/bids/${operatorData.bidId}/operators`,
      method: 'PUT',
      data: JSON.stringify(operatorData),
      contentType: 'application/json',
      success: () => {
        new Modal({ icon: 'success', content: '变更成功' }).show(() => {
          window.location.reload()
        })
      }
    })
  }

  initSelect(costperson) {
    $('.select').selectric()
    if (costperson) {
      const userData = this.$jsTableBids.data('users')
      const data = _.map(userData, (i) => {
        return { id: i.userId, name: i.realName }
      })
      new SelectTree('.js-select-container', data)
    }
  }

  queryProject(evt) {
    const $self = $(evt.currentTarget)
    this.$jsProjectId.val($self.data('projectid'))
    this.$jsBidsSubmit.trigger('click')
  }

  //delete bids query:bidId
  deleteBids(evt, id) {
    $.ajax({
      url: `/api/bids/${id}`,
      type: 'DELETE',
      success: () => {
        new Modal({ icon: 'success', content: '删除成功' }).show(() => {
          window.location.reload()
        })
      }
    })
  }
}

module.exports = BidsList

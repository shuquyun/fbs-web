const Modal = require('pokeball').Modal
const configItemTemplates = Handlebars.partials['developer/company/approval_manage/common/all_templates/_config_item'],
      configTemplates = Handlebars.templates['developer/company/approval_manage/common/frontend_templates/config'],
      itemTrTemplates = Handlebars.partials['developer/company/approval_manage/common/all_templates/_item_tr'],
      copyFlowTemplates = Handlebars.templates['developer/company/approval_manage/common/frontend_templates/copy'],
      flowTableTemplates = Handlebars.partials['developer/company/approval_manage/common/all_templates/_flow']
const SelectTree = require("developer/bids/select_tree/view")
class ApprovalCommon {
  constructor($) {
    this.jsFlowDelete = '.js-flow-delete'
    this.$jsFormFlow = $('.js-form-flow')
    this.$jsFlowAdd = $('.js-flow-add')
    this.$tableTask = $('.table-task')
    this.jsApprovalPersonAdd = '.js-approval-person-add'
    this.jsCheckboxSelect = '.js-checked-item'
    this.jsFlowEdit = '.js-flow-edit'
    this.$jsFlowCopy = $('.js-flow-copy')
    this.$jsFlowTable = $('.js-table-flow')
    this.jsConfigItemDelete = '.js-config-item-delete'
    this.jsFlowItemTr = '.js-flow-item-tr'
    this.bindEvent()
  }

  bindEvent() {
    this.initForm(this.$jsFormFlow)
    $(document).on('click', this.jsFlowDelete, (evt) => this.deleteFlow(evt))
    this.$jsFlowAdd.on('click', (evt) => this.addFlowItem(evt))
    $(document).on('confirm:cancelApproval', () => this.cancelLast())
    this.$jsFormFlow.on('submit', (evt) => this.submitFLow(evt))
    $(document).on('submit', '.js-form-flow-item', (evt) => this.submitFlowItem(evt))
    $(document).on('click', this.jsApprovalPersonAdd, (evt) => this.addApprovalPerson(evt))
    $(document).on('change', this.jsCheckboxSelect, (evt) => this.checkDropDownSelect(evt))
    $(document).on('click', '.js-select-delete', (evt) => this.showDropDownSelectItem(evt))
    $(document).on('change', '.js-select-approval-person', () => this.checkSelectOption())
    $(document).on('click', this.jsFlowEdit, (evt) => this.editFlow(evt))
    this.$jsFlowCopy.on('click', (evt) => this.copyFlow(evt))
    $(document).on('confirm:copy', () => this.confirmCopyFlow())
    $(window).on("beforeunload", evt => this.windowBeforeLoad(evt))
    $(document).on('click', this.jsConfigItemDelete, (evt) => this.deleteConfigItem(evt))
    $(document).on('click', this.jsFlowItemTr, (evt) => this.toggleItemTr(evt))
  }

  windowBeforeLoad(evt) {
    return '你确定离开本页面吗？离开保存的数据将丢失！'
  }

  toggleItemTr(evt) {
    const $self = $(evt.currentTarget)
    $self.toggleClass('active')
    $(this.jsFlowItemTr).not($self).removeClass('active')
  }

  confirmLeave () {
    $(window).off("beforeunload")
  }

  initForm($form) {
    $form.validator({
      isErrorOnParent: true
    })
  }

  //submit flow
  submitFLow(evt) {
    evt.preventDefault()
    const data = $(evt.currentTarget).serializeObject()
    data.taskList = this.organizeFlowData()
    const method = data.id ? 'PUT' : 'POST'
    if (data.taskList.length) {
      $.ajax({
        url: '/api/company/approval/flows',
        method: method,
        data: JSON.stringify(data),
        contentType: 'application/json',
        success: () => {
          this.confirmLeave()
          new Modal({ icon: 'success', content: '提交成功' }).show(() => {
            window.location.href = '/developer/approval'
          })
        }
      })
    } else {
      new Modal({ icon: 'warning', content: '请添加配置' }).show()
    }
  }

  organizeFlowData() {
    return _.map(this.$jsFormFlow.find('.js-flow-item-tr'), (i) => {
      return $(i).find('.js-flow-edit').data('flows')
    })
  }

  initItemIndex() {
   _.each($('.js-flow-item-tr'), (i, key) => {
      $(i).find('.index-td').text(key + 1)
      $(i).attr('index', key + 1)
    })
  }

  submitFlowItem(evt) {
    evt.preventDefault()
    const $self = $(evt.currentTarget)
    const type = $self.data('type')
    const data = $self.serializeObject()
    data.defaultApproverName = $self.find('select[name=defaultApproverId] option:selected').text()
    data.conditionApproverList = this.organizeConfigData($self)
    if (type === 'down') {
      if (data.index > 1) {
        $(`.js-flow-item-tr[index=${data.index - 1}]`).after(itemTrTemplates(data))
        this.initItemIndex()
      } else {
        $('.js-table-body').html(itemTrTemplates(data))
      }
    } else if (type === 'up') {
      if ($(`.js-flow-item-tr[index=${data.index}]`).length) {
        $(`.js-flow-item-tr[index=${data.index}]`).before(itemTrTemplates(data))
        this.initItemIndex()
      } else {
        $('.js-table-body').html(itemTrTemplates(data))
      }
    } else {
      $(`.js-flow-item-tr[index=${data.index}]`).remove()
      if (data.index == 1) {
        if ($('.js-table-body').find('.js-flow-item-tr').length) {
          $(`.js-flow-item-tr[index=${parseInt(data.index) + 1}]`).before(itemTrTemplates(data))
        } else {
          $('.js-table-body').html(itemTrTemplates(data))
        }
      } else {
        $(`.js-flow-item-tr[index=${parseInt(data.index) - 1}]`).after(itemTrTemplates(data))
      }
    }
    this.configModal.close()
    $(window).on("beforeunload", evt => this.windowBeforeLoad(evt))
  }

  organizeConfigData($form) {
    return _.map($form.find('.js-config-item'), (i) => {
      const userId = $(i).find('select[name=userId] option:selected').val()
      const userName = $(i).find('select[name=userId] option:selected').text()
      const taskApproverList = _.map($(i).find('.js-checked-item:checked'), (k) => {
        return { projectId: $(k).data('id'), projectName: $(k).closest('.js-tree-item').data('name') }
      })
      return { userId, userName, taskApproverList }
    })
  }

  //返回上个页面
  cancelLast() {
    this.confirmLeave()
    window.location.href = '/developer/approval'
  }

  checkSelectOption() {
    $('.selectric-js-select-approval-person').find('.selectric-items li').show()
    this.initSelectOption()
  }

  initSelectOption() {
    _.each($('.js-select-approval-person'), (i) => {
      const $self = $(i)
      const index = $self.find('option:selected').data('index')
      $('.js-select-approval-person').not($self).closest('.selectric-js-select-approval-person').find(`.selectric-items li[data-index=${index}]`).hide()
    })
  }

  showDropDownSelectItem(evt) {
    const id = $(evt.currentTarget).closest('.dropdown-item').data('id')
    $(`.js-tree-item[data-id=${id}]`).closest('li').show()
  }

  checkDropDownSelect(evt) {
    const $self = $(evt.currentTarget)
    const id = $self.data('id')
    const $dropdown = $self.closest('.js-show-container')
    if ($self.prop('checked')) {
      $('.js-show-container').not($dropdown).find(`.js-checked-item[data-id=${id}]`).closest('li').hide()
    } else {
      $(`.js-checked-item[data-id=${id}]`).closest('li').show()
    }
  }

  //添加独立审批人
  addApprovalPerson(evt) {
    const companyUser = this.getCompanyData()
    $(evt.currentTarget).closest('.control-group').before(configItemTemplates({ companyUser }))
    this.initSelectMore()
    this.initDropdownMore($(evt.currentTarget).closest('.control-group').prev('.js-config-item').find('.js-select-container'))
    this.checkSelectOption()
    this.initForm($('.js-form-flow-item'))
  }

  addFlowItem(evt) {
    const companyUser = this.getCompanyData()
    const type = $(evt.currentTarget).data('type')
    const index = this.getIndexData(type)
    if (index) {
      this.configModal = new Modal(configTemplates({ companyUser, index, type }))
      this.configModal.show()
      this.initForm($('.js-form-flow-item'))
      this.initSelectMore()
      this.initDropdownMore($('.js-select-container'))
    } else {
      new Modal({ icon: 'warning', content: '点击选择目标行' }).show()
    }
  }

  initDropdownMore($input) {
    const projectData = this.getProjectsData()
    _.each($input, (i) => {
      new SelectTree(i, projectData)
    })
    this.hideCurrentDropMore($input)
  }

  hideCurrentDropMore($input) {
    _.each($('.js-checked-item:checked'), (i) => {
      const id = $(i).data('id')
      $input.find(`.js-tree-item[data-id=${id}]`).closest('li').hide()
    })
  }

  showSiblingsDropMore($input) {
    _.each($input.closest('.js-config-item').find('.js-checked-item:checked'), (i) => {
      const id = $(i).data('id')
      $(`.js-tree-item[data-id=${id}]`).closest('li').show()
    })
  }

  initSelectMore() {
    $('.selectric').selectric()
  }

  //get flow item data
  getProjectsData() {
    return _.map(this.$jsFormFlow.data('projects'), (i) => { return { id: i.id, name: i.name }})
  }

  getIndexData(type) {
    if (this.$tableTask.find('.js-flow-item-tr').length) {
      const index = parseInt(this.$tableTask.find('.js-flow-item-tr.active').attr('index'))
      if (type === 'up') {
        return index
      } else {
        return index + 1
      }
    } else {
      return 1
    }
  }

  //获取数据
  getCompanyData() {
    return this.$jsFormFlow.data('users')
  }

  editFlow(evt) {
    const $self = $(evt.currentTarget)
    const flows = $self.data('flows')
    flows.index = $self.attr('index')
    _.each(flows.conditionApproverList, (i) => {
      i.projectsList = _.map(i.taskApproverList, (k) => { return k.projectId }).join(',')
    })
    const companyUser = this.getCompanyData()
    this.configModal = new Modal(configTemplates({ companyUser, flows, type: 'edit' }))
    this.configModal.show()
    this.initForm($('.js-form-flow-item'))
    this.initSelectMore()
    this.initDropdownMore($('.js-select-container'))
    this.checkSelectOption()
  }

  deleteConfigItem(evt) {
    this.confirmLeave()
    const $self = $(evt.currentTarget)
    this.showSiblingsDropMore($self)
    $self.closest('.js-config-item').remove()
    this.checkSelectOption()
  }

  deleteFlow(evt) {
    $(evt.currentTarget).closest('.js-flow-item-tr').remove()
    this.initItemIndex()
  }

  copyFlow(evt) {
    const approvals = $(evt.currentTarget).data('approvals')
    this.copyModal = new Modal(copyFlowTemplates({ approvals }))
    this.copyModal.show()
    this.initSelectMore()
  }

  confirmCopyFlow() {
    const flowid = $('.js-flow-copy-select option:selected').val()
    flowid && $.ajax({
      url: `/api/company/approval/flows/${flowid}/tasks`,
      method: 'GET',
      success: (data) => {
        this.copyModal.close()
        this.$jsFlowTable.html(flowTableTemplates({ taskList: data }))
      }
    })
  }
}

module.exports = ApprovalCommon

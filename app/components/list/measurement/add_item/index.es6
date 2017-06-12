const Modal = require('pokeball/components/modal');
const taxesFormTemplates = Handlebars.templates['list/measurement/frontend_templates/form_modal_safe'];
const tableItem = Handlebars.templates['list/measurement/frontend_templates/table_item'];

class AddItem{
  constructor(options) {
    this.$wrap = options.el;
    this.templates = options.templates;
    this.$table = $('.js-table tbody');

    this.getValuationBase();
    if (options.type === 'safe') {
      this.getConfigItem();
    }

    this.getTableData();
    this.bindEvt();
  }

  getTableData() {
    $.ajax({
      url: '/api/bill-fees/' + $.query.get('tag'),
      data: { cateId: window.location.hash.split('#')[1] }
    }).done( result => {
      this.$table.append(tableItem({table: result}))
    })
  }

  bindEvt() {
    const wrapEl = this.$wrap;

    wrapEl.on('click', '.js-add-btn', e => this.addItem());

    wrapEl.on('click', '.js-edit-btn', e => this.editItem(e));

    wrapEl.on('click', '.js-delete-btn', e => this.deleteItem(e));

    $(document).on('click', '.js-submit', e => {
      $(e.target).parents('.modal').find('form').trigger('submit');
    })

    $(document).on('submit', '.modal form', e => this.createItem(e));
  }

  getValuationBase() {
    $.ajax({
      url: '/api/bill-fees/enum/2'
    }).done((result) => {
      this.valuationBase = result;
    })
  }

  getConfigItem() {
    $.ajax({
      url: '/api/bill-fees/base/2'
    }).done(result => {
      this.configItem = result;
    })
  }

  addItem() {
    this.submitType = 'new';
    this.renderForm({})
  }

  renderForm(data) {
    Object.assign(data, {
      valuationBase: this.valuationBase,
      configItem: this.configItem
    })
    this.modal = new Modal(this.templates(data));
    this.modal.show();
    const $modal = $(this.modal.modal)
    $modal.find('select').selectric();
    $modal.find('form').validator();
    if (data.valuationBasicMap) {
      this.resolveValuation(data.valuationBasicMap);
    }
  }

  editItem(e) {
    const $tr = $(e.target).parents('tr');
    const value = $tr.data('value');

    this.editId = value.id;
    this.submitType = 'edit';
    this.editEl = $tr;
    this.renderForm(value);
  }

  deleteItem(e) {
    const $tr = $(e.target).parents('tr');
    const value = $tr.data('value');

    $.ajax({
      url: '/api/bill-fees/' + value.id,
      type: 'DELETE'
    }).done(result => {
      if (result) {
        $tr.remove();
      }
    })
  }

  createItem(e) {
    e.preventDefault();
    const $form = $(e.target);
    // this.resolveSubmitData($form.serializeArray())
    $.ajax({
      url: '/api/bill-fees',
      type: this.submitType === 'new' ? 'POST' : 'PUT',
      data: JSON.stringify(this.resolveSubmitData($form.serializeArray())),
      contentType: 'application/json'
    }).done(result => {
      console.log('create: ', result)
      if (this.submitType === 'new') {
        this.$table.append(tableItem({table: [result]}))
      } else {
        this.editEl.replaceWith(tableItem({table: [this.resolveSubmitData($form.serializeArray())]}))
      }
      this.modal.close();
    })
  }

  resolveSubmitData(data) {
    const param = {
      type: 2,
      cateId: window.location.hash.split('#')[1],
      billSheetId: $.query.get('tag')
    }

    if (this.submitType === 'edit') {
      param.id = this.editId;
    }

    param.valuationBasicMap = {};
    for (let item of data) {
      if (item.name === 'valuation') {
        param.valuationBasicMap[item.value.split(':')[0]] = item.value.split(':')[1]
      } else {
        param[item.name] = item.value
      }
    }
    param.valuationBasic = JSON.stringify(param.valuationBasicMap)
    return param
  }

  resolveValuation(list) {
    Object.keys(list).map( key => $(`[data-role=${list[key]}]`).trigger('click'))
  }
}

module.exports = AddItem;

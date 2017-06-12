const AddItem = require('../add_item');
const taxesFormTemplates = Handlebars.templates['list/measurement/frontend_templates/form_modal_taxes'];

class Taxes{
  constructor() {
    // this.bindEvt();
    this.addItem();
  }

  bindEvt() {
    $(document).on('change', '.form input[type=radio]', e => {
      $('.js-new-config').toggleClass('hide')
    })
    $(document).on('change', '.form select', e => {
      let value = $(e.target).val();

      if (value != -1) {
        value = JSON.parse(value);
        value.projectName = value.name;
        this.addItem.renderForm(value);
      }
    })
  }

  addItem() {
    this.addItem = new AddItem({
      el: $('.component-list-measurement-taxes'),
      type: 'taxes',
      templates: taxesFormTemplates
    })
  }
}

module.exports = Taxes

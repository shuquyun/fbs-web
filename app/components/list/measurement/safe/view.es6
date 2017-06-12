const AddItem = require('../add_item');
const safeFormTemplates = Handlebars.templates['list/measurement/frontend_templates/form_modal_safe'];

class Safe{
  constructor() {
    this.bindEvt();
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
      el: $('.component-list-measurement-safe'),
      type: 'safe',
      templates: safeFormTemplates
    })
  }
}
module.exports = Safe

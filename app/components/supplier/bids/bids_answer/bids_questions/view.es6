const contentShowTemplates = Handlebars.templates['developer/bids/publish_answer/answer_details/frontend_templates/content_show']
const Modal = require('pokeball').Modal

class SupplierBidQuestions {
  constructor($) {
    this.$jsContentShow = $('.js-content-show')
    this.$jsQuestionDelete = $('.js-question-delete')
    this.bindEvent()
  }

  bindEvent() {
    this.$jsContentShow.on('click', (evt) => this.showContent(evt))
    this.$jsQuestionDelete.on('click', (evt) => this.deleteQuestion(evt))
  }

  deleteQuestion(evt) {
    const id = $(evt.currentTarget).data('id')
    $.ajax({
      url: ` /api/questions/${id}`,
      method: 'DELETE',
      success: () => {
        window.location.reload()
      }
    })
  }

  showContent(evt) {
    const $self = $(evt.currentTarget)
    const id = $self.data('id')
    $.ajax({
      url: `/api/questions/${id}`,
      method: 'GET',
      success: (data) => {
        new Modal(contentShowTemplates(data)).show()
      }
    })
  }
}

module.exports = SupplierBidQuestions

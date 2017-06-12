const Modal = require('pokeball').Modal

class SupplierQestionCreate {
  constructor($) {
    this.$jsQuestionForm = $('.js-form-question')
    this.bindEvent()
  }

  bindEvent() {
    this.initForm()
    $(document).on('confirm:cancel', () => this.cancelAnswer())
  }

  initForm() {
    this.$jsQuestionForm.validator({
      isErrorOnParent: true
    })
    this.$jsQuestionForm.on('submit', (evt) => this.submitQuestion(evt))
  }

  cancelAnswer() {
    const id = $.query.get('id')
    const bidId = $.query.get('bidId')
    window.location.href = `/supplier/bids-details/answer-file?bidId=${bidId}&id=${id}`
  }

  submitQuestion(evt) {
    evt.preventDefault()
    const question = $(evt.currentTarget).serializeObject()
    const supplierId = $.query.get('supplierId')
    question.content = $("#iframe-whsihtml5").contents().find("body").html()
    const method = question.id ? 'PUT' : 'POST'
    if (question.content) {
      $.ajax({
        url: '/api/questions',
        method: method,
        data: JSON.stringify(question),
        contentType: 'application/json',
        success: () => {
          window.location.href = `/supplier/bids-details/answer-file?bidId=${question.bidId}&id=${supplierId}`
        }
      })
    } else {
      new Modal({ icon: 'warning', content: '请填写问题内容' }).show()
    }
  }
}

module.exports = SupplierQestionCreate

const BidsSupplyDetails = require('developer/bids/publish_answer/supply_details/view')
const confirmFileTemplates = Handlebars.templates['developer/bids/publish_answer/answer_details/frontend_templates/confirm_file'],
      contentShowTemplates = Handlebars.templates['developer/bids/publish_answer/answer_details/frontend_templates/content_show']
const Modal = require('pokeball').Modal
class BidsAnswerDetails extends BidsSupplyDetails {
  constructor($) {
    super($)
    this.fileAnswerSubmit = '.js-answer-file-submit'
    this.$jsContentShow = $('.js-content-show')
    this.$jsQuestionChange = $('.js-question-type-change')
    this.$jsListNeed = $('.js-list-answer-need')
    this.bindEvents()
  }

  bindEvents() {
    $(document).on('click', this.fileAnswerSubmit, (evt) => this.submitAnswerFile(evt))
    this.$jsContentShow.on('click', (evt) => this.showContent(evt))
    this.$jsQuestionChange.on('click', (evt) => this.changeQuestionType(evt))
    this.$jsListNeed.on('click', (evt) => this.needListAnswerCreate(evt))
  }

  //需创建答疑清单
  needListAnswerCreate(evt) {
    const id = $(evt.currentTarget).data('id')
    $.ajax({
      url: `/api/bids/answers/${id}?status=1`,
      method: 'PUT',
      success: () => {
        $('.js-list-answer-create').removeClass('hide')
      }
    })
  }

  //改变问题类型
  changeQuestionType(evt) {
    const $self = $(evt.currentTarget)
    const type = $self.data('type')
    const id = $self.data('id')
    const $select = $self.closest('.js-question-type').find('select')
    if (type == 0) {
      this.changeType(id, $select.val(), $self, $select)
    } else {
      $self.text('确定')
      $self.data('type', 0)
      $select.attr('disabled', false)
      $select.selectric('refresh')
    }
  }

  changeType(id, type, $self, $select) {
    $.ajax({
      url: `/api/questions/${id}/type/${type}`,
      method: 'PUT',
      success: () => {
        $self.text('修改')
        $self.data('type', 1)
        $select.attr('disabled', true)
        $select.selectric('refresh')
      }
    })
  }

  showContent(evt) {
    const $self = $(evt.currentTarget)
    const id = $self.data('id')
    const type = $self.data('type')
    $.ajax({
      url: `/api/questions/${id}`,
      method: 'GET',
      success: (data) => {
        new Modal(contentShowTemplates(data)).show()
      }
    })
  }

  submitAnswerFile(evt) {
    const issuedBidId = $.query.get('answerId')
    const bidId = $(evt.currentTarget).data('bidId')
    const needApprove = this.$jsApprovalStatus.data('needApprove')
    $.ajax({
      url: '/api/issued/answer/files/submit',
      method: 'POST',
      data: JSON.stringify({ issuedBidId, bidId }),
      contentType: 'application/json',
      success: () => {
        if (needApprove) {
          new Modal({ icon: 'success', content: '提交成功，等待审批' }).show(() => {
            window.location.reload()
          })
        } else {
          window.location.href = `/developer/bids-details/publish-answer?bidId=${bidId}`
        }
      }
    })
  }

  confirmBidsFile(evt) {
    const files = $(evt.currentTarget).data('file')
    if (files.answerReplyFiles.length || files.answerAccessory.length || $('.js-list-tr').length) {
      new Modal(confirmFileTemplates(files)).show()
    } else {
      new Modal({ icon: 'warning', content: '请上传附件或发布清单！' }).show()
    }
  }
}

module.exports = BidsAnswerDetails

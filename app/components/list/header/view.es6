class ListHeader{
  constructor() {
    this.setHref()
  }

  setHref() {
    const $nav = $('.js-nav');

    const id = $.query.get('billId');
    if (!!id) {
      $.ajax({
        url: `/api/bill-sheets/${id}`
      }).done(result => {
        const tagId = result[0].id;
        $nav.find('[data-header=edit] a').attr('href', `/list/edit/division?bidId=${$.query.get('bidId')}&billId=${$.query.get('billId')}&tag=${tagId}`)
      })
    }
  }
}

module.exports = ListHeader

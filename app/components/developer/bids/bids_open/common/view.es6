const Modal = require('pokeball').Modal
class BidsOpen {
  constructor($) {
    this.$jsBidsOpen = $('.js-bids-open')
    this.$jsTableSupplier = $('.js-table-supplier')
    this.$jsTimeContent = $('.js-time-content')
    this.bindEvent()
  }

  bindEvent() {
    this.$jsBidsOpen.on('click', (evt) => this.openBids(evt))
    this.initCountTime()
  }

  initCountTime() {
    const autodate = this.$jsTimeContent.data('autodate')
    if (this.$jsTimeContent.length) {
      const total = Math.floor((autodate - (new Date()).getTime()) / 1000)
      this.runingTime(total, this.$jsTimeContent.find('.time-show'))
    }
  }

  runingTime(total, $self) {
    setInterval(() => {
      if (total === 0) {
        const bidId = $.query.get('bidId')
        window.location.href = `/developer/bids-details/evaluate?bidId=${bidId}`
      }
      const day = Math.floor (total / ( 24 * 60 * 60 ))
      const hT = total % ( 24 * 60 * 60 )
      const h = Math.floor (hT / ( 60 * 60 ))
      const mT = hT % ( 60 * 60 )
      const m = Math.floor (mT / 60)
      const s = mT % 60
      $self.text(`${day} 天 ${h} 小时 ${m} 分钟 ${s} 秒`)
      total -= 1
    }, 1000)
  }

  openBids(evt) {
    const $self = $(evt.currentTarget)
    const type = $self.data('type')
    const lastTech = $self.data('lastTech')
    const lastCommer = $self.data('lastCommer')
    const bidId = $.query.get('bidId')
    const openBidStatus = type == 1 ? (lastCommer > 1 ? false : true) : ((lastCommer === 0) && (lastTech === 1) ? true : false)
    if (this.$jsTableSupplier.find('.js-item-tr').length) {
      $.ajax({
        url: `/api/bids/${bidId}/open?type=${type}`,
        method: 'PUT',
        success: () => {
          if (openBidStatus) {
            window.location.href = `/developer/bids-details/evaluate?bidId=${bidId}`
          } else {
            new Modal({ icon: 'success', content: '开标成功' }).show(() => {
              window.location.reload()
            })
          }
        }
      })
    } else {
      new Modal({ icon: 'warning', content: '暂无入围供应商，不可开标！' }).show()
    }
  }
}

module.exports = BidsOpen

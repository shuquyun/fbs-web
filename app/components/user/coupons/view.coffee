###
  用户优惠券列表组件
  author by terminus.io (zl)
###
Pagination = require "pokeball/components/pagination"

class Coupons

  constructor: ($)->
    @bindEvent()

  bindEvent: ->
    pageSize = if _.isNumber($.query.get("pageSize")) then $.query.get("pageSize") else 20
    new Pagination(".coupon-pagination").total($(".coupon-pagination").data("total")).show(pageSize, {num_display_entries: 5, jump_switch: true, page_size_switch: true, maxPage: -1})

module.exports = Coupons

Modal = require("pokeball").Modal

class CouponA
  constructor: ($)->
    @$target = @$el
    @couponBtn = @$target.find("a")
    @bindEvent()

  bindEvent: ->
    @couponBtn.on "click", @getCoupon

  # 领取优惠券
  getCoupon: =>
    id = @couponBtn.data("id")
    $.ajax
      url: "/api/coupon/#{id}/receive"
      type: "POST"
      contentType: "application/json"
      success: (data)=>
        new Modal
         "icon": if data then "success" else "error"
         "title": if data then  "领取成功" else "领取失败"
         "content": if data then "领取成功 可以放肆买买买啦" else "领取优惠券失败，请稍后再试"
        .show()

module.exports = CouponA

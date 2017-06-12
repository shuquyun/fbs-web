###
  营销活动创建组件
  author by terminus.io (zl)
###
Tip = require "common/tip_and_alert/view"
Modal = require("pokeball").Modal
CommonDatepicker = require("utils/module").plugins.commonDatepicker

class CouponCreate

  that = this

  constructor: ($)->
    @couponEditForm = "#coupon-form"
    @bindEvent()

  bindEvent: ->
    that = this
    $(".datepickerIpt").datepicker()
    new CommonDatepicker(@$el)
    $(@couponEditForm).validator
      isErrorOnParent: true
    $(@couponEditForm).on "submit",@submitCoupon

  deformatPrice: (price)=>
    if price is NaN
      price = null
    else
      price *= 100
    price

  #提交优惠券信息
  submitCoupon: (evt)=>
    evt.preventDefault()
    couponInfo = {}
    if $("#coupon-form").data("promotionid")
      couponInfo.id = $("#coupon-form").data("promotionid")
    couponInfo.skuScopeParams = {}
    couponInfo.conditionParams = {}
    couponInfo.behaviorParams = {}
    couponInfo.extra = {}
    couponInfo.skuScopeParams.type = $("#coupon-form").data("type")
    couponInfo.promotionDefId = $("#coupon-form").data("promotiondefid")
    couponInfo.name = $("#coupon-form").find("[name=name]").val()
    couponInfo.startAt = $("#coupon-form").find("[name=startAt]").val()
    couponInfo.endAt = $("#coupon-form").find("[name=endAt]").val()
    couponInfo.conditionParams.conditionFee = @deformatPrice(parseInt $("#coupon-form [name=conditionFee]").val())
    couponInfo.behaviorParams.reduceFee = @deformatPrice(parseInt $("#coupon-form").find("[name=reduceFee]").val())
    couponInfo.extra.sendLimit = parseInt $("#coupon-form [name=sendLimit]").val()
    couponInfo.extra.receiveLimit = parseInt $("#coupon-form [name=receiveLimit]").val()
    couponInfo.skuScopeParams.skuIds = $("#coupon-form [name=skuIds]").data("skuids").join(",") if couponInfo.skuScopeParams.type is 1
    couponInfo.skuScopeParams.itemIds = $("#coupon-form [name=itemIds]").data("itemids").join(",") if couponInfo.skuScopeParams.type is 1

    if !couponInfo.skuScopeParams.skuIds and couponInfo.skuScopeParams.type is 1
      new Modal
        "icon": "error"
        "title": "保存失败"
        "content": "请添加适用商品"
      .show()
      return false

    if couponInfo.skuScopeParams.type is 1
      couponInfo.skuScopeParams.type = "include"
    else
      delete couponInfo.skuScopeParams.type

    if  couponInfo.extra.sendLimit < couponInfo.extra.receiveLimit
      new Modal
        "icon": "error"
        "title": "保存失败"
        "content": "领取优惠券总数不能大于发放总数"
      .show()
      return false

    if couponInfo.conditionParams.conditionFee < couponInfo.behaviorParams.reduceFee
      new Modal
        "icon": "error"
        "title": "保存失败"
        "content": "面值金额不能大于使用条件金额"
      .show()
      return false

    $.ajax
      url: "/api/seller/promotion"
      type: if couponInfo.id then "PUT" else "POST"
      data: JSON.stringify couponInfo
      contentType: "application/json"
      success: (data) ->
        window.location.href = "/seller/marketing/activity-management?type=#{$("#coupon-form").data("type")}&promotionDefId=#{couponInfo.promotionDefId}"

module.exports = CouponCreate

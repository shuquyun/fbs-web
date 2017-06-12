###
  营销活动创建组件
  author by terminus.io (zl)
###
Tip = require "common/tip_and_alert/view"
Modal = require("pokeball").Modal
couponEditTemplate = Handlebars.templates["shop/marketing/activity_create/frontend_templates/coupon_edit"]

class ActivityCreate

  that = this

  constructor: ($)->
    @createBtn = $(".create")
    @couponEditForm = "#coupon-form"
    @bindEvent()

  bindEvent: ->
    that = this
    @createBtn.on "click", @createFn

  createFn: (evt)=>
    data = $(evt.currentTarget).data("activity")
    if data.promotionDef.type is 1
      new Modal(couponEditTemplate({promotionDefId: data.id})).show()
      @formCouponInit()

  formCouponInit: (addressData) =>
    $(".datepicker").datepicker()
    @changeCouponType()
    @changeIsPerFee()
    @changeSendLimit()
    $("[name=type]").on "click", @changeCouponType
    $("[name=isPerFee]").on "click", @changeIsPerFee
    $("[name=sendLimit]").on "click", @changeSendLimit
    $(document).on "submit", @couponEditForm, @submitCoupon

  changeCouponType: =>
    type = parseInt $("[name=type]:checked").val()
    if type is 1
      $(".sp.types .sp").find("[name=skuIds]").removeAttr("required")
    else
      $(".sp.types .sp").eq(type-2).find("[name=skuIds]").attr("required", "required").end().siblings().find("[name=skuIds]").removeAttr("required")

  changeIsPerFee: =>
    isPerFee = parseInt $("[name=isPerFee]:checked").val()
    $(".sp.isPerFee .sp").find("[name=conditionFee]").removeAttr("required")
    $(".sp.isPerFee .sp").find("[name=conditionFee]").eq(isPerFee).attr("required", "required")

  changeSendLimit: =>
    sendLimit = parseInt $("[name=sendLimit]:checked").val()
    $(".sp.sendLimit .sp").find("[name=total]").removeAttr("required")
    $(".sp.sendLimit .sp").find("[name=total]").attr("required", "required") if sendLimit is 1

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
    couponInfo.skuScopeParams = {}
    couponInfo.conditionParams = {}
    couponInfo.behaviorParams = {}
    couponInfo.extra = {}
    couponInfo.promotionDefId = $("#coupon-form").data("promotiondefid")
    couponInfo.name = $("#coupon-form").find("[name=name]").val()
    couponInfo.startAt = $("#coupon-form").find("[name=startAt]").val()
    couponInfo.endAt = $("#coupon-form").find("[name=endAt]").val()
    couponInfo.skuScopeParams.type = parseInt $("#coupon-form [name=type]:checked").val()
    couponInfo.skuScopeParams.skuIds = $("#coupon-form [name=type]:checked").parent().find("[name=skuIds]").val() if couponInfo.skuScopeParams.type isnt 1
    couponInfo.conditionParams.isPerFee = parseInt $("#coupon-form [name=isPerFee]:checked").val()
    couponInfo.conditionParams.conditionFee = @deformatPrice(parseInt $("#coupon-form [name=isPerFee]:checked").parent().find("[name=conditionFee]").val())
    couponInfo.behaviorParams.perFee = @deformatPrice(parseInt $("#coupon-form [name=conditionFee]").eq(1).val())
    couponInfo.behaviorParams.reduceFee = @deformatPrice(parseInt $("#coupon-form").find("[name=reduceFee]").val())
    couponInfo.extra.sendLimit = parseInt $("#coupon-form [name=sendLimit]:checked").val()
    couponInfo.extra.total = parseInt $("#coupon-form [name=total]").val()
    couponInfo.extra.receiveLimit = parseInt $("#coupon-form [name=receiveLimit]").val()

    $.ajax
      url: "/api/seller/promotion"
      type: "POST"
      data: JSON.stringify couponInfo
      contentType: "application/json"
      success: (data) ->
        window.location.href = "/seller/marketing/activities?type=1"

module.exports = ActivityCreate

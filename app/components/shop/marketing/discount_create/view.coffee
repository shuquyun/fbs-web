###
  营销活动创建组件
  author by terminus.io (zl)
###
Tip = require "common/tip_and_alert/view"
Modal = require("pokeball").Modal
CommonDatepicker = require("utils/module").plugins.commonDatepicker

class DiscountCreate

  that = this

  constructor: ($)->
    @discountEditForm = "#discount-form"
    @bindEvent()

  bindEvent: ->
    that = this
    $(".datepickerIpt").datepicker()
    new CommonDatepicker(@$el)
    $(@discountEditForm).validator
      isErrorOnParent: true
    $(@discountEditForm).on "submit",@submitDiscount

  deformatPrice: (price)=>
    if price is NaN
      price = null
    else
      price *= 100
    price

  #提交优惠券信息
  submitDiscount: (evt)=>
    evt.preventDefault()
    discountInfo = {}
    if $("#discount-form").data("promotionid")
      discountInfo.id = $("#discount-form").data("promotionid")
    discountInfo.skuScopeParams = {}
    discountInfo.conditionParams = {}
    discountInfo.behaviorParams = {}
    discountInfo.extra = {}
    discountInfo.skuScopeParams.type = "include"
    discountInfo.promotionDefId = $("#discount-form").data("promotiondefid")
    discountInfo.name = $("#discount-form").find("[name=name]").val()
    discountInfo.startAt = $("#discount-form").find("[name=startAt]").val()
    discountInfo.endAt = $("#discount-form").find("[name=endAt]").val()
    discountInfo.skuScopeParams.skuIds = $("#discount-form [name=skuIds]").data("skuids").join(",")
    discountInfo.skuScopeParams.itemIds = $("#discount-form [name=itemIds]").data("itemids").join(",")
    discountInfo.behaviorParams.skusWithDiscount = JSON.stringify $("#discount-form [name=skusWithDiscount]").data("skuswithdiscount")
    itemSkus = $("#discount-form [name=itemSkus]").data("itemskus")

    isAllSkuSet = true
    $.each itemSkus, (n,v)=>
      if !v.skuIds.length
        isAllSkuSet = false

    if !discountInfo.skuScopeParams.skuIds or !isAllSkuSet
      new Modal
        "icon": "error"
        "title": "保存失败"
        "content": "请添加适用商品并设置每个商品的规格"
      .show()
      return false

    $.ajax
      url: "/api/seller/promotion"
      type: if discountInfo.id then "PUT" else "POST"
      data: JSON.stringify discountInfo
      contentType: "application/json"
      success: (data) ->
        window.location.href = "/seller/marketing/activity-management?type=#{$("#discount-form").data("type")}&promotionDefId=#{discountInfo.promotionDefId}"

module.exports = DiscountCreate

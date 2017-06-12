###
  店铺营销活动管理组件
  author by terminus.io (zl)
###
Tip = require "common/tip_and_alert/view"
Modal = require("pokeball").Modal
Pagination = require "pokeball/components/pagination"
couponEditTemplate = Handlebars.templates["shop/marketing/activity_create/frontend_templates/coupon_edit"]

class ActivitiesManage

  constructor: ($)->
    @detailCouponBtn = $(".js-detail-coupon")
    @editCouponBtn = $(".js-edit-coupon")
    @publishCouponBtn = $(".js-publish-coupon")
    @activitySearchForm = $("#activitySerachForm")
    @bindEvent()

  bindEvent: ->
    pageSize = if _.isNumber($.query.get("pageSize")) then $.query.get("pageSize") else 20
    new Pagination(".coupon-pagination").total($(".coupon-pagination").data("total")).show(pageSize, {num_display_entries: 5, jump_switch: true, page_size_switch: true, maxPage: -1})
    $(document).on "confirm:stopCoupon", @stopCoupon
    @activitySearchForm.on "submit", @activitySearch
    @detailCouponBtn.on "click", @detailCoupon
    @editCouponBtn.on "click", @editCoupon
    @publishCouponBtn.on "click", @publishCoupon

  #查看详情
  detailCoupon: (evt)=>
    data = $(evt.currentTarget).closest("tr").data("activity")
    typeName = if data.promotion.type is 3 then "discount" else "coupon"
    window.location.href = "/seller/marketing/#{typeName}-create?type=#{data.promotion.type}&promotionDefId=#{data.promotion.promotionDefId}&promotionId=#{data.promotion.id}&method=detail"

  #编辑
  editCoupon: (evt)=>
    data = $(evt.currentTarget).closest("tr").data("activity")
    typeName = if data.promotion.type is 3 then "discount" else "coupon"
    window.location.href = "/seller/marketing/#{typeName}-create?type=#{data.promotion.type}&promotionDefId=#{data.promotion.promotionDefId}&promotionId=#{data.promotion.id}"

  #发布优惠券
  publishCoupon: ->
    id = $(@).data("id")
    $.ajax
      url: "/api/seller/promotion/#{id}/publish"
      type: "PUT"
      success: (data) ->
        window.location.reload()

  #使失效
  stopCoupon: (event, id)->
    $.ajax
      url: "/api/seller/promotion/#{id}/stop"
      type: "PUT"
      success: (data) ->
        window.location.reload()

  #筛选营销活动
  activitySearch: (evt)=>
    evt.preventDefault()
    name = $(evt.currentTarget).find("[name=name]").val()
    status = $(evt.currentTarget).find("[name=status]").val() if $(evt.currentTarget).find("[name=status]").val() isnt "请选择"
    window.location.search = $.query.set("name", name).set("status", status).remove("pageNo").toString()

module.exports = ActivitiesManage

###
  店铺所有商品列表
###
Pagination = require "pokeball/components/pagination"
class ItemAllList
  constructor: ->
    new Pagination(".pagination").total($(".pagination").data("total")).show(20)
    @bindEvent()

  bindEvent: ->

module.exports = ItemAllList

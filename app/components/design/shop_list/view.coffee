Pagination = require "pokeball/components/pagination"
class ShopList
  constructor: ($)->
    new Pagination($(".pagination")).total($(".pagination").data("count")).show(20)

module.exports = ShopList

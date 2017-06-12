class ShopInnerSearch
  constructor: ($) ->
    @$form = $("#js-shop-search-form")
    @$searchSite = $("#js-search-site")
    @$searchShop = $("#js-search-shop")
    @shopId = @$form.data('id')
    @path = window.location.pathname
    @domain = window.location.href.split(@path)[0]
    @bindEvent()

  bindEvent: =>
    @$searchShop.on("click", @searchShop)
    @$searchSite.on("click", @searchSite)
    @$form.on("submit", @submitShopSearch)

  submitShopSearch: (evt)=>
    evt.preventDefault()
    @searchSite()

  searchSite: =>
    data = @$form.serialize()
    window.location.href = @domain + "/search?#{data}"

  searchShop: =>
    data = @$form.serialize()
    window.location.href = @domain + "/shops/#{@shopId}/list?#{data}"

module.exports = ShopInnerSearch

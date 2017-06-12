class ShopInnerSearch
  constructor: ($)->
    @$searchForm = $("#js-shop-inner-search-form")
    @bindEvent()

  bindEvent: ->
    @$searchForm.on "submit", @linkTOShopItems

  linkTOShopItems: (evt)=>
    evt.preventDefault()
    max = 999999999
    min = 0
    data = @$searchForm.serializeObject()
    shopId = @$searchForm.data("shopId")
    if data.p_f then data.p_f *= 100 else data.p_f
    if data.p_t then data.p_t *= 100 else data.p_t

    if data.p_t == ""
      pf = if (data.p_f == "" || data.p_f < min) then min else data.p_f
      pt = max
    else    
      # if data.p_f >= 0 and data.p_t >= 0
        pf = Math.min(data.p_t, data.p_f)
        pt = Math.max(data.p_t,data.p_f)

        pf = if pf > max then max else pf
        pf = if pf < min then min else pf

        pt = if pt > max then max else pt
        pt = if pt < min then min else pt

    data.p_f = pf
    data.p_t = pt

    dataStr = _.map(data, (v, k) => encodeURI("#{k}=#{v}")).join("&")
    window.location.href = "/shops/#{shopId}/list?#{dataStr}"

module.exports = ShopInnerSearch

###
  商品详情页
  author by terminus.io (zl)
###
Modal = require("pokeball").Modal
AddressGroup = require "common/address_select_group/view"
Login = require "common/login/view"

addToCartTemplate = Handlebars.templates["shop_design/item_detail/frontend_templates/cart_info"]
promotionTemplate = Handlebars.templates["shop_design/item_detail/frontend_templates/activity"]

class ItemDetail extends AddressGroup
  constructor: ($)->
    @showCouponBtn = $(".show-coupon")
    @showDiscountBtn = $(".show-discount")
    @imagesSelect = $(".images li")
    @mainImage = $(".js-main-image")
    @jsMainImageContainer = $(".js-main-image-container")
    @$skuAttr = $(".js-sku-attr")
    @addCartButton = $(".js-add-cart")
    @buyNowButton = $(".js-buy-now")
    @closeWarningA = $(".close-warning")
    @stock = $(".total-stock").data("stock")
    @countNumberInput = $(".count-number")
    @itemSku = $(".item-skus")
    @inputAmount = $(".input-amount")
    @warnWord = $(".warning-words")
    @itemId = $(".item-title").data("id")
    @itemStatus = $(".item-title").data("status")
    @baseFreight = $(".base-freight")
    @activityList = ".activity-list"
    @itemName = $("#js-item-name")
    @itemPrice = $("#js-item-price")
    @outerItemPrice = $(".outer-price")
    @itemStock = $("#js-item-stock")
    @itemStockQuantity = $(".js-item-stock-quantity")
    @itemOriginPrice = $("#js-item-origin-price")
    @skus = $("#choose").data("skus")
    @skuGroup = $("#choose").data("attrs")
    @$itemForm = $("#js-item-form")
    @callback = @afterAddressSelected
    @skusPromotionPrice = {}
    # 保存最后的组合结果信息
    @SKUResult = {}
    super
    @bindEvent()

  bindEvent: ->
    @$skuAttr.on "click", @attrClick
    if @itemId and @itemStatus is 1
      if @skus.length is 1 and not @skuGroup.length
        @sku = @skus[0]
      else
        @dealSkus()
        @initSku(@skus)
        @autoSelectSku()
    @getSkusPromotionPrice()
    @initAddress()
    @initPromotion()
    @inputAmount.amount()
    $(document).on "click", @provinceSelect, @provinceChange
    $(document).on "click", @citySelect, @cityChange
    $(document).on "click", @regionSelect, @regionChange
    $(document).on "click", @streetSelect, @streetChange
    $(document).on "click", @addressList, @addressChange
    $(document).on "click", ".address-tab li", @addressTab
    $(document).on "click", ".get-coupon", @getCoupon
    $(".promotion-li").on "click", ".close", @hidePromotion
    @imagesSelect.on "click", @imagesClick
    @addCartButton.on "click", @addCart
    @buyNowButton.on "click", @buyNow
    @closeWarningA.on "click", @closeWarning
    @$showAddress.on "click", @popAddressSelect
    $(".plus").on "click", @afterAddressSelected
    $(".minus").on "click", @afterAddressSelected
    $("input.count-number").on "keyup", @changeNumber
    $(".zoom").zoom()

  getSkusPromotionPrice: =>
    $.ajax
      url: "/api/item/#{@itemId}/sku-price-with-default-promotion"
      type: "GET"
      success: (data)=>
        $.each data, (k, v)=>
          @skusPromotionPrice[v.skuId] = v.promotionPrice

  dealSkus: =>
    skus = $.extend([], true, @skus)
    @skus = _.without (_.map skus, (i) => if i.stockQuantity and i.price then i else 0), 0
    if (@skus isnt Object(@skus)) then throw new TypeError('Invalid object')
    _.each @skus, (i) =>
      attr = _.map i.attrs, (j) =>
        [j.attrKey, j.attrVal].join(":")

      attr.sort (value1, value2) =>
        value1.localeCompare(value2)
      i.attrKey = attr.join(";")

  # 获得对象的key
  getObjKeys: (obj) =>
    _.map obj, (i) =>
      i.attrKey

  # 把组合的key放入结果集@SKUResult
  add2SKUResult: (combArrItem, sku) =>
    key = combArrItem.join(";")

    if(@SKUResult[key]) # SKU信息key属性
      @SKUResult[key].stockQuantity += sku.stockQuantity
      @SKUResult[key].prices.push(sku.price)
    else
      @SKUResult[key] = $.extend({}, true, sku)
      @SKUResult[key].prices = [sku.price]

  # 初始化得到结果集
  initSku: (data) =>
    i = @getObjKeys(data)
    j = @getObjKeys(data)
    skuKeys = @getObjKeys(data)
    data = _.object(@getObjKeys(data), data)
    for skuKey in skuKeys
      sku = data[skuKey]  # 一条SKU信息value
      skuKeyAttrs = skuKey.split(";")  # SKU信息key属性值数组
      @attrLength = @attrLength or skuKeyAttrs.length

      # 对每个SKU信息key属性值进行拆分组合
      combArr = @arrayCombine(skuKeyAttrs)

      for arr in combArr
        @add2SKUResult(arr, sku)

      # 结果集接放入@SKUResult

      @SKUResult[skuKey] = $.extend({}, true, sku)
      @SKUResult[skuKey].prices = [sku.price]
      @SKUResult[skuKey].image = sku.image

  # 从数组中生成指定长度的组合
  arrayCombine: (targetArr) =>
    if(!targetArr || !targetArr.length)
      return []

    len = targetArr.length
    resultArrs = []

    # 所有组合
    for n in [1...len]
      flagArrs = @getFlagArrs(len, n)

      while (flagArrs.length)
        flagArr = flagArrs.shift()
        combArr = []

        for i in [0...len]
          flagArr[i] and combArr.push(targetArr[i])

        resultArrs.push(combArr)

    resultArrs

  # 获得从m中取n的所有组合
  getFlagArrs: (m, n) =>
    if(!n || n < 1)
      return [];

    resultArrs = []
    flagArr = []
    isEnd = false

    for k in [0...m]
      flagArr[k] = if k < n then 1 else 0

    resultArrs.push(flagArr.concat())


    while (!isEnd)
      leftCnt = 0

      for i in [0...m - 1]

        if (flagArr[i] is 1 and flagArr[i+1] is 0)
          for j in [0...i]
            flagArr[j] = if j < leftCnt then 1 else 0
          flagArr[i] = 0
          flagArr[i+1] = 1
          aTmp = flagArr.concat()
          resultArrs.push(aTmp)
          isEnd = true if (aTmp.slice(-n).join("").indexOf('0') is -1)
          break

        flagArr[i] is 1 and leftCnt++

    resultArrs

  #切换商品主图
  changeMainImage: (image)=>
    @mainImage.attr "src", image
    @jsMainImageContainer.attr("href", image)
    $(".magnifier img", @jsMainImageContainer).attr("src", image)

  # sku选择算法
  # 思路：将所有sku组合存起来，有一个对象存储当前情况下的可能结果集，每次点击更新当前结果集，从结果集中找出不能被点击的属性
  autoSelectSku: () =>
    @$skuAttr.each (i, d) =>
      self = $(d)
      attr_id = self.data("attr")
      self.attr('disabled', 'disabled') if (!@SKUResult[attr_id])

  # 点击属性值
  attrClick: (evt) =>
    $self = $(evt.currentTarget)
    unless $self.attr("disabled")
      @warning(1)

      # 选中自己，兄弟节点取消选中
      $self.toggleClass("selected").siblings().removeClass("selected")

      $selected = @$skuAttr.filter(".selected")
      $hasImage = $selected.filter(".hasImage")
      $selectedShow = $selected.filter("[data-show=true]")

      if $hasImage.length
        src = if $selectedShow.length then $selectedShow.data("src") else null

        if $self.hasClass("selected")
          src = src or $self.data("src")
        else
          src = src or $hasImage.data("src") if $hasImage.length

        @changeMainImage(src) if src isnt @mainImage.attr("src")

      @setSelectAttrs($self)
      @afterAddressSelected()

  # 根据选择的attr尝试确定sku组合
  setSelectAttrs: (self) =>
    # 已经选择的节点
    selectedObjs = @$skuAttr.filter(".selected")

    if(selectedObjs.length)
      # 获得组合key价格
      selectedIds = _.map selectedObjs, (d) =>
        $(d).data("attr")

      selectedIds.sort (value1, value2) =>
        value1.localeCompare(value2)

      len = selectedIds.length
      sku = @SKUResult[selectedIds.join(';')]
      if len is @attrLength
        @sku = sku
      @setSkuInfo(sku)

      # 用已选中的节点验证待测试节点 underTestObjs
      @$skuAttr.not(selectedObjs).not(self).each (i, d) =>
        siblingsSelectedObj = $(d).siblings('.selected')
        testAttrIds = [] # 从选中节点中去掉选中的兄弟节点
        if (siblingsSelectedObj.length)
          siblingsSelectedObjId = siblingsSelectedObj.data("attr")

          for i in [0..len - 1]
            (selectedIds[i] != siblingsSelectedObjId) && testAttrIds.push(selectedIds[i])

        else
          testAttrIds = selectedIds.concat()

        testAttrIds = testAttrIds.concat($(d).data("attr"))
        testAttrIds.sort (value1, value2) =>
          value1.localeCompare(value2)

        if (!@SKUResult[testAttrIds.join(';')])
          $(d).attr('disabled', 'disabled').removeClass('selected')
        else
          $(d).removeAttr('disabled')
    else
      # 设置默认价格，库存，原价，名称
      @resetItemInfo()

      # 设置属性状态
      @$skuAttr.each (i, d) =>
        if @SKUResult[$(d).data("attr")] then $(d).removeAttr('disabled') else $(d).attr('disabled', 'disabled').removeClass('selected')

  resetItemInfo: =>
    @itemName.text(@itemName.data("name"))
    @itemPrice.text(@itemPrice.data("range"))
    @itemPrice.closest("li").children("label").text '价格'
    @outerItemPrice.closest("li").addClass("hide")
    @itemStock.text(@itemStock.data("stock"))
    @itemStockQuantity.data("max", @itemStock.data("stock"))
    @itemOriginPrice.text(@itemOriginPrice.data("range"))

  setSkuInfo: (sku)=>
    prices = sku.prices
    maxPrice = Math.max.apply(Math, prices)
    minPrice = Math.min.apply(Math, prices)
    @changeMainImage(sku.image) if sku.image
    @outerItemPrice.text(if maxPrice > minPrice then priceFormat(minPrice) + "-" + priceFormat(maxPrice) else priceFormat(maxPrice))
    @itemPrice.text(if maxPrice > minPrice then priceFormat(minPrice) + "-" + priceFormat(maxPrice) else priceFormat(maxPrice))
    @itemStock.text(sku.stockQuantity)
    @itemStockQuantity.data("max", sku.stockQuantity)
    @itemName.text(sku.name) if sku.name
    @itemOriginPrice.text(@itemOriginPrice.data("currency") + priceFormat(sku.originPrice)) if sku.originPrice
    promotionPrice = @skusPromotionPrice[sku.id]
    if promotionPrice
      @itemPrice.text (promotionPrice/100).toFixed(2)
      @itemPrice.closest("li").children("label").text '促销价'
      @outerItemPrice.closest("li").removeClass("hide")
    else
      @itemPrice.closest("li").children("label").text '价格'
      @outerItemPrice.closest("li").addClass("hide")

  # 获取能否配送
  afterAddressSelected: ()=>
    addressId = $(".address-content[data-level=#{@levels}] li.active").data("value")
    itemId = $(".address-group").data("item")
    quantity = $("#item-quantity").val()
    selectedSku = @sku
    if @isAllselected()
      $.ajax
        url: "/api/delivery-fee-charge/sku?skuId=#{selectedSku.id}&addressId=#{addressId}&quantity=#{quantity}"
        type: "GET"
        success: (data)=>
          @baseFreight.text((parseFloat(data/100)).toFixed(2) + " #{i18n.ct('yuan', 'shop_design')}")
        error: ->
    else
      @baseFreight.text("请先选择规格")

  # #点击图片切换
  imagesClick: (evt)=>
    $self = $(evt.currentTarget)
    $self.addClass "selected"
    $("a", $self).removeClass "hide"
    $self.siblings().removeClass "selected"
    $self.siblings().find("a").addClass "hide"
    src = $("img", $self).data("src")
    @changeMainImage(src)

  #检查是否全选，其实只是做个样子。。。真正的sku在@sku
  isAllselected: =>
    status = true
    status = false unless ($(".sku-choose", @$el).length is @$skuAttr.filter(".selected").length)
    status

  #立即购买
  buyNow: =>
    if @isAllselected()
      $("body").overlay()
      selectedSku = @sku
      quantity = $.trim($(".count-number").val())
      data = [{ skuId: selectedSku.id, quantity }]
      @$itemForm.find("input[name=data]").val(JSON.stringify(data))
      $.ajax
        url: "/api/user/current"
        type: "GET"
        success: (data)=>
          $("body").overlay(false)
          if data
            @$itemForm.submit()
          else
            Login.showLoginModal()

    else
      @warning(0)

  #加入购物车
  addCart: =>
    if @isAllselected()
      $("body").overlay()
      selectedSku = @sku
      $.ajax
        url: "/api/carts"
        type: "POST"
        data: "skuId=#{selectedSku.id}&quantity=#{$(".count-number").val()}"
        success: (data)=>
          new Modal(addToCartTemplate()).show()
          $(".component-ceiling").data("compInstance").getCartCount()
          $("body").overlay(false)
    else
      @warning(0)

  #若未选满SKU则弹出提示
  warning: (type)=>
    if type is 0
      @itemSku.addClass("warning")
      @warnWord.show()
      $("#choose-btns button", @$el).hide()
      @closeWarningA.show()
    else if type is 1
      @itemSku.removeClass("warning")
      @warnWord.hide()
      $("#choose-btns button", @$el).show()
      @closeWarningA.hide()

  #关闭提示
  closeWarning: =>
    @warning(1)

  changeNumber: (evt) =>
    nowVal = $(evt.currentTarget).val()
    maxVal = $(evt.currentTarget).closest(".js-item-stock-quantity").data("max")
    if nowVal < 1
      $(evt.currentTarget).val(1)
    else if nowVal > maxVal
      $(evt.currentTarget).val(maxVal)
    else
      $(evt.currentTarget).val(parseInt(nowVal))
    @afterAddressSelected()

  initPromotion: =>
    @getPromotion("coupon")
    @getPromotion("discount")

  getPromotion: (type)=>
    url = if type is "coupon" then "/api/coupon/item/#{@itemId}" else "/api/item/#{@itemId}/promotion"
    obj = if type is "coupon" then @showCouponBtn else @showDiscountBtn
    $.ajax
        url: url
        type: "GET"
        contentType: "application/json"
        success: (data)=>
          if data.length
            if type is "coupon"
              $.each data, (i,o)=>
                data[i].promotion.behaviorParams.reduceFee = o.promotion.behaviorParams.reduceFee/100
            obj.data("info", data).removeClass("hide")
            obj.closest("li").removeClass("hide")
            @renderPromotion(type)

  renderPromotion: (type)=>
    obj = if type is "coupon" then @showCouponBtn else @showDiscountBtn
    promotionType = type
    data = obj.data("info")
    obj.append(promotionTemplate({data: data, promotionType}))
    @showCouponBtn.on "click", @showPromotion
    @showDiscountBtn.on "click", @showPromotion

  showPromotion: (evt)=>
    $(".promotionBox").hide()
    $.each $(".promotionBox .coupon-status"), (n, v)->
      text = $(v).text().trim()
      $(v).text("已领取") if text is "领取成功"
    $(evt.currentTarget).find(".promotionBox").show()

  hidePromotion: ->
    $(".promotionBox").hide()

  # 领取优惠券
  getCoupon: (evt)=>
    id = $(evt.currentTarget).data("id")
    $.ajax
        url: "/api/coupon/#{id}/receive"
        type: "POST"
        contentType: "application/json"
        success: (data)=>
          if data
            $(evt.currentTarget).closest("td").html("领取成功")
          else
            new Modal
             "icon": "error"
             "title": "领取失败"
             "content": "领取优惠券失败，请稍后再试"
            show()


module.exports = ItemDetail

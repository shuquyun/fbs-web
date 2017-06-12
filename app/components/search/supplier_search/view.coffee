commonSearch = require "search/material_search/view"
SelectTree = require "common/select_tree/view"

class SearchSupplier extends commonSearch
  
  constructor: ($) ->
    @$jsInputToggle = $('.js-speciality-toggle')
    @$jsSpecialityContainer = $('.js-speciality-container')
    super

  bindEvent: ->
    @$jsInputToggle.on "click", @toggleSpeciality
    $(document).on "click", (evt) => @closeSpeciality(evt)
    super

  toggleSpeciality: () =>
    @$jsSpecialityContainer.toggleClass('hide')

  closeSpeciality: (evt) =>
    if !$(evt.target).closest('.js-speciality-toggle').length
      @$jsSpecialityContainer.addClass('hide')

  # 初始化
  setSort: ->
    @getSpecialty()

  #  点击筛选
  propertySelectorClick: ->
    key = $(@).data("key")
    value = $(@).data("value")
    window.location.search = $.query.set("#{key}", value).remove("pageNo").toString()

  # 多选筛选
  attrsConfirm: ->
    thisDl = $(@).closest("tr")
    key = $(@).data("key")
    attrs = []
    $.each $(".attr-dd", thisDl), (i, dd)->
      if $(dd).find("div.checked").length > 0
        attrs.push $(dd).find("div.checked").data("value")
    unless attrs.length is 0
      attrs = attrs.join(",")
      window.location.search = $.query.set("#{key}",attrs).remove("pageNo").toString()

  #  面包屑筛选
  breadPropertySelectorClick: ->
    key = $(@).data("key")
    name = $(@).data("name").toString().replace('-', '_')
    attrs = $.query.get("#{key}").split(",")
    attrs = _.without(attrs, name).join(",")
    if attrs
      window.location.search = $.query.set("#{key}", attrs).remove("pageNo").toString()
    else
      window.location.search = $.query.remove("#{key}").remove("pageNo").toString()

  # 服务区域面包屑筛选
  breadBrandSelectorClick: ->
    key = $(@).data("key").toString()
    attrs = $.query.get("sProvinceId").toString().split(",")
    attrs = _.without(attrs, key).join(",")
    if attrs
      window.location.search = $.query.set("sProvinceId", attrs).remove("pageNo").toString()
    else
      window.location.search = $.query.remove("sProvinceId").remove("pageNo").toString()

  getSpecialty: () ->
    $.ajax
      url: '/api/base-major/tree',
      type: 'GET',
      success: (data) =>
        new SelectTree({
          container: '.js-speciality-container',
          search: false,
          data: data,
          afterSelect: @getModels
        })
        @initSelectTree()

  initSelectTree: () ->
    id = $('.js-speciality-id').val()
    $(".js-tree-item[data-id=#{id}]").trigger('click')

  getModels: (e) =>
    $self = $(e.currentTarget)
    id = $self.data('id')
    node = $self.data('node')
    if !node.hasChildren
      $('.js-speciality-name').val(node.name)
      $('.js-speciality-id').val(id)
      @$jsSpecialityContainer.addClass('hide')

  # 提交价格区间筛选  即专业区间
  filterFormSubmit: (evt) ->
    evt.preventDefault()
    specialId = $(".js-speciality-id").val()
    window.location.search = $.query.set("speciality", specialId).remove("pageNo").toString()

  clearPriceFilter: ->
    window.location.search = $.query.remove("speciality").remove("pageNo").toString()

module.exports = SearchSupplier
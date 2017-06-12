const MaterialSearch = require('search/material_search/view')
const MajorSelect = require('common/major_select/view')
const addressItemTemplate = Handlebars.templates["search/bids_search/condition_search/frontend_templates/select_address_item"]
class SupplierBidsSearch extends MaterialSearch {
  constructor($) {
    super($)
    new MajorSelect($)
    this.$jsAddressSelector = $('.js-address-selector')
    this.$jsAddressContainer = $('#js-address-container')
    this.$jsAddressElects = $('.js-address-elects')
    this.$jsAddressConfirm = $('.js-address-confirm')
    this.$jsAddressCancel = $('.js-address-cancel')
    this.$selectedAddressList = $('.js-selected-address-list')
    this.$jsBreadAddressSelect = $('.js-bread-address-selector')
    this.$jsBreadProjectTypeSelect = $('.js-bread-projectType-selector')
    this.$jsProjectTypeSelect = $('.js-project-type-selector')
    this.$jsProjectTypesConfirm = $('.js-project-type-confirm')
    this.$selectedTypesList = $('.js-selected-types-list')
    this.$jsSpecialityCancel = $('#js-cancel-speciality-filter')
    this.$jsBreadSpeciality = $('.js-bread-speciality-selector')
    this.bindEvents()
  }

  bindEvents() {
    this.$jsAddressSelector.on('click', (evt) => this.addressSelectorClick(evt))
    this.$jsAddressElects.on('click', (evt) => this.electAddress(evt))
    this.$jsAddressConfirm.on('click', () => this.addressConfirm())
    this.$jsAddressCancel.on('click', (evt) => this.addressCancel(evt))
    this.$jsBreadAddressSelect.on('click', (evt) => this.breadAddressSelector(evt))
    this.$jsBreadProjectTypeSelect.on('click', (evt) => this.breadProjectTypeSelector(evt))
    this.$jsProjectTypeSelect.on('click', (evt) => this.projectTypeSelector(evt))
    this.$jsProjectTypesConfirm.on('click', (evt) => this.projectTypeConfirm(evt))
    this.$jsSpecialityCancel.on('click', () => this.clearSpecialityFilter())
    this.$jsBreadSpeciality.on('click', () => this.clearSpecialityFilter())
  }

  breadAddressSelector(evt) {
    let bids = ($.query.get('provinceId')).toString().split(',')
    const bid = $(evt.currentTarget).data("id").toString()
    bids = _.without(bids, bid, '').join(",")
    if (bids.length) {
      window.location.search = $.query.set("provinceId", bids).remove("pageNo").toString()
    } else {
      window.location.search = $.query.remove("provinceId").remove("pageNo").toString()
    }
  }

  breadProjectTypeSelector(evt) {
    const type = $(evt.currentTarget).data("id").toString()
    const types = _.without(this.selectProjectTypes, type).toString()
    if (types.length) {
      window.location.search = $.query.set("projectType", types).remove("pageNo").toString()
    } else {
      window.location.search = $.query.remove("projectType").remove("pageNo").toString()
    }
  }

  projectTypeSelector(evt) {
    const $self = $(evt.currentTarget)
    const type = $self.data('id')
    window.location.search = $.query.set('projectType', type).remove('pageNo').toString()
  }

  projectTypeConfirm(evt) {
    const $self = $(evt.currentTarget)
    const types = _.map($self.closest('.js-filter-container').find('.attr.checked'), (i) => {
      return $(i).data('value')
    })
    if (types.length) {
      const bids = types.join(',')
      window.location.search = $.query.set('projectType', bids).toString()
    }
  }

  //设置地区筛选
  addressSelectorClick(evt) {
    const $self = $(evt.currentTarget)
    const isMore = this.$jsAddressContainer.hasClass('active')
    const bid = $self.data('id')
    const name = $self.data('name')
    this.selectedAddress = this.selectedAddress || []
    if (isMore) {
      if ($self.hasClass('active')) {
        $self.removeClass('active')
        _.without(this.selectedAddress, bid)
        $(`.js-selected-address[data-id=${bid}]`).remove()
      } else {
        $self.addClass('active')
        this.selectedAddress.push(bid)
        this.$selectedAddressList.append(addressItemTemplate({ bid, name }))
      }
    } else {
      window.location.search = $.query.set('provinceId', bid).remove('pageNo').toString()
    }
  }

  //duoxua
  electAddress(evt) {
    const $self = $(evt.currentTarget)
    this.electAttrs(evt)
    $('.js-selected-address-list').show()
  }

  addressConfirm() {
    const address = this.selectedAddress
    if (address.length) {
      const bids = address.join(',')
      window.location.search = $.query.set('provinceId', bids).toString()
    }
  }

  addressCancel(evt) {
    const thisTr = $(evt.currentTarget).closest('tr')
    _.each($('.dd-cancel', thisTr), (i, dd) => {
      $(dd).find('div.attr').removeClass('checked')
      $(dd).find('div.attr').hide().siblings('a').show()
    })
    thisTr.find('.js-address-elects,.js-attr-elects').show()
    thisTr.find('.js-filter-container').removeClass('active')
    thisTr.removeClass('active').prev().removeClass('nbb')
    thisTr.find('.brand-buttons').hide()
    if (thisTr.find('.js-unfold').hasClass('hide')) {
      thisTr.find('.js-fold').trigger('click')
    }
  }

  filterFormSubmit(evt) {
    evt.preventDefault()
    const $self = $(evt.currentTarget)
    const speciality1 = $self.find('select[name=speciality1]').val()
    const speciality2 = $self.find('select[name=speciality2]').val()
    window.location.search = $.query.set("speciality1", speciality1).set("speciality2", speciality2).remove("pageNo").toString()
  }

  clearSpecialityFilter() {
    window.location.search = $.query.remove("speciality1").remove("speciality2").remove("pageNo").toString()
  }
}

module.exports = SupplierBidsSearch

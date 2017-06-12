const Building = require('./build_house');

class Config {
  constructor() {
    this.formEl = $('.component-list-config form');

    this.bindEvt();
    this.getListData();
  }

  bindEvt() {
    this.formEl.validator();
    this.formEl.on('submit', (e) => {
      e.preventDefault();
      const query = this.formToQuery();
      this._makeupQuery(query);
      // console.log('query: ', query)
      this.createList(query);
    });

    $('.js-products-select').on('change', e => {
      this.building.changeProducts($(e.target).val())
    })
    const dateEl = $('.datepicker')
    dateEl.datepicker({setDefaultDate: true, defaultDate: new Date(dateEl.data('default'))})
  }

  getListData() {
    const query = this._extractQuery();

    $.ajax({
      url: '/api/bill/' + query.bidId + '/prepare?',
      type: 'GET',
      data: {
        billId: query.billId || ''
      }
    }).done( result => {
      if (result && !!result.billWithBanAndHouse) {
        const bill = result.billWithBanAndHouse;
        this.majorIds = bill.majorIds;
        this.renderBuilding({ products: JSON.parse(bill.products), billBanList: bill.billBanList, houseTypeList: bill.houseTypeList });
        this.renderMajor(bill.extMajors);
      } else {
        this.renderBuilding({
        billBanList: [],
        houseTypeList: []
      })
      }
    })
  }

  renderBuilding(data) {
    const el = $('.js-build-container');
    const hasHouse = el.data('type') === 2 ? true : false;

    if (el.length > 0) {
      this.building = new Building({el, hasHouse, data})
    }
  }

  renderMajor(data) {
    for (let key in data) {
      for (let id of data[key]) {
        $('[name=pile-' + key + '-' + id + ']').eq(0).trigger('click');
      }
    }
  }

  formToQuery() {
    const q = { extMajors: { 1: [], 2: [] } , productList: [] };
    const formData = this.formEl.serializeArray();

    this._mapForm(q, formData);

    return q;
  }

  createList(query) {
    if (query.companyIds) {
      query.companyIds = query.companyIds.split(',')
    }
    $.ajax({
      url: '/api/bill',
      type: query.id ? 'PUT' : 'POST',
      data: JSON.stringify(query),
      contentType: 'application/json'
    }).done( result => {
      let redirectUrl = query.id
                          ? '/list/edit/division' + window.location.search
                          : '/list/edit/division' + window.location.search + '&billId=' + result
      const q = query.id ? query.id : result

      $.ajax({
        url: '/api/bill-sheets/' + q
      }).done( result => {
        redirectUrl = redirectUrl + '&tag=' + result[0].id;
        window.location.href = redirectUrl;
      })
    })
  }

  _mapForm(query, data) {
    for (let item of data) {
      if (item.name.indexOf('pile-') !== -1) {
        if (item.value != 0) {
          query.extMajors[item.name.split('-')[1]].push(item.value);
        }
      } else if (item.name === 'product') {
        query.productList.push(item.value)
      } else {
        query[item.name] = item.value;
      }
    }
  }

  _makeupQuery(query) {
    const querys = this._extractQuery();
    for (let name in querys) {
      if (!!querys[name]) {
        query[name] = querys[name];
      }
      if (!!querys.billId) {
        query.id = querys.billId;
      }
    }

    const cityEl = $('[data-city-code]');
    query.cityCode = cityEl.data('city-code');
    query.cityName = cityEl.data('city-name');
    query.majorIds = this.majorIds;

    if (this.building) {
      const buildingQuery = this.building.getQuery();
      query.billBanList = buildingQuery.buildList;
      query.houseTypeList = buildingQuery.houseList;
    }
  }

  _extractQuery() {
    const query = window.location.search.split('?')[1];
    const queryObj = {};

    query.split('&').map( q => {
      const arr = q.split('=');
      queryObj[arr[0]] = arr[1];
    })

    return queryObj
  }
}

module.exports = Config

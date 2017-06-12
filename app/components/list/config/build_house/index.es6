const containerTemplate = Handlebars.templates['list/config/frontend_templates/building_container'];
const buildTemplate = Handlebars.partials['list/config/frontend_templates/_building_info'];
const houseTemplate = Handlebars.partials['list/config/frontend_templates/_house_info'];
const linkTemplate= Handlebars.partials['list/config/frontend_templates/_building_house_link'];
const linkItemTemplate = Handlebars.partials['list/config/frontend_templates/_building_link_item'];

class Building {
  constructor(options) {
    this.wrapEl = options.el;
    this.hasHouse = options.hasHouse;
    this.products = options.data.products;

    this.resolveData(options.data);
    this.render();
    this.bindEvt();
  }

  resolveData(data) {
    this.buildInfo = [];
    this.houseInfo = [];
    this.linkInfo = [];

    for (let build of data.billBanList) {
      this.resolveBuildData(build);
    }

    if (!!this.hasHouse) {
      this.resolveHouseData(data.houseTypeList);
      this.resolveLinkData(data.billBanList);
    }
  }

  resolveBuildData(build) {
    this.buildInfo.push({
      id: build.id || null,
      name: build.name,
      area: build.area,
      product: build.product,
      crud: 'R',
      renderStatus: true
    })
  }

  resolveHouseData(list) {
    if (!!list) {
      for (let house of list) {
        this.houseInfo.push({
          id: house.id || null,
          name: house.name,
          product: house.product,
          style: house.style,
          crud: 'R',
          renderStatus: true
        })
      }
    }
  }

  resolveLinkData(data) {
    this._resolveLinkInfo();

    for (let build of data) {
      const buildIndex = this._getLink(build.name);
      for (let house of build.houseTypeList) {
        const houseIndex = this._getLinkHouse(buildIndex, house.houseName);
        this.linkInfo[buildIndex].houseTypeList[houseIndex] = {
          id: house.id,
          count: house.count,
          houseName: house.houseName,
          crud: 'R',
          renderStatus: true
        }
      }
    }
  }

  _resolveLinkInfo() {
    for (let build of this.buildInfo) {
      let linkIndex = this._getLink(build.name);
      if (linkIndex === -1) {
        this.linkInfo.push({
          id: build.id || null,
          name: build.name,
          houseTypeList: []
        })
      }

      linkIndex = linkIndex === -1 ? this.linkInfo.length -1 : linkIndex;

      for (let house of this.houseInfo) {
        let linkHouseIndex = this._getLinkHouse(linkIndex, house.name);

        if (linkHouseIndex !== -1) {
          if (!house.renderStatus) {
            const lh = this.linkInfo[linkIndex].houseTypeList[linkHouseIndex]
            lh.renderStatus = house.renderStatus;
            lh.crud = house.crud;
          }
        } else {
          this.linkInfo[linkIndex].houseTypeList.push({
            houseName: house.name,
            renderStatus: false
          })
        }
      }
    }
  }

  render() {
    const renderData = this.composeRenderData();
    this.wrapEl.append(containerTemplate(renderData));
    this._renderSelectric();
  }

  composeRenderData() {
    return {
      products: this.products,
      buildInfo: this.buildInfo,
      houseInfo: this.houseInfo,
      linkInfo: this.hasHouse ? this.composeLinkInfo() : this.buildInfo,
      hasHouse: this.hasHouse
    }
  }

  composeLinkInfo() {
    const links = [];

    for (let link of this.linkInfo) {
      links.push(this.composeLinkItem(link.name, link))
    }

    return links
  }

  composeLinkItem(name, item) {
    const build = this._getBuild(name);
    const obj = {}

    Object.keys(build).map(key => obj[key] = build[key])
    obj.hasHouse = this.hasHouse;
    obj.houseList = [];
    obj.houseSelect = [];

    for (let house of item.houseTypeList) {
      if (house.renderStatus) {
        obj.houseList.push({
          houseName: house.houseName,
          count: house.count
        })
      } else {
        if (this._getHouse(house.houseName).renderStatus) {
          obj.houseSelect.push({ name: house.houseName })
        }
      }
    }

    return obj
  }

  bindEvt() {
    if (!this.wrapEl.length) return;

    this.buildEl = this.wrapEl.find('.js-building-container');
    this.houseEl = this.wrapEl.find('.js-house-container');
    this.linkEl = this.wrapEl.find('.js-house-link-container');

    this.bindBuildEvt();
    if (this.hasHouse) {
      this.bindHouseEvt();
      this.bindLinkEvt();
    }

    this.wrapEl.on('click', '[data-edit]', (e) => {
      $(e.target).parent().parent().toggleClass('edit')
    })
  }

  bindBuildEvt() {
    const buildEl = this.buildEl;

    buildEl.on('click', '.js-add-building', (e) => {
      const el = $(e.target);
      const { name, area, product } = getVal(el, this.hasHouse);

      if (name !== '' && area !== '') {
        const build = this._getBuild(name)
        if (build) {
          Object.assign(build, { renderStatus: true, name, area, product });
          build.crud = build.id ? 'U' : 'C';
        } else {
          this.buildInfo.push({ renderStatus: true, name, area, product, crud: 'C' })
        }

        this.refreshLinkInfo();
        el.siblings('input').val('');
      }
    })

    buildEl.on('click', '[data-submit=edit]', e => {
      const el = $(e.target);
      const oldName = el.data('key');
      const { name, area, product } = getVal(el, this.hasHouse);

      if (name !== '' && area !== '') {
        const build = this._getBuild(oldName);
        Object.assign(build, { name, area, product })

        if (this.hasHouse) {
          this.linkInfo[this._getLink(oldName)].name = name;
        }

        build.crud = build.id ? 'U' : 'C'
      }

      this.refreshLinkInfo();
    })

    buildEl.on('click', '[data-delete=build]', (e) => {
      const name = $(e.target).data('key');
      const build = this._getBuild(name);
      if (build.crud === 'R') {
        build.crud = 'D'
      }
      build.renderStatus = false;
      this.refreshLinkInfo();
    })

    function getVal(el, flag) {
      return {
        name: el.siblings('input[data-building=name]').val(),
        area: el.siblings('input[data-building=area]').val(),
        product: !flag
                  ? el.siblings('.selectric-select').find('select').val()
                  : ''
      }
    }
  }

  bindHouseEvt() {
    const houseEl = this.houseEl;

    houseEl.on('click', '.js-add-house', (e) => {
      const el = $(e.target);
      const { name, style, product } = getVal(el, false);

      if (name !== '' && style !== '') {
        const house = this._getHouse(name);
        if (house) {
          Object.assign(house, { renderStatus: true, name, style, product });
          house.crud = house.id ? 'U' : 'C';
        } else {
          this.houseInfo.push({ renderStatus: true, name, style, product, crud: 'C' })
        }

        houseEl.empty().append(houseTemplate({ houseInfo: this.houseInfo, products: this.products }));
        this.refreshLinkInfo();
      }
    })

    houseEl.on('click', '[data-submit=edit]', e => {
      const el = $(e.target);
      const oldName = el.data('key');
      const { name, style, product } = getVal(el, false);

      if (name !== '' && style !== '') {
        const house = this._getHouse(oldName);
        Object.assign(house, { name, style, product })
        house.crud = house.id ? 'U' : 'C'
        for (let i = 0; i < this.linkInfo.length; i++) {
          this.linkInfo[i].houseTypeList[this._getLinkHouse(i, oldName)].houseName = name;
          this.linkInfo[i].houseTypeList[this._getLinkHouse(i, name)].crud = house.crud;
        }
      }

      houseEl.empty().append(houseTemplate({ houseInfo: this.houseInfo, products: this.products }));
      this.refreshLinkInfo();
    })

    houseEl.on('click', '[data-delete]', (e) => {
      const name = $(e.target).data('key');

      const house = this._getHouse(name);

      if (house.crud = 'R') {
        house.crud = 'D'
      }
      house.renderStatus = false;

      houseEl.empty().append(houseTemplate({ houseInfo: this.houseInfo, products: this.products }));
      this.refreshLinkInfo();
    })

    function getVal(el) {
      return {
        name: el.siblings('input[data-house=name]').val(),
        style: el.siblings('input[data-house=style]').val(),
        product: el.siblings('.selectric-select').find('select').val()

      }
    }
  }

  bindLinkEvt() {
    const linkEl = this.linkEl;

    linkEl.on('click', '.js-add-link', (e) => {
      $(e.target).parents('.build-item-link').find('.build-new-link-item').toggle();
    })

    linkEl.on('click', '.js-submit-link', (e) => {
      const el = $(e.target);
      const wrapEl = el.parents('.build-item-link');

      const key = wrapEl.data('key');
      const name = el.parent().find('select').val();
      const count = el.siblings('input').val();

      if (!!name && !!count) {
        const index = this._getLink(key);
        const house = this.linkInfo[index].houseTypeList[this._getLinkHouse(index, name)];
        house.crud = house.id ? 'U' : 'C';
        house.renderStatus = true;
        house.count = count;
        this.refreshLinkItem(el.parents('.build-item-link'), key);
      }
    })

    linkEl.on('click', '[data-delete=link]', (e) => {
      const el = $(e.target);
      const key = el.data('link');
      const name = el.data('key');

      const index = this._getLink(key);
      const house = this.linkInfo[index].houseTypeList[this._getLinkHouse(index, name)];
      house.crud = house.id ? 'D' : '';
      house.renderStatus = false;

      this.refreshLinkItem(el.parents('.build-item-link'), key)
    })
  }

  refreshLinkInfo() {
    this._resolveLinkInfo();
    this.linkEl.empty().append(linkTemplate({ linkInfo: this.hasHouse ? this.composeLinkInfo() : this.buildInfo, products: this.products }));
    this._renderSelectric();
  }

  refreshLinkItem(el, name) {
    el.empty().append(linkItemTemplate(this.composeLinkItem(name, this.linkInfo[this._getLink(name)])));
    this._renderSelectric();
  }

  getQuery() {
    const buildList = this.getBuild();
    let houseList = [];

    if (this.hasHouse) {
      this.getLink(buildList);
      houseList = this.getHouse();
    }

    return { buildList, houseList }
  }

  getBuild() {
    const buildArr = [];

    for (let build of this.buildInfo) {
      build.renderStatus = '';
      build.houseTypeList = [];
      buildArr.push(build);
    }

    return buildArr
  }

  getHouse() {
    const houseList = [];

    for (let house of this.houseInfo) {
      house.renderStatus = '';
      houseList.push(house);
    }

    return houseList;
  }

  getLink(list) {
    for (let build of list) {
      const name = build.name;
      const houseList = this.linkInfo[this._getLink(name)].houseTypeList;

      for (let house of houseList) {
        if (house.crud) {
          build.houseTypeList.push(house)
        }
      }
    }
  }

  changeProducts(products) {
    this.products = products;
    if (this.hasHouse) {
      this.houseEl.empty().append(houseTemplate({ houseInfo: this.houseInfo, products: this.products }));
      this.refreshLinkInfo();
    } else {
      this.buildEl.empty().append(buildTemplate({ linkInfo: this.buildInfo, products: this.products}));
      this.linkEl = this.wrapEl.find('.js-house-link-container');
      this._renderSelectric();
    }
  }

  _renderSelectric() {
    this.wrapEl.find('select').each((index, el)=>{
      $(el).selectric();
    })
  }

  _getBuild(name) {
    return this.buildInfo.find(build => build.name === name.toString())
  }

  _getHouse(name) {
    return this.houseInfo.find(house => house.name === name.toString())
  }

  _getLink(name) {
    return this.linkInfo.findIndex(link => link.name === name.toString());
  }

  _getLinkHouse(index, name) {
    return this.linkInfo[index].houseTypeList.findIndex(house => house.houseName === name.toString())
  }
}

module.exports = Building

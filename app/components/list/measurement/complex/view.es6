const TreeComp = require('../tree_nav');
const SelectTree = require("common/tree_comp/view");
const FeeTree = require('list/fee_sum/view')

const { Modal, Pagination } = require("pokeball")
const billItemTemplate = Handlebars.partials["list/measurement/all_templates/_bill_item"]
const billListTemplate = Handlebars.templates["list/measurement/all_templates/bill_list"]
const selectBillItemTemplate = Handlebars.templates["list/measurement/frontend_templates/select_bill_item"]

const standardTableTemplate = Handlebars.partials["list/measurement/frontend_templates/_standard_table_list"]
const attrTemplate = Handlebars.templates["list/measurement/frontend_templates/attr"]

const detailTabTemplate = Handlebars.templates["list/measurement/frontend_templates/detail_tab"]
const detailTableTemplate = Handlebars.partials["list/measurement/frontend_templates/_detail_table"]
const detailItemTemplate = Handlebars.partials["list/measurement/frontend_templates/_detail_item"]
const detailChildItemTemplate = Handlebars.partials["list/measurement/frontend_templates/_detail_child_item"]

const skuTemplate = Handlebars.templates["list/measurement/frontend_templates/select_sku"]
const itemListTemplate = Handlebars.partials["list/measurement/frontend_templates/_item_list"]
const itemSkuListTemplate = Handlebars.partials["list/measurement/frontend_templates/_sku_type"]

const selectWeightTemplate = Handlebars.partials["list/measurement/frontend_templates/_select_weight"]
const selectSkuTemplate = Handlebars.partials["list/measurement/frontend_templates/_select_sku"]

class Measurement {
  constructor() {
    new TreeComp();
    this.bindEvt();
    this.getCate();
    this.getCity();
    this.renderFirst();
    this.feeTree = new FeeTree()
  }

  getCate() {
    $.ajax({
      url: "/api/model-category/tree",
      type: "get",
      success: (data) => {
        this.cateTree = data
      }
    })
  }

  getCity() {
    $.ajax({
      url: `/api/bill/${$.query.get('billId')}/city-code`
    }).done(result => {
      this.cityCode = result
    })
  }

  renderFirst() {
    if (window.location.hash) {
      this.renderList()
    }
  }

  bindEvt() {
    this.$listWrap = $(".js-bill-container");
    this.$expand = $("#js-detail-bar");
    this.$major = $('.component-list-siderbar').find('li.active');

    const $wrap = $('.component-measurement-complex');

    $wrap.on('renderList', (e, node) => this.renderList(e, node))
    // 清单行相关操作
    $wrap.on('click', '.js-add-bill', e => this.addBillItem(e))
    $wrap.on('click', '.js-add-edit-bill', (e) => this.addEditBillItem(e))
    $wrap.on('click', '.js-insert-bill-item', e => this.insertBillItem(e))
    $wrap.on("click", ".js-bill-item", (e) => this.selectBill(e))
    $wrap.on('click', '.js-model-name', (e) => this.changeBillItem(e))
    $wrap.on('click', '.js-model-attr', (e) => this.changeAttr(e))
    $wrap.on('blur', '.js-table .js-input, .js-table .js-textarea', e => this.editBillItem(e))
    $wrap.on('change', '.js-table select', (e) => this.editBillItem(e))
    $wrap.on('click', '.js-del-bill-item', (e) => this.deleteBillItem(e))
    // 选择清单部分
    $(document).on("click", ".js-bill-tr", (e) => this.selectStandardBill(e))
    $(document).on('click', '.js-search-standard', (e) => this.getBills(e))
    // detail
    this.$expand.on("click", (e) => this.showDetailTab(e))
    $(document).on("click", ".js-item-type", (e) => this.changeItem(e))
    $(document).on("click", ".js-add-item", (e) => this.addItem(e))
    $(document).on("click", ".js-item-tr", (e) => this.selectItem(e))
    $(document).on("click", ".js-sku-tr", (e) => this.selectSku(e))
    $(document).on("click", ".js-del-item", (e) => this.delItem(e))
    $(document).on('blur', '.js-update-item', (e) => this.editItem(e))
    $(document).on('click', '.js-add-edit-sku', (e) => this.addEditSku(e))
  }

  renderList(e, node) {
    $.ajax({
      url: `/api/bill-sheet-row/list-by-cate-id`,
      data: { billSheetId: $.query.get('tag'), sheetCateId: window.location.hash.split('#')[1] }
    }).done( result => {
      const list = {
        enable: true,
        data: result,
        itemPriceMap: []
      }

      if (result.length > 0) {
        list.itemPriceMap = result[0].cceBillSheetRow.itemPriceMap
      }
      this.listData = list;
      this.refreshList();
    })
  }

  refreshList() {
    this.$listWrap.empty().append(billListTemplate(this.listData))
    this.replaceEl = this.insertEl = null

    const $table = $(".table")
    $table.tableForm()
    $table.find('select').selectric()
    this.feeTree.renderCateFee(window.location.hash.split('#')[1])
  }

  _replaceBillItem(data) {
    for (let item of this.listData.data) {
      const newItem = data.cceBillSheetRow ? data.cceBillSheetRow : data;
      if (item.cceBillSheetRow.id === newItem.id) {
        item.cceBillSheetRow = newItem
        if (data.models) {
          item.models = data.models
        }
      }
    }
  }

  addBillItem(e) {
    this.billModal = new Modal(selectBillItemTemplate())
    this.billModal.show()
    new SelectTree({
      container: "#js-cate-container",
      operation: false,
      data: this.cateTree,
      afterSelect: (e, id) => this.getBills(e, id),

    })

    this.billModal.resetPosition()
  }

  addEditBillItem(e) {
    const emptyBill = {
      billSheetId: $.query.get('tag'),
      sheetCateId: window.location.hash.split('#')[1],
      billId: $.query.get('billId'),
      name: '默认',
      status: 1,
      isCustom: 1,
      isSupply: 0
    }

    $.ajax({
      url: `/api/bill-sheet-rows`,
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(emptyBill)
    }).done(result => {
      if (result) {
        emptyBill.id = result;
        this.listData.data.push({cceBillSheetRow: emptyBill})
        this.refreshList()
      }
    })
  }

  insertBillItem(e) {
    this.insertEl = $(e.currentTarget).parents('.js-bill-item');
    this.addBillItem(e)
  }

  getBills(e, leafModelCate) {
    if (e.preventDefault) {
      e.preventDefault();
    }
    this.pagingTemplates({leafModelCate})
  }

  pagingTemplates({pageNo = 1, pageSize = 5, leafModelCate}) {
    const name = $('[data-role="searchName"]').val()
    $.ajax({
      url: "/api/standard-bill/paging",
      type: "GET",
      data: {
        leafMajorId: this.$major.data('major'),
        product: this.$major.data('product'),
        cityCode: this.cityCode,
        pageNo,
        pageSize,
        leafModelCate,
        name,
        status: 1
      },
      success: (data) => {
        $("#js-standard-template-list").empty().append(standardTableTemplate(data))
        new Pagination(".js-standard-pagination").total(data.total).show(pageSize, {
          current_page: pageNo - 1,
          num_display_entries: 3,
          jump_switch: false,
          page_size_switch: false,
          callback: (pageNo) => {
            pageNo += 1;
            this.pagingTemplates({ pageNo, leafModelCate })
          }
        })
      }
    })
  }

  selectStandardBill(e) {
    const $self = $(e.currentTarget)
    $self.addClass("selected")
    $self.siblings().removeClass("selected")
    const standardBillId = $self.data("bill").id;
    const query = { billSheetId: $.query.get('tag'), sheetBranchId: window.location.hash.split('#')[1], standardBillId};
    if (this.insertEl) {
      query.afterSheetRowId = this.insertEl.data('id');
    }
    if (this.replaceEl) {
      query.replaceSheetRowId = this.replaceEl.data('id');
    }
    $.ajax({
      url: "/api/bill-sheet-row",
      type: "POST",
      data: query,
      success: (data) => {
        this.renderList()
        $(".modal .close").trigger("click")
      }
    })
  }

  selectBill(e) {
    const $self = $(e.currentTarget)
    $self.addClass("selected").siblings().removeClass("selected")
    const id = $self.data("id")
    this.getBillModels(id)
  }

  getBillModels(sheetRowId) {
    $.ajax({
      url: `/api/bill-sheet-row/${sheetRowId}/models`,
      type: "GET",
      success: (models) => {
        this.selectedBillModels = models
      }
    })
  }

  changeBillItem(e) {
    this.replaceEl = $(e.currentTarget).parents('.js-bill-item');
    this.addBillItem(e)
  }

  changeAttr(e) {
    const el = $(e.currentTarget);
    const models = el.data('models');
    const $attrModal = $(attrTemplate({models, id: this.id}))
    const $form = $attrModal.find("form")
    this.billSheetRowId = el.parent().data('id');
    new Modal($attrModal).show()
    $attrModal.find("select").selectric()
    $form.validator()
    $form.on("submit", ($el) => this.submitAttr($el, e))
  }

  submitAttr(e, el) {
    const models = $(e.target).serializeArray();

    const query = this.resolveModels(models);

    $.ajax({
      url: `/api/bill-sheet-row/${this.billSheetRowId}/attr`,
      contentType: 'application/json',
      data: JSON.stringify(query),
      type: 'PUT'
    }).done(result => {
      this._replaceBillItem(result)
      this.refreshList()
      $('.modal .close').trigger('click');
    })
  }

  resolveModels(models) {
    const modelObj = {};

    for (let model of models) {
      const key = model.name.split(':')[0];
      const id = model.name.split(':')[1];

      if (!modelObj[id]) {
        modelObj[id] = {}
      }

      if (!modelObj[id][key]) {
        modelObj[id][key] = [];
      }

      modelObj[id][key].push(model.value);
    }

    return modelObj
  }

  editBillItem(e) {
    const $el = $(e.currentTarget);
    const $parents = $el.parents('.js-bill-item');
    const name = $el.attr('name');
    const query = {};

    if (name === 'item-price') {
      query[$el.data('name')] = parseInt(($el.val() * 100).toFixed(0))
      $.ajax({
        url: `/api/bill-sheet-row/${$parents.data('id')}/${name}`,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(query)
      }).done(result => {

      })
    } else {
      if (name === 'unit-price') {
        query[toCamel(name)] = parseInt(($el.val() * 100).toFixed(0));
      } else  {
        query[toCamel(name)] = $el.val();
      }

      $.ajax({
        url: `/api/bill-sheet-row/${$parents.data('id')}/${name}`,
        type: 'PUT',
        data: query
      }).done(result => {
        if (result && result.id) {
          this._replaceBillItem(result)
          this.refreshList()
        }
      })
    }


    function toCamel(str) {
      const index = str.indexOf('-');
      let arr = [];

      if (index !== -1) {
        arr = str.split('-');
        arr[1] = arr[1].charAt(0).toUpperCase() + arr[1].substring(1)
      }

      return arr.length > 0 ? arr.join('') : str
    }
  }

  deleteBillItem(e) {
    const $tr = $(e.currentTarget).parents('tr');

    $.ajax({
      url: '/api/bill-sheet-row/' + $tr.data('id'),
      type: 'DELETE'
    }).done(result => {
      if (result) {
        for (let i = 0; i < this.listData.data.length; i++) {
          const item = this.listData.data[i];
          if (item.cceBillSheetRow.id == $tr.data('id')) {
            this.listData.data.splice(i, 1)
          }
        }
        $tr.remove();
      }
    })
  }

  showDetailTab(e) {
    const models = this.selectedBillModels
    if (models && models.length > 0) {
      this.$detailTab = $(detailTabTemplate({models}))
      new Modal(this.$detailTab).show()
      $(".tab").tab({
        after: (index) => this.selectTab(index)
      })
      this.getModelDetail(models[0].id)
    }
  }

  selectTab(index) {
    const billModelId = $(`.js-bill-item-tab:eq(${index})`).data("id")
    this.getModelDetail(billModelId)
  }

  getModelDetail(billModelId) {
    $.ajax({
      url: `/api/bill-item/${billModelId}/billItems`,
      type: "GET",
      success: (data) => {
        const $tab = $(`.js-tab-content[data-id=${billModelId}]`, this.$detailTab)
        $tab.empty().append(detailTableTemplate({data}))
        _.each($tab.find("table"), (i) => {
          const itemCate = _.map($(i).data('itemCate').billItems, (i) => {
            i.children = i.children || i.weights || []
            return i
          })

          $(i).tableForm({
            data: itemCate
          })
        })
      }
    })
  }

  changeItem(e) {
    e.stopPropagation()
    this.skuType = 'change'
    const $self = $(e.currentTarget)
    const item = $self.data("item")
    const refType = item.refType
    const itemCate = $self.closest(".js-item-cate").find(".js-detail-table").data("itemCate")
    if (refType != 3) {
      $.ajax({
        url: `/api/backCategories/${item.categoryId}/ancestors`,
        type: "GET",
        success: (categories) => {
          const $selectSku = $(skuTemplate({categories, item}))
          this.skuModal = new Modal($selectSku)
          this.skuModal.show()
          $selectSku.find("select").selectric()
          this.renderItemSku(item)
        }
      })
    }
  }

  addItem(e) {
    e.stopPropagation()
    this.skuType = 'add';
    this.skuAddEl = $(e.currentTarget);
    const $self = $(e.currentTarget)
    const item = $self.data("item")
    const itemCate = $self.closest(".js-item-cate").find(".js-detail-table").data("itemCate")
    if (this.categories) {
      this.showSelectSku(itemCate, item)
    } else {
      $.ajax({
        url: `/api/backCategories/tree`,
        type: "GET",
        success: (categories) => {
          this.categories = categories
          this.showSelectSku(itemCate, item)

          // this.renderItemSku(item)
        }
      })
    }
  }

  showSelectSku(itemCate, item) {
    const categories = this.categories
    const $selectSku = $(skuTemplate({itemCate}))
    this.skuModal = new Modal($selectSku)
    this.skuModal.show()

    new SelectTree({
      container: "#js-bill-cate-container",
      data: categories,

      afterSelect: this.selectBillCate.bind(this),
    })

    this.skuModal.resetPosition()

    // this.renderItemSku(item)
  }

  selectBillCate(e, id) {
    $("#js-bill-sku-container,#js-bill-item-container").empty()
    this.renderItem({categoryId: id})
  }

  selectItem(e) {
    const $self = $(e.currentTarget)
    $self.addClass("selected").siblings().removeClass("selected")
    const item = $self.data("item")
    const $selectWeight = $(".js-select-weight")
    $selectWeight.length ? $selectWeight.trigger("change") : this.renderItemSku(item)
  }

  renderItemSku(item, pageNo = 1, pageSize = 5) {
    const keyword = 0
    $.ajax({
      url: "/api/sku/paging",
      type: "get",
      data: { materialId: item.refId || item.id, pageNo, pageSize },
      success: (skus) => {

        $("#js-bill-sku-container").replaceWith(itemSkuListTemplate(skus))
        new Pagination(".js-sku-pagination").total(skus.total).show(pageSize, {
          current_page: pageNo - 1,
          num_display_entries: 3,
          jump_switch: false,
          page_size_switch: false,
          callback: (pageNo) => {
            this.renderItemSku(item, pageNo + 1)
          }
        })
        this.skuModal.resetPosition()
      }
    })
  }

  renderItem(item, pageNo = 1, pageSize = 5) {
    $.ajax({
      url: "/api/material/paging",
      type: "get",
      data: { categoryId: item.categoryId, pageNo, pageSize },
      success: (items) => {
        $("#js-bill-item-container").replaceWith(itemListTemplate(items))
        $("select").selectric()
        new Pagination(".js-item-pagination").total(items.total).show(pageSize, {
          current_page: pageNo - 1,
          num_display_entries: 3,
          jump_switch: false,
          page_size_switch: false,
          callback: (pageNo) => {
            this.renderItem(item, pageNo + 1)
          }
        })
        this.skuModal.resetPosition()
      }
    })
  }

  selectSku(e) {
    const $self = $(e.currentTarget)
    const billItem = this.organizeItem($self)

    if (billItem.id) {
      this.updateItemSku(billItem)
    } else {
      this.createItemSku(billItem)
    }
  }

  organizeItem($self) {
    $self.addClass("selected").siblings().removeClass("selected")
    const $selectSkuModal = $self.closest(".js-select-sku-modal")
    const sku = $self.data("sku")
    const {id, categoryId, materialId} = sku
    const billModel = $(".js-bill-item-tab.active").data()
    const {item, itemCate} = $selectSkuModal.data()
    const itemCateKey = itemCate.key
    const itemCateName = itemCate.name
    const $item = $(".js-item-tr.selected", $selectSkuModal)

    const skuValueMap = _.object(_.map(sku.attrs, (i) => [i.attrKey, i.attrVal]))

    return {
      id: item && item.id,
      skuId: sku.id,
      categoryId,
      materialId,
      name: $item.length ? $item.data("item").name : item.name,
      billModelId: billModel.id,
      modelId: billModel.modelId,
      skuValueMap,
      itemCateKey,
      itemCateName,
    }
  }

  updateItemSku(billItem) {
    $.ajax({
      url: "/api/bill-item/calculation",
      type: "PUT",
      contentType: "application/json",
      data: JSON.stringify(billItem)
    }).done(data => {
      $(`.js-item-info[data-id=${billItem.id}]`).replaceWith(detailChildItemTemplate(data))
      this.getBills({}, this.branchId)
      this.skuModal.close()
    })
  }

  createItemSku(billItem) {
    const unit = $("#js-bill-item-container .js-item-tr.selected option:selected").data("unit")
    _.extend(billItem, {unit: unit.name, unitId: unit.id, type: 1, pid: 0, refType: 3})
    $.ajax({
      url: "/api/bill-item",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(billItem),
      success: (data) => {
        this.skuAddEl.closest('.js-item-cate').find('table tbody').append(detailChildItemTemplate(data))
        this.getBills({}, this.branchId)
        this.skuModal.close()
      }
    })
  }

  editItem(e) {
    const $el = $(e.currentTarget);
    const name = $el.attr('name')
    const query = {
      id: $el.closest('tr').data('id')
    };

    query[name] = name === 'netAmount' ? $el.val() : ($el.val() / 100).toFixed(4)
    $.ajax({
      url: '/api/bill-item',
      type: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify(query)
    }).done(result => {
    })
  }

  delItem(e) {
    const $self = $(e.currentTarget)
    const billItemId = $(e.currentTarget).data("id")
    $.ajax({
      url: `/api/bill-item/${billItemId}`,
      type: "DELETE",
      success: (data) => {
        $self.closest(".js-item-info").remove()
      }
    })
  }

  addEditSku(e) {
    // new Modal(attrTemplate({})).show()
  }
}

module.exports = Measurement

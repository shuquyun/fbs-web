const TreeComp = require('./select_tree');
const SelectTree = require("common/tree_comp/view");
const FeeTree = require('list/fee_sum/view')

const { Modal, Pagination } = require("pokeball")
const billItemTemplate = Handlebars.partials["list/division/all_templates/_bill_item"]
const billListTemplate = Handlebars.templates["list/division/all_templates/bill_list"]
const selectBillItemTemplate = Handlebars.templates["list/division/frontend_templates/select_bill_item"]

const standardTableTemplate = Handlebars.partials["list/division/frontend_templates/_standard_table_list"]
const attrTemplate = Handlebars.templates["list/division/frontend_templates/attr"]

const detailTabTemplate = Handlebars.templates["list/division/frontend_templates/detail_tab"]
const detailTableTemplate = Handlebars.partials["list/division/frontend_templates/_detail_table"]
const detailItemTemplate = Handlebars.partials["list/division/frontend_templates/_detail_item"]
const detailChildItemTemplate = Handlebars.partials["list/division/frontend_templates/_detail_child_item"]

const skuTemplate = Handlebars.templates["list/division/frontend_templates/select_sku"]
const itemListTemplate = Handlebars.partials["list/division/frontend_templates/_item_list"]
const itemSkuListTemplate = Handlebars.partials["list/division/frontend_templates/_sku_type"]
const skuListTemplate = Handlebars.partials["list/division/frontend_templates/_sku_list"]

const selectWeightTemplate = Handlebars.partials["list/division/frontend_templates/_select_weight"]
const selectSkuTemplate = Handlebars.partials["list/division/frontend_templates/_select_sku_filter"]

class Division {
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

    this.$el.on('renderList', (e, node) => this.renderList(e, node))
    // 清单行相关操作
    this.$el.on('click', '.js-add-bill', e => this.addBillItem(e))
    this.$el.on('click', '.js-add-edit-bill', (e) => this.addEditBillItem(e))
    this.$el.on('click', '.js-insert-bill-item', e => this.insertBillItem(e))
    this.$el.on("click", ".js-bill-item", (e) => this.selectBill(e))
    this.$el.on('click', '.js-model-name', (e) => this.changeBillItem(e))
    this.$el.on('click', '.js-model-attr', (e) => this.changeAttr(e))
    this.$el.on('blur', '.js-table .js-input, .js-table .js-textarea', e => this.editBillItem(e))
    this.$el.on('change', '.js-table select', (e) => this.editBillItem(e))
    this.$el.on('click', '.js-del-bill-item', (e) => this.deleteBillItem(e))
    this.$el.on('click', '.js-copy-bill-item', (e) => this.copyBillItem(e))
    this.$el.on('click', '.js-paste-bill-item', (e) => this.pasteBillItem(e))
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
    $(document).on("change", ".js-select-weight", (e) => this.selectSkuWeight(e))
    $(document).on("change", ".js-sku-attr-val-select", (e) => this.changeSkuWeightVal(e))
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
      this.refreshList()
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
        this.selectSheetRowId = sheetRowId;
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
        if (result && (result.id || result.cceBillSheetRow)) {
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

  copyBillItem(e) {
    const $tr = $(e.currentTarget).closest('tr');
    localStorage.setItem('copyBillLine', JSON.stringify({ id: $tr.data('id') }))
    new Modal({
      icon: 'info',
      title: '复制清单行成功'
    }).show()
  }

  pasteBillItem(e) {
    const copyObj = localStorage.getItem('copyBillLine');
    const $el = $(e.currentTarget);

    if (!copyObj) {
      new Modal({
        icon: 'error',
        title: '无可粘贴清单行'
      }).show()
    } else {
      $.ajax({
        url: `/api/bill-sheet-row/${JSON.parse(copyObj).id}/copy`,
        type: 'POST',
        data: {
          billSheetId: $.query.get('tag'),
          sheetCateId: window.location.hash.split('#')[1],
          targetSheetRowId: $el.closest('.js-bill-item').data('id')
        }
      }).done( result => {
        this.renderList()
      })
    }
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
        data = this.resolveItemSupplyType(data)
        $tab.empty().append(detailTableTemplate({data}))
        _.each($tab.find("table"), (i) => {
          const itemCate = _.map($(i).data('itemCate').billItems, (i) => {
            i.children = i.children || i.weights || []
            return i
          })

          $(i).tableForm({
            data: itemCate
          })

          $(i).find('select').selectric()
        })
      }
    })
  }
  // 查看当前清单行是否甲供
  resolveItemSupplyType(data) {
    let isSupply = null;

    for (let item of this.listData.data) {
      if (item.cceBillSheetRow.id === this.selectSheetRowId) {
        isSupply =  item.cceBillSheetRow.isSupply;
      }
    }

    for (let cate of data) {
      for (let item of cate.billItems) {
        item.couldChangeSupply = (item.allowSupply && isSupply)
        if (item.children && item.children.length > 0) {
          for (let child of item.children) {
            child.couldChangeSupply = (child.allowSupply && isSupply)
          }
        }
      }
    }

    return data
  }

  changeItem(e) {
    e.stopPropagation()
    this.skuType = 'change'
    const $self = $(e.currentTarget)
    const item = $self.data("item")
    const refType = item.refType
    const itemCate = $self.closest(".js-item-cate").find(".js-detail-table").data("itemCate")
    this.billItem = item
    if (refType != 3) {
      $.ajax({
        url: `/api/backCategories/${item.categoryId}/ancestors`,
        type: "GET",
        success: (categories) => {
          const $selectSku = $(skuTemplate({categories, item}))
          this.skuModal = new Modal($selectSku)
          this.skuModal.show()
          $selectSku.find("select").selectric()
          this.renderItemSkuFilter(item)
        }
      })
    }
  }

  addItem(e) {
    e.stopPropagation()
    this.skuType = 'add';
    this.skuAddEl = $(e.currentTarget);
    this.billItem = {}
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

  renderItemSkuFilter(item) {
    item && $.ajax({
      url: `/api/material/${item.refId || item.id}/skuWithAttrs`,
      type: "get",
      data: { billItemId: this.billItem.id },
      success: (attr) => {
        if (_.size(attr)) {
          $("#js-bill-sku-container").replaceWith(itemSkuListTemplate({attr, item}))
          $("#js-bill-sku-container select").selectric()
          $("#js-bill-sku-container form").validator()
          $("#js-bill-sku-container form").on('submit', (e) => this.renderItemSku(item))
        } else {
          $("#js-bill-sku-container").empty().append("<div id='js-select-sku-info'><div id='js-select-sku-table'></div></div>")
          this.renderItemSku(item)
        }
      }
    })
  }

  selectItem(e) {
    const $self = $(e.currentTarget)
    $self.addClass("selected").siblings().removeClass("selected")
    const item = $self.data("item")
    const $selectWeight = $(".js-select-weight")
    $selectWeight.length ? $selectWeight.trigger("change") : this.renderItemSkuFilter(item)
  }

  // 渲染材料下的 sku
  renderItemSku(item, pageNo = 1, pageSize = 5) {
    let {id, params} = $("#js-select-sku-info form").serializeObject()
    id = id || item.refId || item.id
    params = JSON.stringify(_.omit(params, (val, key) => val == ""))
    $.ajax({
      url: `/api/material/${id}/querySkus`,
      type: "get",
      data: { params, pageNo, pageSize },
      success: (skus) => {
        $("#js-select-sku-table").empty().append(skuListTemplate({item, skus}))
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

  // 渲染材料
  renderItem(item, pageNo = 1, pageSize = 5) {
    const {categoryId, billItemId, id} = item
    $.ajax({
      url: billItemId || id ? "/api/material/weight/paging" : "/api/material/paging",
      type: "get",
      data: { categoryId, billItemId: billItemId || id, pageNo, pageSize },
      success: (items) => {
        $("#js-bill-item-container").replaceWith(itemListTemplate(items))
        $("#js-bill-item-container select").selectric()
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

  // 渲染加权属性
  renderSkuVals(item, key, params) {
    item && key && $.ajax({
      url: `/api/material/${item.refId || item.id}/skuWithAttrs`,
      type: "GET",
      data: {key, billItemId: this.billItem.id, params},
      success: (attr) => {
        $("#js-select-sku-info").replaceWith(selectWeightTemplate({attr, key}))
        $("#js-select-sku-info select").selectric()
        $("js-weight-attr-form").validator()
        $(".js-weight-attr-form").on("submit", (e) => this.submitItemWeight(e))
      }
    })
  }

  changeSkuWeightVal(e) {
    const $self = $(e.currentTarget)
    const val = $self.val()
    const item = $(".js-item-tr.selected").length ? $(".js-item-tr.selected").data("item") : $self.closest(".js-select-sku-modal").data("item")
    const data = $self.closest("form").serializeObject()
    const params = JSON.stringify(data.defaultAttrs)
    this.renderSkuVals(item, item.weightAttr, params)
  }

  // 选择 sku 是否综合考虑
  selectSkuWeight(e) {
    const $self = $(e.currentTarget)
    const type = $self.val()
    const $item =$(".js-item-tr.selected")
    const item = $item.length ? $item.data("item") : $self.closest(".js-select-sku-modal").data("item")
    const key = $self.data("weight")

    if (($item.length == 1 && item.id) || (this.billItem.refType == 2 && item.refId)) {
      type == 1 ? this.renderSkuVals(item, key) : this.renderItemSkuFilter(item)
    }
  }

  // 提交条目加权属性
  submitItemWeight(e) {
    e.preventDefault()
    const $form = $(e.currentTarget)
    const billItemId = $form.closest(".js-select-sku-modal").data("item").id
    const data = $form.serializeObject()
    data.attrs = data.attrs.join(",")
    if (data.defaultAttrs) {
      data.defaultAttrs = JSON.stringify(data.defaultAttrs)
    }

    $.ajax({
      url: `/api/bill-item/${billItemId}/itemWeight`,
      type: "PUT",
      data,
      success: (data) => {
        const billModelId = $('.js-bill-item-tab.active').data("id")
        this.getModelDetail(billModelId)
        this.skuModal.close()
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

module.exports = Division

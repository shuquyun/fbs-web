import Modal from "pokeball/components/modal";
const SelectTree = require("common/select_tree/view")
const DetailTemplates = Handlebars.templates["developer/supplier_manage/supplier_library/frontend_templates/import_detail"];

export default class {
	constructor() {
		this.changeState = $(".js-change-state")
		this.supplierDetail = $(".js-import-detail")
		this.importSupplier = $("#js-import-supplier")
		this.bindEvent();
	}

	bindEvent() {
		this.getSpecialty()
		this.changeState.on("change", (event) => this.updateState(event));
		this.supplierDetail.on("click", (event) => this.importDetail(event));
		this.importSupplier.on("click", (event) => this.uploadSupplier(event));
	}

  getSpecialty() {
    new SelectTree({
      container: ".js-speciality-container",
      search: false,
      data: $(".js-left-special").data("special"),
      afterSelect: this.getModels
    })
    this.initSelectTree()
  }

  initSelectTree() {
    const id = $(".js-select-speciality").val()
    $(`.js-tree-item[data-id=${id}]`).parents(".js-tree-node").addClass("expand")
    $(`.js-tree-item[data-id=${id}]`).parent().addClass("selected")
  }

  getModels(e) {
    const $self = $(e.currentTarget)
    const id = $self.hasClass("no-children") && $self.parent().hasClass("selected") ? $self.data("id") : ""
    if (id) {
      $(".js-select-speciality").val(id)
      $(".js-search-result").trigger("click")
    }
  }

  // 状态变更操作
  updateState(event) {
    $("body").spin("medium")
		const state = $(event.target).val(),
				supplierId = $(event.currentTarget).parents("td").data("supplier");
		$.ajax({
			url: `/api/supplier/manage/operation`,
			method: "GET",
			data: { state, supplierId },
			success: () => {
        $("body").spin(false)
        window.location.search = $.query.set("fromdb", 0).set("upd", 1)
      }
		})
	}

	// 入库详情
	importDetail(event) {
		const supplierId = $(event.currentTarget).data("supplier");
		$.ajax({
			url: `/api/supplier/manage/import/details?supplierId=${supplierId}`,
			type: "GET",
			success: (data) => {
				new Modal(DetailTemplates({ data: data, title: "库内供应商详情" })).show();
			}
		})
	}
	// 导入供应商上传文件
	uploadSupplier(event) {
    let $self = $(".btn-upload input[name=file]"),
        target = $(".btn-upload").parent("span3");
    $self.fileupload({
      url: "/api/supplier/import/model",
      type: "POST",
      dataType: "html",
      start: () => {
        target.spin("medium")
      },
      done: (evt, data) => {
        window.location.href = "/developer/supplier-list";
      },
      always: () => {
        target.spin(false);
      },
      error: () => {
        target.spin(false);
      }
    })
  }
}
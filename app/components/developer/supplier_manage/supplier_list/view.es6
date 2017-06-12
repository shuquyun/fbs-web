import SupplierLibrary from "developer/supplier_manage/supplier_library/view";

const Modal = require("pokeball").Modal,
      DetailTemplates = Handlebars.templates["developer/supplier_manage/supplier_library/frontend_templates/import_detail"];

export default class extends SupplierLibrary {

  bindEvent() {
    super.bindEvent()
    $(".js-add-collect").on("click", (event) => this.addCollect(event))
  }

  // 入库详情
  importDetail(event) {
    const supplierId = $(event.currentTarget).data("supplier")
		$.ajax({
			url: `/api/supplier/manage/import/details?supplierId=${supplierId}`,
			type: "GET",
			success: (data) => {
				new Modal(DetailTemplates({ data: data, title: "导入供应商详情" })).show()
			}
		})
	}

  // 加入待考察供应商
  addCollect(event) {
    const id = $(event.currentTarget).data("id")
    $.ajax({
      url: `/api/supplier/collection/join?id=${id}`,
      type: "POST",
      success: () => location.reload()
    })
  }
}

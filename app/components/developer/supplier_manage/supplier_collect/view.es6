import SupplierLibrary from "developer/supplier_manage/supplier_library/view";

export default class extends SupplierLibrary {

  bindEvent() {
    super.bindEvent()
    this.collectDelete = $(".js-delete-collect")
    this.unqualifySet = $(".js-set-unqualify")
    this.collectDelete.on("click", (event) => this.deleteCollect(event))
  }

  // 取消待考察供应商
  deleteCollect(event) {
    $("body").spin("medium")
    const id = $(event.currentTarget).data("id")
    $.ajax({
      url: `/api/supplier/manage/collection/delete?supplierId=${id}`,
      type: "POST",
      success: () => {
        setTimeout(() => {
          $("body").spin(false)
          window.location.search = $.query.set("fromdb", 0).set("upd", 1)
        }, 500)
      }
    })
  }
}

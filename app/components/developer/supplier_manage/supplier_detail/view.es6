export default class {
  constructor() {
    this.bindEvent()
  }

  bindEvent() {
    $(".js-add-collect").on("click", (event) => this.addCollect(event))
    $(".js-delete-collect").on("click", (event) => this.deleteCollect(event))
    $(".js-img-show").enlargePicture()
  }

  // 加入待考察供应商
  addCollect(event) {
    const id = $(event.currentTarget).data("id")
    $.ajax({
      url: `/api/supplier/detail/join?supplierId=${id}&source=2`,
      type: "POST",
      success: () => location.reload()
    })
  }

  // 取消待考察供应商
  deleteCollect(event) {
    const id = $(event.currentTarget).data("id")
    $.ajax({
      url: `/api/supplier/manage/collection/delete?supplierId=${id}`,
      type: "POST",
      success: () => location.reload()
    })
  }
}

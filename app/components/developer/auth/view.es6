class Auth {

  constructor() {
    this.jsAuthCreate = $(".js-add-auth")
    this.bindEvents()
  }

  bindEvents() {
    this.jsAuthCreate.on("click", (event) => this.authCreate(event));
    $(document).on("confirm:delete", this.authDelete);
  }

  authDelete(event, id) {
    $.ajax({
      url: `/api/company/role/${id}`,
      type: "DELETE",
      success: () => {
        location.reload()
      }
    });
  }
}

module.exports = Auth

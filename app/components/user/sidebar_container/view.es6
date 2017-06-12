/**
 * by JSANN
 */

class Sidebar {
  constructor() {
    this.bindEvents()
  }

  bindEvents() {
    $(".sidebar-portal").on("click", (event) => this.toggleProtal(event))
    $(".other-portals").on("click", "a", (event) => this.changeProtal(event))
    $(".nav").on("click", ".nav-list-header", (event) => this.toggleMenu(event))
  }

  toggleProtal(event) {
    $(".other-portals").toggleClass("hide")
  }

  changeProtal(event) {
    event.preventDefault();
    let target = $(event.currentTarget);
    $.ajax({
      url: `/api/sidebar/scope?value=${target.data("scope")}`,
      type: "PUT",
      success: (data) => {
        location.href = target.attr("href");
      }
    })
  }

  toggleMenu(event) {
    $(event.currentTarget).parents("li").toggleClass("nav-open")
  }
}

module.exports = Sidebar

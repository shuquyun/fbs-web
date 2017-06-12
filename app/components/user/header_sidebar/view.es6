class HeaderSidebar {
  constructor($) {
    this.$jsNavBtn = $(".js-nav-btn")
    this.$logout = $("#js-user-logout")
    this.$changeCompany = $(".js-exchange-company")
    this.bindEvents()
  }

  bindEvents() {
    this.$logout.on("click", () => this.logoutEvent())
    this.$jsNavBtn.hover((evt) => this.showProtal(evt), () => this.closeProtal())
    this.$changeCompany.hover((evt) => this.exchangeCompany(evt), () => this.hideCompany())
  }

  showProtal(evt) {
    const $self = $(evt.currentTarget)
    $('.navs-content').removeClass('active')
    $self.children('.navs-content').addClass('active')
  }

  closeProtal() {
    $('.navs-content').removeClass('active')
    $(".navs-ul").find(".nav-li.nav-open").find(".navs-content").addClass("active")
  }

  exchangeCompany(evt) {
    const companyLists = $(evt.target).data("company")
    if (companyLists.length !== 1) {
      $(evt.target).find(".select-company-box").removeClass("hide")
      $(".each-company").on("click", (event) => this.selectCompany(event))
    }
  }

  hideCompany() {
    $(".select-company-box").addClass("hide")
  }

  selectCompany(evt) {
    const companyId = $(evt.target).data("id")
    $.ajax({
      url: `/api/company/sub/select/${companyId}`,
      type: "get",
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      success: (data) => {
        const url = data.type === 1 ? "developer" : "supplier"
        window.location.href = `/${url}/index`
      }
    })
  }

  logoutEvent() {
    $.ajax({
      url: '/api/user/logout',
      type: 'POST',
      success: () => {
        window.location.href = '/'
      }
    })
   }
}

module.exports = HeaderSidebar

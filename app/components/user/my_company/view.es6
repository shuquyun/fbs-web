const Modal = require('pokeball').Modal
const addCompanyModal = Handlebars.templates['user/my_company/frontend_templates/add_company_modal']

class MyCompany {
  constructor($) {
    this.$add = $(".js-add-company")
    this.modal = ""
    this.bindEvent()
  }

  bindEvent() {
    this.$add.on("click", () => this.showAddModal())
    $(document).on("confirm:quit", (event, id) => this.quitCompany(event, id))
    $(document).on("confirm:accept", (event, id) => this.acceptCompany(event, id))
    $(document).on("confirm:refuse", (event, id) => this.refuseCompany(event, id))
  }

  showAddModal() {
    this.modal = new Modal(addCompanyModal({}))
    this.modal.show()
    $("#company-name").on("focus", () => this.hideNote())
    $(".add-company-form").validator({ isErrorOnParent: true })
    $(".add-company-form").on("submit", (event) => this.checkCompany(event))
  }

  // 检查公司是否存在
  checkCompany(evt) {
    evt.preventDefault()
    const data = $(evt.target).serializeObject()
    const $submitBtn = $(".js-add-company-submit")
    $submitBtn.prop("disabled", true)
    $.ajax({
      url: `/api/company?companyName=${data.name}`,
      type: "get",
      success: (result) => {
        $submitBtn.prop("disabled", false)
        $(".add-company-form").off()
        if (result.id) {
          $(".has-register").removeClass("hide")
          $submitBtn.text("加入该公司")
          $(".add-company-form").on("submit", (event) => this.addCompany(event, result))
        } else {
          $(".not-register").removeClass("hide")
          $submitBtn.text("创建新公司")
          $submitBtn.attr("type", "button")
          $submitBtn.on("click", () => {
            window.location.href = `/register-company?companyName=${data.name}`
          })
        }
      }
    })
  }

  addCompany(evt, companyData) {
    evt.preventDefault()
    $(".js-add-company-submit").prop("disabled", true)
    const data = $(evt.target).serializeObject()
    data.companyType = companyData.type
    data.companyId = companyData.id
    data.companyName = data.name
    $.ajax({
      url: "/api/company/join",
      type: "GET",
      contentType: "application/json",
      data: data,
      success: () => {
        this.modal.close()
        new Modal({
          icon: "info",
          title: "申请成功",
          content: "请等待审核结果"
        }).show(() => window.location.reload())
      }
    })
  }

  // 重新写公司名时 重新检测公司
  hideNote() {
    const $submitBtn = $(".js-add-company-submit")
    $submitBtn.prop("disabled", false).text("确认")
    $submitBtn.off().attr("type", "submit")
    $(".has-register, .not-register").addClass("hide")
    $(".add-company-form").off().validator({ isErrorOnParent: true })
    $(".add-company-form").on("submit", (evt) => this.checkCompany(evt))
  }

  quitCompany(evt, id) {
    $.ajax({
      url: `/api/company/sub/my/${id}`,
      type: "delete",
      contentType: "application/json",
      success: () => {
        const companyId = $(".js-exchange-company").data("data").companyId
        parseInt(id) === companyId ? this.quitCurrentCompany() : window.location.reload()
      }
    })
  }

  quitCurrentCompany() {
    $.ajax({
      url: `/api/company/sub/my`,
      type: "GET",
      success: (data) => {
        if (data.length === 0) {
          window.location.href = "/register-company"
        } else {
          window.location.reload()
        }
      }
    })
  }

  acceptCompany(evt, id) {
    $.ajax({
      url: "/api/company/sub/invites-join",
      type: "POST",
      data: { subCompanyId: id },
      success: () => {
        window.location.reload()
      }
    })
  }

  refuseCompany(evt, id) {
    $.ajax({
      url: "/api/company/sub/invites-refuse",
      type: "POST",
      data: { subCompanyId: id },
      success: () => {
        window.location.reload()
      }
    })
  }
}

module.exports = MyCompany
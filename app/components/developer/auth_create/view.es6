const Modal = require("pokeball").Modal,
      nextOperateTemplate = Handlebars.templates["developer/auth_create/frontend_templates/next_operate"];

class AuthCreate {

  constructor() {
    this.jsAddAuth = $(".js-add-auth")
    this.jsEditAuth = $(".js-edit-auth")
    this.authForm = ".addauth-form"
    this.bindEvents()
  }

  bindEvents() {
    $(this.authForm).validator({isErrorOnParent: true})
    $(document).on("click", ".auth-list input:checkbox", (event) => this.checkAll(event));
    $(document).on("submit", this.authForm, (event) => this.authSubmit(event));
    this.renderAuthData();
  }

  /**
   * 获取权限有关的数据
   * @return {[type]} [description]
  **/
  renderAuthData() {
    const role = $(this.authForm).data('auth-role')
    $.ajax({
      url: `/api/auth/tree?role=${role}`,
      type: "GET",
      success: (data) => {
        let el = $(".auth-list"),
            checked = el.data("info");
        el.html(this.renderAuthList("", data, checked))
        _.each($(el.find("li.last")), (obj, index)=>{
          if(!($(obj).find("ul").length)){
            this.checkPrent($(obj).parents('ul:first'))
          }
        })
      }
    })
  }

  /**
   * 渲染权限树
   * @param  {string} str  dom string
   * @param  {array} data 权限树对象
   * @return {string}      组装好的 dom string
   */
  renderAuthList(str, data, checked) {
    if(_.isEmpty(data)) return str;
    !_.isArray(data) && (data = [data]);
    str += "<ul>";
    _.map(data, (v, i) => {
      str += `<li ${data.length == ++ i ? "class='last'" : ""}><label><input type='checkbox' class='input-checkbox' value='${v.key || ""}' ${_.indexOf(checked, v.key) != -1 ? "checked" : ""}>${v.name || "所有权限"}</label>`;
      v.children && (str = this.renderAuthList(str, v.children, checked));
      str += "</li>";
    })
    return str + "</ul>";
  }

  checkAll(event) {
    $(event.currentTarget).parents("li:first").find("input:checkbox").prop("checked", $(event.currentTarget).prop("checked")).attr("indeterminate", false)
    $(event.currentTarget).parents("li:first").find("input:checkbox").prop({"checked": $(event.currentTarget).prop("checked"), "indeterminate": false})
    this.checkPrent($(event.currentTarget).parents("ul:first"))
  }

  checkPrent(parent) {
    let input = parent.prev().find("input:checkbox");
    if(parent.find("input:checkbox").length == parent.find("input:checkbox:checked").length) {
      input.removeClass("indeterminate").prop("checked", true).attr("indeterminate", false);
      input.removeClass("indeterminate").prop({"checked": true, "indeterminate": false});
    } else if(!parent.find("input:checkbox:checked").length) {
      input.removeClass("indeterminate").prop("checked", false).attr("indeterminate", false);
      input.removeClass("indeterminate").prop({"checked": false, "indeterminate": false})
    } else {
      input.prop("checked", false).attr("indeterminate", true);
      input.prop({"checked": false, "indeterminate": true});
    }
    parent.parents("ul:first").length && this.checkPrent(parent.parents("ul:first"));
  }

  /**
   * 获取权限树数据
   * @param  {jquery object} el checked checkbox
   * @return {array}    权限树数据
   */
  getAuthData(el, data = []) {
    el.each((i, el) => data.push($(el).val()));
    return data;
  }

  /**
   * 创建/更新角色
   * @param  {[type]} event [description]
   * @return {[type]}       [description]
   */
  authSubmit(event) {
    event.preventDefault();
    let data = $(event.currentTarget).serializeObject(),
        arr = this.getAuthData($(".auth-list input:checkbox:checked"));
    if(!arr.length) {
      new Modal({
        icon: "info",
        title: i18n.ct('tips', 'shop'),
        content: i18n.ct('onePermission', 'shop'),
      }).show();
      return false;
    }
    data.allow = arr;
    data.active = true;
    const companyType = $(this.authForm).data('company-type')
    $.ajax({
      url: `/api/company/role/${data.id ? "/" + data.id : ""}`,
      type: data.id ? "PUT" : "POST",
      data: JSON.stringify(data),
      contentType: "application/json",
      success: (data1) => {
        new Modal(nextOperateTemplate({ user: $(event.currentTarget).data("user"), data, companyType })).show()
      }
    });
  }
}

module.exports = AuthCreate

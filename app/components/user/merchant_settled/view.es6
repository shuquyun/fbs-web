const Modal = require("pokeball").Modal,
      properties = require("user/resources/properties")
const Address = require("common/address_select/view")
const picItemTemplate = Handlebars.templates["user/merchant_settled/frontend_templates/pic_item"]
const optionsTemplate = Handlebars.templates["common/address_select/frontend_templates/options"]
class BuyerMerchantSettled extends Address{

  constructor($) {
    super($)
    this.$upload = $(".js-upload")
    this.$form = $(".js-merchant-settled-form")
    this.picClose = ".js-pic-close"
    this.levels = properties.resource.address.shopProfileLevel
    this.bindEvents()
  }

  bindEvents() {
    this.validateForm()
    this.upload()
    this.$form.on("submit", (evt) => this.formSubmit(evt))
    $(document).on("click", this.picClose, evt => this.removePic(evt))
  }


  /**
   * 获取市列表
   * @param  {[type]} event      [description]
   * @param  {[type]} option [description]
   * @return {[type]}        [description]
   */
  selectAddress(event, option) {
    let level = option ? option.level : + $(event.currentTarget).data("level") + 1,
        parent = $(`${this.addressSelect}[data-level=${level - 1}]`),
        parentId = parent.length ? parent.val() : 0;
    option = option || {level};
    $.get(`/api/address/${parentId}/children`, (data) => {
      $(`${this.addressSelect}[data-level=${level}]`).html(optionsTemplate({data}));
      option.ids && $(`${this.addressSelect}[data-level=${level}]`).find(`option[value=${option.ids[level - 1]}]`).prop("selected", true);
      $(`${this.addressSelect}[data-level=${level}]`).selectric("refresh");
      (++ option.level <= this.levels) && this.selectAddress({}, option);
    })
  }

  validateForm() {
    this.$form.validator({
      identifier: 'input[type=text]',
      isErrorOnParent: true
    })
  }

  upload() {
    $("input[type=file]").fileupload({
      url: "/api/user/files/upload",
      dataType: "html",
      done: function(evt, data){
        let url = _.values(JSON.parse(data.result))[0];
        $(evt.target).closest('.control-group').find(".pic-list").append(picItemTemplate({url}))
      }
    })
  }

  removePic(evt) {
    $(evt.currentTarget).closest(".item").remove()
  }

  validatorPic() {
    let flag = true
    _.each($(".js-need-picture"), (i) => {
      if($(i).find(".item").length < 1) {
       flag = false
       this.showEssage($(i).data("message"))
       return false
      }
    })
    return flag
  }

  showEssage(message, status = "error", time = 2000){
    Essage.show({
      message: message,
      status: status
    }, time)
  }

  formSubmit(evt) {
    evt.preventDefault()
    let flag = this.validatorPic()
    if(flag){
      let data = this.$form.serializeObject()
      data = this.getAreaName(data)
      data = this.getPicUrl(data)
      $.ajax({
        url: "/api/seller/apply",
        type: "post",
        data: JSON.stringify({extra: data}),
        contentType: "application/json",
        success: (data) => {
          window.location.reload()
        }
      })
    }
  }

  getAreaName(data) {
    data.provinceName = $("select[name=provinceId]").find("option:selected").text()
    data.cityName = $("select[name=cityId]").find("option:selected").text()
    data.regionName = $("select[name=regionId]").find("option:selected").text()
    return data
  }

  getPicUrl(data) {
    _.each($(".js-pic"), (i) => {
      data[$(i).data("name")] = this.getPicUrlDetail($(i), $(i).data("type"))
    })
    return data
  }

  // type string or arry
  getPicUrlDetail(_this, type) {
    if(type === "arry") {
      var data = []
    }
    else{
      var data
    }

    _.each($(_this).find(".item"), (i) => {
      if(type === "arry"){
        data.push($(i).find("img").attr("src"))
      }
      else{
        data = $(i).find("img").attr("src")
      }
    })

    return data
  }
}

module.exports = BuyerMerchantSettled

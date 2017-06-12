const optionsTemplate = Handlebars.templates["common/address_select/frontend_templates/options"]

class Address {

  constructor($) {
    this.initAddress()
  }

  /**
   * 初始化地址
   * @type {Function}
   */
  initAddress(container) {
    this.addressSelect = ".address-select";
    container = container ? container : $(document);
    $(container).on("change", this.addressSelect, event => this.selectAddress(event));
    let provinceId = parseInt($(`${this.addressSelect}[data-level=1]`, container).val()),
        cityId = parseInt($(`${this.addressSelect}[data-level=2]`, container).val()),
        regionId = parseInt($(`${this.addressSelect}[data-level=3]`, container).val());
    const type = $(`${this.addressSelect}[data-level=1]`, container).data('type')
    this.selectAddress({}, {ids: [provinceId, cityId, regionId], level: 1}, container, type)
  }

  /**
   * 获取市列表
   * @param  {[type]} event      [description]
   * @param  {[type]} option [description]
   * @return {[type]}        [description]
   */
  selectAddress(event, option, container, type) {
    let level = option ? option.level : + $(event.currentTarget).data("level") + 1,
        thisContainer = container ? container : $(event.currentTarget).closest(".control-group"),
        parent = $(`${this.addressSelect}[data-level=${level - 1}]`, thisContainer),
        parentId = parent.length ? parent.val() : '0'
    option = option || {level};
    let $currentLevel = $(`${this.addressSelect}[data-level=${level}]`, thisContainer);
    $currentLevel.is(':visible') && $currentLevel.spin("small");
    if (!_.isEmpty(parentId)) {
      $.get(`/api/address/${parentId}/children`, (data) => {
        if (type === 'hide') {
          $currentLevel.html('<option value="">请选择</option>')
          $currentLevel.append(optionsTemplate({data}))
        } else {
          $currentLevel.html(optionsTemplate({data}))
        }
        option.ids && $currentLevel.find(`option[value=${option.ids[level - 1]}]`).prop("selected", true);
        $currentLevel.selectric("refresh");
        $currentLevel.spin(false);
        (option.level ++ <= 3) && this.selectAddress({}, option, thisContainer, type)
      })
    } else {
      $currentLevel.html(optionsTemplate())
      $currentLevel.selectric("refresh");
    }
  }

  /**
   * 提交地址
   * @param  {[type]} event [description]
   * @return {[type]}     [description]
   */
  submitAddress(event) {
    event.preventDefault();
    let userTradeInfo = $("#address-form").serializeObject();
    userTradeInfo.province = $(`.address-select[data-level=1] option[value=${userTradeInfo.provinceId}]:selected`).text()
    userTradeInfo.city = $(`.address-select[data-level=2] option[value=${userTradeInfo.cityId}]:selected`).text()
    userTradeInfo.region = $(`.address-select[data-level=3] option[value=${userTradeInfo.regionId}]:selected`).text()
    userTradeInfo.street = $(`.address-select[data-level=4] option[value=${userTradeInfo.streetId}]:selected`).text()
    $.ajax({
      url: "/api/buyer/receiver-infos" + ($("#addressId").length == 0 ? "" : "/"+$("#addressId").val()),
      type: $("#addressId").length == 0 ? "POST" : "PUT",
      data: JSON.stringify(userTradeInfo),
      contentType: "application/json",
      success: data => {
        window.location.reload()
      }
    });
  }
}

module.exports = Address

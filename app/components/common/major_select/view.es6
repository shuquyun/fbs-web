const optionsTemplate = Handlebars.templates["common/address_select/frontend_templates/options"]

class MajorSelect {

  constructor($) {
    this.initMajor()
  }
  /**
   * 初始化专业
   * @type {Function}
   */
  initMajor(container) {
    this.majorSelect = ".major-select"
    container = container ? container : $(document)
    $(container).on("change", this.majorSelect, event => this.selectMajor(event))
    const major1 = parseInt($(`${this.majorSelect}[data-level=1]`, container).val()),
          major2 = parseInt($(`${this.majorSelect}[data-level=2]`, container).val())
    this.selectMajor({}, {ids: [major1, major2], level: 1 }, container)
  }

  selectMajor(event, option, container) {
    const level = option ? option.level : + $(event.currentTarget).data("level") + 1,
        thisContainer = container ? container : $(event.currentTarget).closest(".control-group"),
        parent = $(`${this.majorSelect}[data-level=${level - 1}]`, thisContainer),
        parentId = parent.length ? parent.val() : 1
    option = option || { level }
    let $currentLevel = $(`${this.majorSelect}[data-level=${level}]`, thisContainer)
    $currentLevel.is(':visible') && $currentLevel.spin("small")
    if (parentId) {
      $.get(`/api/base-major/children/${parentId}`, (data) => {
        data.unshift({ id: '', name: '请选择' })
        $currentLevel.html(optionsTemplate({ data }))
        option.ids && $currentLevel.find(`option[value=${option.ids[level - 1]}]`).prop("selected", true)
        $currentLevel.selectric("refresh")
        $currentLevel.spin(false);
        (option.level ++ <= 2) && this.selectMajor({}, option, thisContainer)
      })
    } else {
      $currentLevel.html(optionsTemplate())
      $currentLevel.selectric("refresh")
    }
  }
}

module.exports = MajorSelect

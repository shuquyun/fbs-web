/** 这是个多选专业以及地址的基础组件
 *  需要将存ids的 节点加个js-${type}-id 的类
 *  然后将每一个选择的子选择项加一个  each-${type} 类
*/

const containerTemplate = Handlebars.templates["common/select_speciality/frontend_templates/container"]
const specialityTemplate = Handlebars.partials["common/select_speciality/frontend_templates/_speciality"]

class SelectSpeciality {
  constructor(options) {
    this.options = _.extend({
      api: "/api/base-major/register-tree",
      index: "body",
      type: "speciality",   // 不同的type用作不同的作用
      data: null,
      selectMore: true,
      afterSelect: null,
      deleteSelect: null,
    }, options)
    this.$el = $(containerTemplate())
    this.$index = $(this.options.index)
    this.$type = $(this.options.type).selector
    this.init()
    this.bindEvent()
  }

  bindEvent() {
    $(this.$index).on("click", () => this.showSelector())
    this.$el.on("click", ".js-category-item", (e) => this.selectCategory(e))
    $(document).on("click", (e) => this.hideSelector(e))
    this.$index.on("click", ".js-delete-selected", (e) => this.deleteSelected(e))
  }

  init() {
    this.$el.spin("medium")
    $(this.$index).siblings(".js-selector-container").append(this.$el)
    this.initRenderData()
  }

  // 初始化向 多选容器放 初始化的数据
  initRenderData() {
    $.ajax({
      url: this.options.api,
      type: "get",
      success: (data) => {
        this.$el.empty().append(specialityTemplate({ data }))
        this.$el.spin(false)
      }
    })
  }

  // 渲染子节点的数据
  renderChildrenData(nodeData) {
    if (this.$type === "city" && nodeData) {
      const ids = this.$index.siblings(`.js-${this.$type}-id`).val()
      this.$el.spin("medium")
      $.ajax({
        url: `/api/address/${nodeData.id}/children`,
        type: "get",
        success: (result) => {
          this.$el.append(specialityTemplate({ data: result, parent: nodeData, ids }))
          this.$el.spin(false)
        }
      })
    } else if (nodeData) {
      const ids = this.$index.siblings(`.js-${this.$type}-id`).val()
      this.$el.append(specialityTemplate({ data: nodeData.children, ids }))
    }
  }

  selectCategory(e) {
    e.stopPropagation()
    const $self = $(e.currentTarget)
    const data = $self.data("category")
    const level = data.level

    // 移除下一个等级的选择框,渲染新的下一等级选择框或直接为子节点选中
    $(`.js-category-container[data-level=${level}]`, this.$el).nextAll().remove()
    const hasChildren = this.$type === "speciality" && data.hasChildren && data.children.length !== 0
    if ((this.$type === "city" && level === 1) || hasChildren) {
      this.activeCategory($self, false)     // 增加有子节点选择的效果
      this.renderChildrenData(data)
    } else {
      data.parentId = $self.parent().data("parent-id")
      data.parentName = $self.parent().data("parent-name")
      this.activeCategory($self, true)     // 增加当前节点选择的效果
      this.setValue($self, data)  // 选择的值
    }
  }

  activeCategory($el, noChildren) {
    $el.siblings().removeClass("selected")
    if (noChildren && this.options.selectMore) {
      $el.hasClass("selected") ? $el.removeClass("selected") : $el.addClass("selected")
      $el.toggleClass("checked")
      $el.find(".js-selected-icon").toggleClass("hide")
    } else {
      $el.addClass("selected")
    }
  }

  setValue($self, data) {
    if (this.options.selectMore) {
      this.getModels($self, data)
      this.options.afterSelect && this.options.afterSelect($self, data)
    } else {
      this.$index.val(data.name).data("category", data)
    }
    if (!this.options.selectMore) {
      this.hideSelect()
    }
  }

  getModels($selected, data) {
    const id = data.id
    const selectedIds = $(`.js-${this.$type}-id`).val()
    let ids = selectedIds ? selectedIds.split(",") : []
    if ($selected.hasClass("checked")) {
      // if ids.length is 5  # 限制填入的城市数量
      //   $(".js-select-city").off()
      //   $(".js-city-group").addClass("hide")
      // else
      ids = this.selectOne(id, ids, data)
    } else {
      ids = this.deleteOne(id, ids)
    }
    const $placeholder = $(".js-empty-placeholder", this.$index)
    ids.length === 0 ? $placeholder.removeClass("hide") : $placeholder.addClass("hide")
    $(`.js-${this.$type}-id`).val(_.uniq(ids))
  }

  // 选择其中一个
  selectOne(id, ids, data) {
    ids.push(id.toString())
    const htmlStr = `<span class='each-${this.$type}' data-id='${id}' data-name='${data.name}'
        data-parent-id='${data.parentId}' data-parent-name='${data.parentName}'>
        ${data.name}
         <i class='icon-hsh icon-hsh-cha js-delete-selected'></i>
       </span>`
    $(this.$index).append(htmlStr)
    return ids
  }

  // 删除其中一个
  deleteOne(id, ids) {
    ids = _.without(ids, id.toString())
    const $current = $(this.$index).find(`.each-${this.$type}`)
    _.map($current, (el) => {
      if ($(el).data("id") === id) {
        $(el).remove()
      }
    })
    const $placeholder = $(".js-empty-placeholder", this.$index)
    ids.length === 0 ? $placeholder.removeClass("hide") : $placeholder.addClass("hide")
    return ids
  }

  // 点击叉  去掉选择的
  deleteSelected(e) {
    const $self = $(e.currentTarget)
    const id = $self.parent().data("id")
    let ids = $(`.js-${this.$type}-id`).val().split(",")
    ids = this.deleteOne(id, ids)
    $(`.js-${this.$type}-id`).val(_.uniq(ids))
    this.initRenderData()
  }

  // 显示筛选框
  showSelector() {
    this.$el.parent().toggleClass("hide")
  }

  // 隐藏专业筛选框
  hideSelector(e) {
    if (!$(e.target).closest(`.js-selector-group`).length) {
      this.$el.parent().addClass("hide")
    }
  }

  // api
  show() {
    setTimeout(() => this.showSelect(), 0)
  }

  hide() {
    setTimeout(() => this.hideSelect(), 0)
  }

  destroy() {
    this.$el.remove()
    this.$index.removeData("selectCategory")
  }
}

module.exports = SelectSpeciality
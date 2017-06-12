const treeTemplate = Handlebars.templates["common/select_tree/frontend_templates/tree"]
const treeItemTemplate = Handlebars.partials["common/select_tree/frontend_templates/_tree_item"]
const treeListTemplate = Handlebars.partials["common/select_tree/frontend_templates/_tree_list"]
const newItemTemplate = Handlebars.templates["common/select_tree/frontend_templates/new_item"]

class SelectTree {
  constructor(options) {
    this.options = _.extend({
      container: "body",
      search: true,
      operation: false,
      data: [],
      selectMore: false,

      // 展开
      beforeExpand: null,
      expand: null,
      afterExpand: null,

      // 折叠
      beforePack: null,
      pack: null,
      afterPack: null,

      // 更新节点
      beforeUpdate: null,
      update: null,
      afterUpdate: null,

      // 添加节点
      beforeAdd: null,
      add: null,
      afterAdd: null,

      // 删除节点
      beforeDel: null,
      del: null,
      afterDel: null,

      // 移动节点
      beforeMove: null,
      afterMove: null,

      // 复制节点
      beforeCopy: null,
      afterCopy: null,

      // 选择节点
      beforeSelect: null,
      afterSelect: null,

      initTree: null
    }, options)
    this.data = this.options.data

    this.renderTree()
    this.bindEvent()
  }

  bindEvent() {
    $(this.options.container).on("keydown", ".js-search-tree", (e) => this.searchNode(e))
    $(this.options.container).on("click", ".js-tree-item", (e) => this.selectNode(e))
    $(this.options.container).on("click", ".js-add-child", (e) => this.addChild(e))
    $(this.options.container).on("click", ".js-add-sibling", (e) => this.addSibling(e))
    $(this.options.container).on("click", ".js-update-node", (e) => this.updateNode(e))
    $(this.options.container).on("click", ".js-delete-node", (e) => this.deleteNode(e))
    $(this.options.container).on("click", ".js-move-up", (e) => this.moveUp(e))
    $(this.options.container).on("click", ".js-move-down", (e) => this.moveDown(e))
    $(this.options.container).on("click", ".js-copy-node", (e) => this.copyNode(e))
    this.initTree()
  }

  searchNode(e) {

  }

  togglePack(e) {
    e.stopPropagation()
    $(e.currentTarget).closest(".js-tree-node").toggleClass("expand")
  }

  selectNode(e) {
    this.options.beforeSelect ? this.options.beforeSelect(e) : true
    this.togglePack(e)
    const $self = $(e.currentTarget)
    const id = $self.data('id')
    if (this.options.selectMore) {
      $self.closest(".js-tree-node").toggleClass("selected")
      const $inputCheck = $self.children('.js-checked-item')
      const checked = $self.closest(".js-tree-node").hasClass('selected') ? true : false
      $inputCheck.prop('checked', checked)
      id && this.options.afterSelect ? this.options.afterSelect(e, id, checked) : true
    } else {
      $(".js-tree-node", this.options.container).removeClass("selected")
      $self.closest(".js-tree-node").addClass("selected")
      this.options.afterSelect ? this.options.afterSelect(e, id) : true
    }
  }

  addChild(e) {
    this.options.beforeAdd ? this.options.beforeAdd(e): true

    this.options.afterAdd ? this.options.afterAdd(e): true
  }

  addSibling(e) {

  }

  moveUp(e) {
    this.options.beforeMove ? this.options.beforeMove(e) : true

    const $self = $(e.currentTarget)
    const $node = $self.closest(".js-tree-node")
    const $prev = $node.prev()[0]

    $prev ? $prev.after($node) : true

    this.options.afterMove ? this.options.afterMove(e) : true
  }

  moveDown(e) {
    this.options.beforeMove ? this.options.beforeMove(e) : true

    const $self = $(e.currentTarget)
    const $node = $self.closest(".js-tree-node")
    const $next = $node.next()[0]

    $next ? $next.after($node) : true

    this.options.afterMove ? this.options.afterMove(e) : true
  }

  delNode(e) {
    this.options.beforeDel ? this.options.beforeDel(e) : true
    const $self = $(e.currentTarget)
    $self.closest(".js-tree-node").remove()
    this.options.afterDel ? this.options.afterDel(e) : true
  }

  renderTree() {
    $(this.options.container).append(treeTemplate(this.options))
  }

  initTree() {
    if (this.options.initTree) {
      _.each(this.options.initTree, (i) => {
        $(this.options.container).find(`.js-tree-item[data-id=${i}]`).trigger('click')
      })
    }
  }

  getTree() {

  }

  getTreeHtml() {
    $(this.options.container).html()
  }
}

module.exports = SelectTree


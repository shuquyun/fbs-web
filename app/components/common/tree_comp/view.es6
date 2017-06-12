const treeTemplate = Handlebars.templates["common/tree_comp/frontend_templates/tree"]
const treeItemTemplate = Handlebars.partials["common/tree_comp/frontend_templates/_tree_item"]
const treeListTemplate = Handlebars.partials["common/tree_comp/frontend_templates/_tree_list"]
const newItemTemplate = Handlebars.partials["common/tree_comp/frontend_templates/_new_item"]
const operationMenuTemplate = Handlebars.partials["common/tree_comp/frontend_templates/_operation_menu"]

class SelectTree {
  constructor(options) {
    this.options = _.extend({
      container: "body",
      search: true,
      operation: true,
      data: [],

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
      deleteNode: null,
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

    }, options)
    this.data = this.options.data
    this.$el = $(this.options.container)

    this.$el.data("selectTree", this)
    this.initialData()
    this.renderTree()
    this.bindEvent()
  }

  bindEvent() {
    this.$el.on("keyup", ".js-search-tree", (e) => this.searchNode(e))
    this.$el.on("click", ".js-operation-detail", (e) => this.showDetail(e))
    $(document).on("click", (e) => this.hideDetail(e))
    this.$el.on("click", ".js-tree-item", (e) => this.selectNode(e))
    this.$el.on("click", ".js-pack-node", (e) => this.packNode(e))
    this.$el.on("click", ".js-expand-node", (e) => this.expandNode(e))
    this.$el.on("click", ".js-add-child", (e) => this.addChild(e))
    this.$el.on("click", ".js-add-sibling", (e) => this.addSibling(e))
    this.$el.on("click", ".js-cancel-add", (e) => this.cancelAdd(e))
    this.$el.on("click", ".js-rename-node", (e) => this.renameNode(e))
    this.$el.on("change", ".js-child-select", (e) => this.selectChildValue(e))
    this.$el.on("submit", ".js-add-child-form" , (e) => this.submitChild(e))
    this.$el.on("submit", ".js-rename-child-form" , (e) => this.updateNode(e))
    this.$el.on("click", ".js-move-up", (e) => this.moveUp(e))
    this.$el.on("click", ".js-move-down", (e) => this.moveDown(e))
    this.$el.on("click", ".js-copy-node", (e) => this.copyNode(e))
    this.$el.on("click", ".js-paste-child", (e) => this.pasteChild(e))
    this.$el.on("click", ".js-paste-sibling", (e) => this.pasteSibling(e))
    this.$el.on("click", ".js-del-node", (e) => this.delNode(e))
  }

  setNodeAttr(id, attr, isUnique = false) {
    this.root.walk((node) => {
      if (node.model.id == id) {
        node.model = _.extend(node.model, attr)
      } else {
        if (isUnique) {
          delete node.model[_.keys(attr)[0]]
        }
      }
    })
    return this
  }

  getNodeByAttr(attrKey, attrVal) {
    const nodes = []
    this.root.walk((node) => {
      if (node.model[attrKey] == attrVal) {
        nodes.push(node)
      }
    })
    return nodes
  }

  getNode(id) {
    return this.root.first((node) => node.model.id == id)
  }

  getParent(id) {
    const node = this.getNode(id)
    const paths = node.getPath()
    return paths[paths.length - 2]
  }

  getAncestor(id) {
    const node = this.getNode(id)
    const paths = node.getPath()
    return paths.slice(0, paths.length - 1)
  }

  dropNode(id) {
    const node = this.getNode(id)
    node.drop()
    this.options.deleteNode ? this.options.deleteNode(id) : true
    return this
  }

  addNode(id, childNode) {
    const parentNode = this.getNode(id)
    parentNode.addChild(this.tree.parse(childNode))
    this.root.walk((node) => {
      node.model.level = node.getPath().length - 1
    })
    return this
  }

  moveNode(id, oldIndex, newIndex) {
    const node = this.getNode(id)
    node.model.children.move(oldIndex, newIndex)
    return this
  }

  initialData() {
    this.innerData = {id: 0, name: "这是一个虚拟根节点", children: this.options.data, level: 0}
    this.tree = new TreeModel()
    this.root = this.tree.parse(this.innerData)
    this.root.walk((node) => {
      node.model.level = node.getPath().length - 1
    })
  }

  searchNode(e) {
    const $self = $(e.currentTarget)
    const key = $self.val()
    if (key) {
      this.root.walk((node) => {
        this.setNodeAttr(node.model.id, {expanded: false})
        if (node.model.name.indexOf(key) >= 0) {
          this.setNodeAttr(node.model.id, {searched: true})
          _.each(this.getAncestor(node.model.id), (i) => this.setNodeAttr(i.model.id, {expanded: true}))
        } else {
          this.setNodeAttr(node.model.id, {searched: false})
        }
      })
    } else {
      this.root.walk((node) => {
        this.setNodeAttr(node.model.id, {searched: false})
      })
    }

    this.renderTree({key})
  }

  copyNode(e) {
    e.stopPropagation()
    const $self = $(e.currentTarget)
    const id = $self.data("id")
    const node = this.getNode(id)
    localStorage.setItem("copyNode", JSON.stringify(node.model))
    $(".tip", this.$el).fadeIn(300, () => {
      setTimeout(() => $(".tip", this.$el).fadeOut(300), 600)
    })
    this.setNodeAttr(id, {menu: false}).renderTree()
  }

  pasteSibling(e) {
    e.stopPropagation()
    const id = $(e.currentTarget).data("id")
    const copyNode = JSON.parse(localStorage.getItem("copyNode"));
    const newNode = this.options.pasteSibling ? this.options.pasteSibling(this.getNode(id).model.pid, copyNode) : JSON.parse(localStorage.getItem("copyNode"));
    this.addNode(this.getParent(id).model.id, newNode).renderTree()
  }

  pasteChild(e) {
    e.stopPropagation()
    const id = $(e.currentTarget).data("id")
    const copyNode = JSON.parse(localStorage.getItem("copyNode"));
    const newNode = this.options.pasteChild ? this.options.pasteChild(id, copyNode) : copyNode;
    this.addNode(id, newNode).renderTree()
  }

  showDetail(e) {
    e.stopPropagation()
    const $self = $(e.currentTarget)
    const id = $self.data("id")
    this.setNodeAttr(id, {menu: true}, true).renderTree()
  }

  hideDetail(e) {
    this.root.walk((node) => {
      this.setNodeAttr(node.model.id, {menu: false})
    })

    $(".js-operation-menu", this.$el).remove()
  }

  packNode(e) {
    this.options.beforePack ? this.options.beforePack(e) : true
    const $node = $(e.currentTarget).closest(".js-tree-item")
    this.setNodeAttr($node.data("id"), {expanded: false}).renderTree()
    this.options.afterPack ? this.options.afterPack(e) : true
  }

  expandNode(e) {
    this.options.beforeExpand ? this.options.beforeExpand(e) : true
    const $node = $(e.currentTarget).closest(".js-tree-item")
    this.setNodeAttr($node.data("id"), {expanded: true}).renderTree()
    this.options.afterExpand ? this.options.afterExpand(e) : true
  }

  selectNode(e) {
    e.stopPropagation()
    this.options.beforeSelect ? this.options.beforeSelect(e, id, this.getNode(id).model, this.getTree()): true

    const $self = $(e.currentTarget)
    const id = $self.data("id")
    this.setNodeAttr(id, {selected: true}, true).renderTree()

    this.options.afterSelect ? this.options.afterSelect(e, id, this.getNode(id).model, this.getTree()): true
  }

  addChild(e) {
    e.stopPropagation()
    this.options.beforeAddChild ? this.options.beforeAddChild(e, id, this.getNode(id).model, this.getTree()): true
    const $self = $(e.currentTarget)
    const id = $self.data("id")
    const node = this.getNode(id)
    this.setNodeAttr(id, {expanded: true, menu: false}).renderTree()
    const $children = $(`.js-tree-children[data-id="${id}"]`, this.$el)
    const selectChildren = this.options.dataSource ? this.options.dataSource(node.model) : []
    const $newChild = $(newItemTemplate({selectChildren, pid: id, level: node.model.level + 1}))
    $children.append($newChild)
    selectChildren.length ? $newChild.find("select").selectric() : true
    $newChild.find("form").validator()
    this.options.afterAddChild ? this.options.afterAddChild(e, id, this.getTree()): true
  }

  addSibling(e) {
    e.stopPropagation()
    this.options.beforeAddSibling ? this.options.beforeAddSibling(e): true
    const $self = $(e.currentTarget)
    const id = $self.data("id")
    const parentNode = this.getParent(id)
    this.setNodeAttr(id, {menu: false}).renderTree()
    const $children = $(`.js-tree-children[data-id="${parentNode.model.id}"]`, this.$el)
    const selectChildren = this.options.dataSource ? this.options.dataSource(parentNode.model) : []
    const $newChild = $(newItemTemplate({selectChildren, pid: parentNode.model.id, level: parentNode.model.level + 1}))
    $children.append($newChild)
    $newChild.find("select").selectric()
    $newChild.find("form").validator()
    this.options.afterAddSibling ? this.options.afterAddSibling(e, id) : true
  }

  cancelAdd(e) {
    this.renderTree()
  }

  selectChildValue(e) {
    const $self = $(e.currentTarget)
    const $form = $self.closest("form")
    $form.find("input[name=name]").val($self.find("option:selected").data("name"))
  }

  submitChild(e) {
    e.preventDefault()
    const $self = $(e.currentTarget)
    const data = $self.serializeObject()
    const pid = $self.data("id")
    const node = this.options.createNode ? this.options.createNode(pid, data, this.getTree()) : data
    this.addNode(pid, node).renderTree()
    this.options.afterCreate ? this.options.afterCreate(pid, node, this.getTree()) : true
  }

  renameNode(e) {
    e.stopPropagation()
    const $self = $(e.currentTarget)
    const id = $self.data("id")
    this.setNodeAttr(id, {menu: false}).renderTree()
    const $child = $(newItemTemplate({selectChildren: [], pid: id, name: this.getNode(id).model.name}))
    $(`.js-tree-item[data-id="${id}"]`).replaceWith($child)
    $child.find("form").validator()
  }

  updateNode(e) {
    e.preventDefault()
    const $self = $(e.currentTarget)
    const data = $self.serializeObject()
    const id = $self.data("id")
    const oldNode = this.getNode(id)
    const newNode = this.options.updateNode ? this.options.updateNode(_.extend(data, {id}), oldNode.model, this.getTree()) : _.extend(oldNode.model, data)
    this.setNodeAttr(id, newNode)
    this.renderTree()
    this.options.afterUpdate ? this.options.afterUpdate(id, node, this.getTree()) : true
  }

  moveUp(e) {
    e.stopPropagation()
    this.options.beforeMove ? this.options.beforeMove(e, 'up') : true

    const $self = $(e.currentTarget)
    const $node = $self.closest(".js-tree-node")
    const $parent = $self.closest(".js-tree-children")
    const parentId = $parent.data("id")

    const index = $node.index()
    index !== 0 ? this.moveNode(parentId, index, index -1).renderTree() : true

    this.options.afterMove ? this.options.afterMove(e, 'up') : true
  }

  moveDown(e) {
    e.stopPropagation()
    this.options.beforeMove ? this.options.beforeMove(e, 'down') : true

    const $self = $(e.currentTarget)
    const $node = $self.closest(".js-tree-node")
    const $parent = $self.closest(".js-tree-children")
    const size = $parent.children().length
    const parentId = $parent.data("id")

    const index = $node.index()
    index !== size - 1 ? this.moveNode(parentId, index, index + 1).renderTree() : true

    this.options.afterMove ? this.options.afterMove(e, 'down') : true
  }

  delNode(e) {
    e.stopPropagation()
    this.options.beforeDel ? this.options.beforeDel(e) : true
    const $self = $(e.currentTarget)
    const id = $self.data("id")
    this.dropNode(id)
    this.renderTree()
    this.options.afterDel ? this.options.afterDel(e, id) : true
  }

  renderTree() {
    this.$treeView = this.$el.find(".js-tree-view")
    const { search, operation } = this.options
    if (this.$treeView.length) {
      this.$treeView.empty().append(treeListTemplate(this.root.model))
    } else {
      this.$el.empty().append(treeTemplate(_.defaults(this.root.model, { search, operation})))
    }
  }

  refreshTree(data) {
    this.data = data
    this.options.data = data
    this.initialData()
    this.renderTree()
  }

  getTree() {
    return this.root.model.children
  }

  getTreeHtml() {
    return this.$el.html()
  }

  getSelected() {
    return this.getNodeByAttr("selected", true)
  }
}

module.exports = SelectTree

const TreeComp = require('common/tree_comp/view')
const { Modal } = require('pokeball')

class SelectTree {
  constructor() {
    this.getNav()
  }

  getNav() {
    $.ajax({
      url: `/api/sheet-cates/${$.query.get('tag')}/tree`,
      type: 'GET'
    }).done(result => {
      this.sheetData = result;
      if (this.selectTree) {
        this.selectTree.refreshTree(this.resolveNavData(result))
      } else {
        this.renderNav(this.resolveNavData(result))
      }
    })
  }

  resolveNavData(data) {
    for (let item of data) {
      if (item.children.length > 0) {
        item.expanded = true;
      }
      if (item.id === parseInt(window.location.href.split('#')[1])) {
        item.selected = true;
      } else {
        item.children = this.resolveNavData(item.children)
      }
      item.operation = true;
    }

    return data
  }

  renderNav(data) {
    this.selectTree = new TreeComp({
      container: '.list-tree-nav',
      operation: true,
      data: data,
      dataSource: (model) => this.getSelectSheet(model),
      createNode: (pid, node, tree) => this.createNode(pid, node, tree),
      updateNode: (node, old, tree) => this.updateNode(node, old, tree),
      afterSelect: (e) => this.selectNode(e),
      afterAddChild: (e) => this.beforeCreate(e),
      afterAddSibling: (e) => this.beforeCreate(e),
      afterDel: (e) => this.deleteNode(e),
      pasteSibling: (pid, node) => this.pasteNode(pid, node),
      pasteChild: (pid, node) => this.pasteNode(pid, node),
      beforeMove: (e, type) => this.beforeMove(e, type)
    })
  }

  getSelectSheet(model) {
    this.newSheet = [];

    $.ajax({
      'url': `/api/sheet-cates/${$.query.get('tag')}`,
      data: { pid: model.level === 1 ? model.id : 0, status: "-1"},
      async: false
    }).done(result => {
      this.newSheet = result;
    })

    return this.newSheet
  }

  beforeCreate(id) {
    if (this.newSheet.length === 0) {
      new Modal({
        title: '无可添加分部',
        icon: 'error'
      }).show()
      this.selectTree.cancelAdd()
    }
  }

  createNode(pid, node, tree) {
    node.pid = pid;
    _.extend(node, { status: 1 })
    $.ajax({
      url: `/api/sheet-cates`,
      type: 'PUT',
      data: JSON.stringify(node),
      contentType: 'application/json'
    }).done(result => {

    }).fail(result => {
      this.selectTree.dropNode(node.id).renderTree()
    })

    return node
  }

  updateNode(node, old, tree) {
    const cate = _.extend(old, node)
    $.ajax({
      url: `/api/sheet-cates/${node.id}/rename`,
      type: "PUT",
      async: false,
      data: {name: node.name}
    }).done(result => {
      if (result) {
        this.selectTree.refreshTree(this.resolveNavData(result))
      }
    })

    return cate
  }

  selectNode(e) {
    const node = $(e.currentTarget).data('node');

    if (parseInt(window.location.hash.split('#')[1]) !== node.id && node.id !== 0) {
      window.location.hash = node.id;
      $('.component-division').trigger('renderList', node)
    }
  }

  deleteNode(e) {
    $.ajax({
      url: `/api/sheet-cates/${$(e.currentTarget).data('id')}`,
      type: 'DELETE'
    }).done( result => {
    })
  }

  pasteNode(pid, node) {
    const newNode = {}
    $.ajax({
      url: `/api/sheet-cates/copy/${node.id}/${pid}`,
      type: 'PUT',
      data: { billSheetId: $.query.get('tag')},
      success: (result) => { this.getNav() }
    }).fail(result => {
      this.getNav()
    })
    return node
  }

  beforeMove(e, type) {
    const $el = $(e.currentTarget).closest('.js-tree-item');

    $.ajax({
      url: `/api/sheet-cates/sort/${$el.data('id')}`,
      type: 'PUT',
      data: { move: type }
    }).done(result => {
      // console.log('move: ', result)
    })
  }
}

module.exports = SelectTree

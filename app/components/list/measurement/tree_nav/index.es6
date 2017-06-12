const TreeComp = require('common/tree_comp/view')
const FeeTree = require('list/fee_sum/view')
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
      this.renderNav(this.resolveNavData(result))
      this.selectFirst()
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
      if (item.name === '安全文明施工费' || item.name === '按费率计取') {
        item.operation = false;
      }
    }

    return data
  }

  renderNav(data) {
    this.selectTree = new TreeComp({
      container: '.list-tree-nav',
      data: data,
      createNode: (pid, node, tree) => this.createNode(pid, node, tree),
      updateNode: (node, old, tree) => this.updateNode(node, old, tree),
      afterSelect: (e) => this.selectNode(e),
      afterDel: (e) => this.deleteNode(e),
      beforeAddSibling: (e) => this.beforeAddSibling(e),
      pasteSibling: (pid, node) => this.pasteNode(pid, node),
      pasteChild: (pid, node) => this.pasteNode(pid, node),
      beforeMove: (e, type) => this.beforeMove(e, type)
    })
  }

  selectFirst() {
    const type = window.location.pathname.split('/')[4]

    if (type === 'safe') {
      $('.component-tree-container .js-tree-item').eq(0).trigger('click');
      new FeeTree({
        cateId: window.location.hash.split('#')[1]
      })
    }
  }

  createNode(pid, node, tree) {
    node.pid = pid
    node.billSheetId = $.query.get('tag')
    const parentNode = this.selectTree.getNode(pid);
    _.extend(node, {status: 1, operation: true, type: 2, level: parentNode.model.level + 1})
    $.ajax({
      url: `/api/sheet-cates`,
      type: 'POST',
      data: JSON.stringify(node),
      contentType: 'application/json',
      async: false
    }).done(result => {
      node.id = result
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

  beforeAddSibling(e) {
    const node = $(e.currentTarget).closest('.js-tree-item').data('node');
    if (node.level === 1) {
      new Modal({
        title: '不能添加分类',
        icon: 'error'
      }).show()
      throw new Error('不能添加分类')
    }
  }

  selectNode(e) {
    const node = $(e.currentTarget).data('node');
    const type = window.location.pathname.split('/')[4]

    if (type === node.name) return

    if (parseInt(window.location.hash.split('#')[1]) !== node.id && node.id !== 0) {
      this.switchNodeType(node)
      window.location.hash = node.id;
      $('.component-measurement-complex').trigger('renderList', node)
    }
  }

  switchNodeType(node) {
    switch (node.name) {
      case '安全文明施工费':
        window.location.href = `/list/edit/measurement/safe${window.location.search}#${node.id}`;
        break;
      case '按费率计取':
        window.location.href = `/list/edit/measurement/taxes${window.location.search}#${node.id}`;
        break;
      default:
        window.location.href = `/list/edit/measurement/complex${window.location.search}#${node.id}`;
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

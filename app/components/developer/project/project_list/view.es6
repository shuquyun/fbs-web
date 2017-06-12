const Modal = require('pokeball').Modal
const addressSelect = require('common/address_select/view')
class ProjectList extends addressSelect {
  constructor($) {
    super($)
    this.$jsProjectOpen = $('.js-project-open')
    this.bindEvents()
  }

  bindEvents() {
    $(document).on('confirm:deleteProject', (evt, id) => this.deleteProject(evt, id))
    $(document).on('confirm:closeProject', (evt, id) => this.toggleProject(evt, id))
    this.$jsProjectOpen.on('click', (evt) => this.openProject(evt))
  }

  openProject(evt) {
    const id = $(evt.currentTarget).data('id')
    this.toggleProject(evt, id, 'open')
  }

  //open close project
  toggleProject(evt, id, type) {
    $.ajax({
      url: `/api/projects/${id}`,
      method: 'PUT',
      success: () => {
        if (type) {
          new Modal({ icon: 'success', content: '该项目已被重新打开，该项目下的所有招标都已恢复为正常状态！' }).show(() => {
            window.location.reload()
          })
        } else {
          window.location.reload()
        }
      }
    })
  }

  //delete project
  deleteProject(evt, id) {
    $.ajax({
      url: `/api/projects/${id}`,
      method: 'DELETE',
      success: () => {
        new Modal({ icon: 'success', content: '删除成功' }).show(() => {
          window.location.reload()
        })
      }
    })
  }
}

module.exports = ProjectList

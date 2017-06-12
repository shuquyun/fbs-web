const addressSelect = require('common/address_select/view')
const Modal = require('pokeball').Modal
const imageTemplates = Handlebars.templates['developer/project/common/frontend_templates/image']
const FileUpload = require('utils/module').plugins.upload
class ProjectManage extends addressSelect {
  constructor($) {
    super($)
    this.levels = 2
    this.$projectForm = $('.js-form-project')
    this.jsImageDelete = '.js-image-delete'
    this.$jsInputNumber = $('.js-input-number')
    this.bindEvents()
  }

  bindEvents() {
    this.initForm()
    this.fileUpload()
    $(document).on('click', this.jsImageDelete, (evt) => this.deleteImage(evt))
    this.$jsInputNumber.on('input propertychange', (evt) => this.serializeInput(evt))
  }

  //千分位
  serializeInput(evt) {
    const $self = $(evt.currentTarget)
    const val = $self.val().replace(/,/g, '')
    $self.val(val.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'))
  }

  fileUpload() {
    new FileUpload($('input[type=file]'), (data) => {
      $('input[type=file]').closest('.btn-upload').before(imageTemplates({ image: data.path }))
    }, '', ['image/jpg', 'image/png', 'image/gif', 'image/jpeg', 'image/bmp'])
  }

  initForm() {
    $('.form-project').validator({
      identifier: 'input[type=text],textarea,[required]',
      isErrorOnParent: true
    })
    this.$projectForm.on("submit", evt => this.submitProject(evt))
  }

  //删除项目图片
  deleteImage(evt) {
    $(evt.currentTarget).closest('li').remove()
  }

  submitProject(evt) {
    evt.preventDefault()
    const $self = $(evt.currentTarget)
    const projectData = $self.serializeObject()
    projectData.province = $self.find(`.address-select[data-level=1] option[value=${projectData.provinceId}]:selected`).text()
    projectData.city = $self.find(`.address-select[data-level=2] option[value=${projectData.cityId}]:selected`).text()
    projectData.pics = typeof(projectData.pics) === 'string' ? [projectData.pics] : projectData.pics
    projectData.floorArea = projectData.floorArea.replace(/,/g, '')
    projectData.buildingArea = projectData.buildingArea.replace(/,/g, '')
    const method = projectData.id ? 'PUT' : 'POST'
    $.ajax({
      url: '/api/projects',
      method: method,
      data:  JSON.stringify(projectData),
      contentType: 'application/json',
      success: () => {
        new Modal({ icon: 'success', content: '保存成功' }).show(() => {
          window.location.href = '/developer/project'
        })
      }
    })
  }
}

module.exports = ProjectManage

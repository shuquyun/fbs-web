const Modal = require('pokeball').Modal
export default class FileUpload {
  constructor(_input, callback, spin, type) {
    const $spin = spin ? $(spin) : $('body')
    this.size = ''
    $(_input).fileupload({
      change: (e, data) => {
        $spin.spin('medium')
      },
      url: '/api/user/files/upload',
      dataType: "html",
      add: (e, data) => {
        const loadType = data.originalFiles[0]['type']
        const s = data.originalFiles[0]['size']
        const sizes = ['B','KB', 'MB', 'GB', 'TB']
        let i = Math.floor(Math.log(s)/Math.log(1024))
        this.size = (s/Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i]
        if (type && type.indexOf(loadType) === -1) {
          $spin.spin(false)
          this.showModal("error", "上传失败！", "上传图片格式不正确")
        } else {
          data.submit()
        }
      },
      success: (data) => {
        const result = { name: _.keys(JSON.parse(data))[0], path: _.values(JSON.parse(data))[0], size: this.size }
        _.isFunction(callback) && callback(result)
      },
      fail: () => {
        this.showModal("error", "上传失败！")
      },
      complete: () => {
        $spin.spin(false)
      },
    })
  }

  showModal(icon, title, content) {
    new Modal({
      icon,
      title,
      content,
    }).show()
  }
}

module.exports = FileUpload

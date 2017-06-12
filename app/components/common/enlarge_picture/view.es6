const pictureItemTemplates  = Handlebars.templates['common/enlarge_picture/frontend_templates/picture']
const Modal = require('pokeball').Modal
class EnlargePicture {
  constructor(el) {
    this.$el = $(el)
    this.bindEvent()
  }

  bindEvent() {
    $(document).on('click', '.js-enlarge-picture', () => this.closePictureModal())
    this.$el.on('click', (evt) => this.initPicture(evt))
  }

  closePictureModal() {
    this.pictureModal.close()
  }

  initPicture(evt) {
    const picture = $(evt.currentTarget).attr("src")
    if (picture) {
      this.pictureModal = new Modal(pictureItemTemplates({ picture }))
      this.pictureModal.show()
    }
  }
}

module.exports = EnlargePicture

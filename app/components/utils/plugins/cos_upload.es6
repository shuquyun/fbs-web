export default class CosUpload {
  constructor(option) {
    this.option = option
    const cos = new CosCloud({
      appid: 1253455349,
      bucket: 'hshbucket',
      region: 'gz',
      getAppSign: function(callback) {
        this.getAppSign(callback)},
      getAppSignOnce: function (callback) {this.getAppSign(callback)}
    })
  }

  getAppSign(callback) {
    console.log(888)
    $.ajax({
      url: `/api/get-app-sign?path=${this.option.path}&bucket=${this.option.bucket}`,
      method: 'GET',
      success: (data) => {
        callback(data)
      }
    })
  }
}

const CommonDatepicker = require("utils/module").plugins.commonDatepicker;

export default class {
  constructor() {
    this.importForm = $(".supplier-import-form");
    this.deleteFile = ".delete-file";
    this.bindEvent();
  }

  bindEvent() {
    const year = (new Date()).getFullYear()
    $(".datepicker").datepicker({ maxDate: new Date(), yearRange: [year - 120, year] })
    this.importForm.validator({ isErrorOnParent: true })
    this.importForm.on("submit", (event) => this.importSubmit(event))
    $(".btn-upload").on("click", (event) => this.fileUpload(event))
  }

  // 上传文件
  fileUpload (event) {
    let $self = $(".supplier-import-form input[name=report]"),
        target = $($self).parents(".control-group");
    $self.fileupload({
      url: "/api/user/files/upload",
      type: "POST",
      dataType: "html",
      start: () => {
        target.spin("medium")
      },
      done: (evt, data) => {
        let file = JSON.parse(data.result);
        let path = _.values(file)[0];
        let name = _.keys(file)[0];
        $(".list-file").append(`<li><span>${name}</span><a class="file-operate delete-file">删除</a><a href="${path}" class="file-operate file-download">下载</a></li>`);
        $("a.delete-file").on("click",(event) => this.fileDelete(event));
      },
      always: () => {
        target.spin(false);
      },
      error: () => {
        target.spin(false);
      }
    })
  }

  // 删除上传的文件
  fileDelete(event) {
    $(event.currentTarget).parent().remove();
  }

  // 提交供应商入库
  importSubmit(event) {
    $("body").spin("medium")
    event.preventDefault();
    let data = this.importForm.serializeObject(),
        supplierId = $.query.get("supplierId");
    let report = [];
    const fileLength = $(".list-file li");
    _.map (fileLength, (file,i) =>{
      let fileName = $(file).find("span").text(),
          filePath = $(file).find(".file-download").attr("href"),
          fileDetail = { name : fileName, path: filePath };
      report.push(fileDetail);
    })
    data.supplierId = parseInt(supplierId);
    data.report = JSON.stringify(report);
    $.ajax({
      url: "/api/supplier/put",
      type: "POST",
      data: data,
      success: () => {
        setTimeout(() => {
          $("body").spin(false)
          window.location.href = "/developer/supplier-library"
        }, 500)
      }
    })
  }
}
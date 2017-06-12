fileSystemTemplate = Handlebars.templates["extra/pictures/frontend_templates/file-system"]
newFolderTemplate = Handlebars.templates["extra/pictures/frontend_templates/new-folder"]
Pagination = require "pokeball/components/pagination"
Modal = require "pokeball/components/modal"
class Files
  constructor: ()->
    @$jsAddFolder = $(".js-add-folder")
    @bindEvents()

  bindEvents: ()->
    @getFiles(1)
    $(document).on "confirm:deleteFile", @deleteFile
    $(document).on "click", ".js-copy-file", @copyFilePath
    @$jsAddFolder.on "click", @addFolder
    $(document).on "click", ".change-folder", @changeFolder
    @bindFileUpload()


  # 获取文件系统, 若传了folderId则拿该文件夹下文件
  getFiles: (pageNo)=>
    pageNo = pageNo || 1
    folderId = $(".now-path").data("folderId")
    $("body").spin("medium")
    $.ajax
      url: "/api/user/folder?folderId=" + folderId + "&p=" + pageNo
      type: "GET"
      complete: =>
        $("body").spin(false)
      success: (data)=>
        @renderNowPath(data.realPath)
        @renderFiles(data.data)

        new Pagination($(".pagination")).total(data.data.total).show 15,
          current_page: pageNo - 1
          callback: (pageNo) =>
            @getFiles(pageNo+1)

  #渲染当前文件路径
  renderNowPath: (realPath)=>
    $(".now-path").empty().append("""<a href="javascript:void(0)" class="change-folder" data-folder-id="0">/根目录</a>""")
    _.each realPath.pathList, (path)=>
      $(".now-path").append("""<a href="javascript:void(0)" class="change-folder" data-folder-id="#{path.id}">/#{path.folder}</a>""")

  #渲染文件夹和文件列表
  renderFiles: (files)=>
    $(".file-table tbody").empty().append(fileSystemTemplate({data: files}))
    # @copyFilePath()

  # 删除文件或文件夹
  deleteFile: (evt, data)=>
    type = parseInt(data.split(":")[0])
    id = data.split(":")[1]
    url = "/api/user/files/#{id}/delete"
    if type is 1
      url = "/api/user/folder/#{id}/delete"
    $.ajax
      url: url
      method: "DELETE"
      success: (data)=>
        $(".file-tr[data-id=#{id}]").remove()


  # 新增文件夹
  addFolder: (evt) =>
    newFolderModal = new Modal(newFolderTemplate())
    newFolderModal.show()
    $(".folder-form").on "submit", (evt)=>
      evt.preventDefault()
      data = $(evt.currentTarget).serializeObject()
      data.pid = $(".now-path").data("folderId")
      $.ajax
        url: "/api/user/folder/create"
        type: "POST"
        contentType: "application/json"
        data: JSON.stringify(data)
        success: (data)=>
          @getFiles(1)
          newFolderModal.close()


  # 添加图片, 读取当前所在的文件夹Id
  bindFileUpload: (evt)=>
    $("input[name=file]").fileupload
      url: "/api/user/files/upload?folderId=" + $(".now-path").data("folderId")
      dataType: "html"
      done: (evt, data) =>
        @getFiles(1)

  #切换文件夹路径
  changeFolder: (evt)=>
    folderId = $(evt.currentTarget).data("folderId")
    $(".now-path").data("folderId", folderId)
    @getFiles(1)
    $("input[name=file]").fileupload
      url: "/api/user/files/upload?folderId=" + $(".now-path").data("folderId")

  #复制图片路径
  copyFilePath: (evt) =>
    copyToClipboard($(evt.currentTarget).data("url"));
    new Modal
      icon: "success"
      title: "成功啦"
      content: "粘贴链接成功,您可去别的地方粘贴此链接"
    .show()

module.exports = Files

FileUpload = require('utils/module').plugins.upload
class TextTool
  constructor: ($)->
    @$fileInput = $("input.js-rich-text-file")
    @$imageInput = $(".js-image-input")
    @bindEvent()

  bindEvent:->
    @textTool()

  textTool: ->
    editor = new wysihtml5.Editor("wysihtml5-editor", {
        toolbar:     "wysihtml5-editor-toolbar",
        parserRules: wysihtml5ParserRules
      })

    editor.on "load", ->
      composer = editor.composer

    $(".wysihtml5-sandbox").addClass("text-tool-iframe").attr("id", "iframe-whsihtml5")
    # $("#iframe-whsihtml5").contents().find("body").html() 这是获取detail的方法
    @fileUpload()

  fileUpload: () =>
    new FileUpload @$fileInput, (data) =>
      @$imageInput.val( 'http:' + data.path)

module.exports = TextTool

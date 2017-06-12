###
  商品详情页 详情TAB
  author by terminus.io (zl)
###
commentListTemplate = Handlebars.templates["shop_design/spu_tab/frontend_templates/comment_list"]
commentReplyTemplate = Handlebars.templates["shop_design/spu_tab/frontend_templates/comment_reply"]

Pagination = require("pokeball").Pagination
class Tab
  constructor: ($) ->
    @$tab = @$el
    @$commentList = $(".comments-ul")
    @$shareList = $(".share-list")
    @itemId = $(".tab-navs").data("item")
    @imageLabel = ".image-label"
    @bindEvent()

  bindEvent: ->
    $(document).on "click", @imageLabel, @showLargeImage
    @$tab.tab()
    @renderComment()
    #@renderPackage()

  #渲染评论
  renderComment: (pageNo, pageSize)=>
    pageNo = pageNo || 1
    pageSize = pageSize || 20
    itemId = @itemId
    @$tab.find(".comment-total")
    $.ajax
      url: "/api/comment/item-detail/paging?pageNo=#{pageNo}&pageSize=#{pageSize}"
      type: "GET"
      data: {"itemId": itemId}
      success: (data)=>
        @$commentList.html(commentListTemplate({data: data.data}))
        $(".comment-total").text(data.total)
        @renderReplies()
        @$tab.find(".comment-total").text("（#{data.total}）")
        new Pagination(".comments-pagination").total(data.total).show pageSize || 20,
          "current_page": pageNo - 1
          callback: (pageNo, pageSize) =>
            @renderComment pageNo + 1, pageSize
        @$tab.find(".comment-total").parents("a").css("border-left", "0")    
      error: (data) =>
        @$tab.find(".comment-total").parents("a").css("border-left", "0")


  renderReplies: =>
    _.each $(".comments-li"), (i)=>
      commentId = $(i).data("id")
      $.ajax
        url: "/api/comment/item-detail/replies"
        type: "GET"
        data: {commentId}
        success: (data)=>
          $(i).find(".comment-content").append(commentReplyTemplate({data}))

  #渲染包装信息
  renderPackage: ->
    itemId = @itemId
    $.ajax
      url: "/api/item/#{itemId}/detail"
      type: "GET"
      success: (data)=>
        @$tab.find(".package-name").html(data.packing)
      error: (data) ->

  #展示大图
  showLargeImage: ->
    area = $(@).parents(".share-content").find(".show-image-area")
    if !$(@).hasClass("active")
      $(@).addClass("active").siblings().removeClass("active")
      if !area.find("img").length
        area.html("<img src='#{$(@).find("img").attr("src")}'>")
      else
        area.find("img").attr("src", $(@).find("img").attr("src"))
    else
      $(@).removeClass("active")
      area.find("img").remove()

module.exports = Tab

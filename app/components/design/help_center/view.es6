class HelpCenter {
  constructor($) {
    this.typeName = $(".type-name");
    this.documentTitle = $(".title");
    this.bindEvents();
  }

  bindEvents() {
    this.documentHeight();
    // this.typeName.on("click", this.toggleMenu);
    this.documentTitle.on("click", this.switchDocument.bind(this));
    this.defaultToShowFirstDoc();
  }

  documentHeight() {
    var sidebarHeight = this.$el.find(".help-types").height();
    if (sidebarHeight > 500) {
      this.$el.find(".document-content").css("height", sidebarHeight); // 62为padding加border-width
    }
  }

  // 重置高度
  resetHeight() {
    let siblingsDocument = $(".title.active").parent().next();
    siblingsDocument.css("height", siblingsDocument[0].scrollHeight + 60)
    this.$el.css("height", siblingsDocument[0].scrollHeight + 60)
  }

  //默认显示第一个文档
  defaultToShowFirstDoc() {
    let artId = _.isNumber($.query.get("artId")) ? $.query.get("artId") : this.$el.find(".title:eq(0)").data("id")
    this.$el.find(".title[data-id="+ artId+"]").trigger("click");
  }

  //展开闭合，目前不需此功能
  toggleMenu() {
    if ($(this).hasClass("active")) {
      $(this).removeClass("active");
    } else {
      $(this).addClass("active");
    }
    $(this).siblings(".document-titles").slideToggle(300);

  }

  switchDocument(evt) {
    $(evt.currentTarget).addClass("active");
    var siblingsDocument = $(evt.currentTarget).parent().next().siblings(".document-content");
    var siblingsTitles = $(evt.currentTarget).parent().siblings(".document-titles")
    var siblingsType = $(evt.currentTarget).closest(".each-type").siblings();

    siblingsTitles.find(".title").removeClass("active");
    siblingsDocument.hide(200);

    siblingsType.find(".title").removeClass("active");
    siblingsType.find(".document-content").removeClass("active").hide(200);
    let _this = this;
    $(evt.currentTarget).parent().next().delay(100).show(300, function(){
      _this.resetHeight()
    });
  }
}

module.exports = HelpCenter

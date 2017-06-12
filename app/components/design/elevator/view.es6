const carTemplate = Handlebars.templates["design/elevator/frontend_templates/car"]

class Elevator {
  constructor() {
    this.bindEvent()
  }

  bindEvent() {
    this.renderElevator()
    $(window).on("scroll", (evt) => this.bodyScroll(evt))
    this.$el.on("click", ".js-elevator-li", (evt) => this.jumpToFloor(evt))
    this.$el.find('.elevator-li').hover(function(){
      $(this).addClass('hover');
    }, function(){
      $(this).removeClass('hover');
    });
  }

  renderElevator() {
    let floors = $(".design-tab-floor"),
      floorData = _.map(floors, (i, index) => {
        return {
          id: index,
          name: $(i).find('div.tab-title span.font-16').text()
        }
      });
    this.$el.append(carTemplate({ data: floorData }))
  }

  // 滚动条滚动
  bodyScroll(evt) {
    // 判断是否为装修模型
    let flag = $("body").data('design')
    if (!flag) {
      let windowTop = $(window).scrollTop()
      this.checkElevatorActive(windowTop)
      this.changeElevatorActive(windowTop)
    }
  }

  checkElevatorActive(windowTop) {
    let target = this.$el.find(".js-elevator-li:first").data("target"),
      top = $(`.design-tab-floor:eq(${target})`).offset().top
    if (windowTop >= top) {
      this.$el.addClass("active")
    } else {
      this.$el.removeClass("active")
    }
  }

  // 滚动式电梯组件改变选中项
  changeElevatorActive(windowTop) {
    windowTop = windowTop + $(window).height() / 2 + 40
    $.each(this.$el.find(".js-elevator-li"), (i, li) => {
      let target = $(li).data("target"),
        top = $(`.design-tab-floor:eq(${target})`).offset().top,
        height = $(`.design-tab-floor:eq(${target})`).height()
      if (top <= windowTop && windowTop <= (top + height)) {
        $(li).addClass("active").siblings("li").removeClass("active")
      }
    })
  }

  // 点击电梯跳转至相应DIV
  jumpToFloor(evt) {
    let target = $(evt.currentTarget).data("target"),
      jumpTop = $(`.design-tab-floor:eq(${target})`).offset().top - $(window).height() / 2 + 40
    $('html, body').animate({ scrollTop: jumpTop })
  }
}

module.exports = Elevator

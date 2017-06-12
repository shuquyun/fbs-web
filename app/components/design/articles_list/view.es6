import Pagination from "pokeball/components/pagination"

export default class {

  constructor($) {
    this.bindEvents();
  }

  bindEvents() {
    new Pagination(".users-pagination").total($(".users-pagination").data("total")).show(20);
  }

}

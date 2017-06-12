class Accordion
  constructor: ($) ->
    @$accordion = $(".accordion")
    @bindEvent()

  bindEvent: ->
    $(".accordion-heading").on "click", @expandTag

  #扩展子类目
  expandTag: ->
    if $(@).data("hasChildren")
      parentId = $(@).data("id")
      $(".accordion-content[data-parent-id=#{parentId}]").slideDown()

module.exports = Accordion

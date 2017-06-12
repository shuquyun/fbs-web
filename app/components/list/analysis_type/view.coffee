class AnalysisType

  constructor: ->
    @bindEvent()

  bindEvent:()=>
    console.log("bindEvt")
    path = window.location.pathname
    console.log(path)
    className = path.substring(path.lastIndexOf("/") + 1,path.length)
    console.log($("##{className}"))
    $("##{className}").addClass("active")




module.exports = AnalysisType
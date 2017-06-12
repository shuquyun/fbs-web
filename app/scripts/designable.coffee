designMode = $("body").data("designMode")

return if designMode

$designable = $("#eve-designable")
userType = $("body").data("userType")

# admin or site owner
isSuperUser = userType isnt undefined and (userType == 0 or userType == 3)

if $designable.length > 0 and isSuperUser
  $("body").append(Handlebars.templates["templates/designable_bar"]({url: encodeURIComponent(window.location.href), path: encodeURIComponent($designable.data("path"))}))

module.exports =
  set: (objName, objValue, objDays, objDomain)->
    str = objName + "=" + escape(objValue)
    str += ";path=/;domain=" + objDomain
    if(objDays > 0)
      date = new Date()
      ms = objDays * 3600 * 1000 * 24
      date.setTime(date.getTime() + ms)
      str += ";expires=" + date.toGMTString()
    document.cookie = str

  get: (objName)->
    arrStr = document.cookie.split("; ")
    objValue = ""
    $.each arrStr, (i, d)->
      temp = arrStr[i].split("=")
      if temp[0] is objName
        objValue = unescape(temp[1])
    objValue

  delete: (objName, objDomain)->
    document.cookie = objName + "=;path=/;domain=" + objDomain + ";expires=" + (new Date(0)).toGMTString()


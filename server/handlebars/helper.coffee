module.exports = ({ router, invokers, handlebars }) =>
  _ = require("lodash")
  moment = require("moment")

  Handlebars = handlebars

  Handlebars.registerHelper 'parse', (json, options) ->
    JSON.parse(json)

  Handlebars.registerHelper 'pp', (json, options) ->
    JSON.stringify(json)

  Handlebars.registerHelper 'add', (a,b, options) ->
    a + b

  Handlebars.registerHelper 'subtract', (a, b, options) ->
    a - b

  Handlebars.registerHelper 'formatNumber', (a, options) ->
    return (a || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')

  Handlebars.registerHelper "formatPrice", (price, type, options) ->
    return if not price?
    if type is 1
      formatedPrice = (price / 100)
      roundedPrice = parseInt(price / 100)
    else
      formatedPrice = (price / 100).toFixed(2)
      roundedPrice = parseInt(price / 100).toFixed(2)
    if formatedPrice == roundedPrice then roundedPrice else formatedPrice

  Handlebars.registerHelper 'formatDateLast', (date, options) ->
    return 0 unless date
    moment(parseInt date).diff(moment(), 'days') + '天' + moment(parseInt date).diff(moment(), 'hours') % 24 + '小时'

  Handlebars.registerHelper "formatDate", (date, type, options) ->
    return unless date
    switch type
      when "gmt" then moment(parseInt date).format("EEE MMM dd HH:mm:ss Z yyyy")
      when "day" then moment(parseInt date).format("YYYY-MM-DD")
      when "minute" then moment(parseInt date).format("YYYY-MM-DD HH:mm")
      when "withT" then moment(date).format("YYYY-MM-DD HH:mm:ss")
      else
        if typeof(type) is "string"
          moment(parseInt date).format(type)
        else
          moment(parseInt date).format("YYYY-MM-DD HH:mm:ss")

  Handlebars.registerHelper "lt", (a, b, options) ->
    if a < b
      options.fn(this)
    else
      options.inverse(this)

  Handlebars.registerHelper "gt", (a, b, options) ->
    if a > b
      options.fn(this)
    else
      options.inverse(this)

  Handlebars.registerHelper "last", (a, options) ->
    len = a.length
    options.fn(a[len - 1])

  Handlebars.registerHelper 'ofAll', (q, a, b, c, d, e, f, options) ->
    if a || b || c || d || e || f
      a = if a then a.toString() + ',' else ''
      b = if b then b.toString() + ',' else ''
      c = if c then c.toString() + ',' else ''
      d = if d then d.toString() + ',' else ''
      e = if e then e.toString() + ',' else ''
      f = if f then f.toString() + ',' else ''
      val = a + b + c + d + e + f
      if _.includes val, q.toString()
        options.fn(this)
      else
        options.inverse(this)
    else
      options.inverse(this)

  Handlebars.registerHelper 'of', (a, b, options) ->
    if a.toString() and b
      values = if b then b.split(",") else []
      if _.includes values, a.toString()
        options.fn(this)
      else
        options.inverse(this)
    else
      options.inverse(this)

  Handlebars.registerHelper 'length', (a, options) ->
    length = a.length

  Handlebars.registerHelper 'gtTime', (a, b, options) ->
    nowTime = moment()
    switch b
      when "dayStart" then benchmarkTime = new Date(nowTime.format("YYYY-MM-DD")).valueOf()
      when "now" then benchmarkTime = nowTime.valueOf()
      when "dayEnd" then benchmarkTime = new Date(moment().date(nowTime.date()+1).format("YYYY-MM-DD")).valueOf()
      else benchmarkTime = moment(b).valueOf()
    if moment(a).valueOf() > benchmarkTime
      options.fn(this)
    else
      options.inverse(this)

  Handlebars.registerHelper "isArray", (a, options) ->
    if _.isArray a
      options.fn(this)
    else
      options.inverse(this)

  Handlebars.registerHelper "size", (a, options) ->
    try
      a.length
    catch
      console.log "#{a} is not a array"

  Handlebars.registerHelper "between", (a, b, c, options) ->
    if  a >= b and a <= c
      options.fn(this)
    else
      options.inverse(this)

  Handlebars.registerHelper "addStar", (userName) ->
    if userName.length >= 2
      userName.charAt(0) + "***" + userName.charAt(userName.length - 1)

  Handlebars.registerHelper 'cdnPath', (a, b, c, options) ->
    canWebp = _.defaults(options, c, b).data.root._CAN_WEBP_

    unless a
      a = "http://parana.oss-cn-hangzhou.aliyuncs.com/item_not_found.png"
      a += "?x-oss-process=image/format,webp" if canWebp
      return a

    if a.indexOf("aliyuncs.com") is -1
      return a
    else
      a += "?x-oss-process=image/resize,m_mfit,"

      cType = typeof c
      if cType is "object"
        a += "h_" + b + ",w_" + b
      else if b is "0"
        a += "w_" + c
      else if c is "0"
        a += "h_" + b
      else
        a += "h_" + b + ",w_" + c

      if canWebp then a + "/format,webp" else a

  Handlebars.registerHelper "divide", (a, b, options) ->
    a / (if options then b else 100)

  Handlebars.registerHelper "urlEncode", (a, options) ->
    encodeURIComponent a

  Handlebars.registerHelper 'isEmpty', (a, options) ->
    if _.isArray(a) and a.length isnt 0
      options.inverse(this)
    else
      options.fn(this)

  # only in frontend
  Handlebars.registerHelper "equalsRemainder", (a, b, c, options) ->
    if (a + 1) % b is c
      options.fn(this)
    else
      options.inverse(this)

  Handlebars.registerHelper 'splitter', (a, b, c, options) ->
    if typeof(a) is "string"
      if c.toString() == "-1"
        a.split(b)
      else
        a.split(b)[c]

  Handlebars.registerHelper "formatPriceExt", (price, type, options) ->
    return if not price?
    price = parseInt price
    if type is 1
      formatedPrice = (price / 100)
      roundedPrice = parseInt(price / 100)
    else
      formatedPrice = (price / 100).toFixed(2)
      roundedPrice = parseInt(price / 100).toFixed(2)
    if `formatedPrice == roundedPrice` then roundedPrice else formatedPrice

  Handlebars.registerHelper "indexOf", (a, b, options) ->
    if (a.toString() && b)
      if(b.indexOf(a) > -1)
        return options.fn(this)
      else
        return options.inverse(this)
    else
      return options.inverse(this)

  Handlebars.registerHelper 'i18n', (key, options) =>
    i18n = if (typeof window == 'undefined') then options.data.root['__I18N__'] else window.i18n
    if (i18n == null)
      return key

    context = Object.assign({keySeparator: ':/:'}, options.hash)
    bundlePrefix = "all_mix"

    if (arguments.length > 2)
      for i in [1...arguments.length - 1]
        context['' + (i - 1)] = arguments[i]

    if (options.hash.bundle)
      return i18n.t(bundlePrefix + ':@:' + options.hash.bundle + ":/:" + key, context)

    return i18n.t(key, context)

  Handlebars.registerHelper 'default', (options...) ->
    value = ''
    for i in [options...]
      if i?
        value = i
        break
    value

  Handlebars.registerHelper "hasNodeSelection", (a, b, options) ->
    if (a.toString() && b)
      values = []
      _.map b.dynamicRoles, (dr) ->
        if(dr.treeNodeSelection)
          values = values.concat(dr.treeNodeSelection)
      if(_.intersection(a.split(","), _.uniq(values)).length)
        return options.fn(this)
      else
        return options.inverse(this)
    else
      return options.inverse(this)

  Handlebars.registerHelper 'mapping', (key, options) ->
    return JSON.parse(options.fn())[key]

  Handlebars.registerHelper 'withList', (list, options) ->
    if typeof(list) is 'string'
      list = list.split(',')
    data = {}
    _.each list, (i) ->
      data[i] = true
    return options.fn(data)

  Handlebars.registerHelper 'compare', (a, b, options) ->
    if (a || '').toString() isnt (b || '').toString()
      return options.fn(this)
    else
      return options.inverse(this)


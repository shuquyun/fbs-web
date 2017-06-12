cookie = require("utils/plugins/cookie")

Handlebars.registerHelper 'pp', (json, options) ->
  JSON.stringify(json)

Handlebars.registerHelper 'add', (a,b, options) ->
  a + b

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
  if `formatedPrice == roundedPrice` then roundedPrice else formatedPrice

Handlebars.registerHelper "formatDate", (date, type, options) ->
  return unless date
  switch type
    when "gmt" then moment(parseInt date).format("EEE MMM dd HH:mm:ss Z yyyy")
    when "day" then moment(parseInt date).format("YYYY-MM-DD")
    when "minute" then moment(parseInt date).format("YYYY-MM-DD HH:mm")
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

Handlebars.registerHelper 'of', (a, b, options) ->
  if a and b
    values = if b instanceof Array
      b
    else if /\[.*\]/.test(b.toString())
      JSON.parse(b)
    else
      b.toString().split(",")
    if (_.contains values, a.toString()) or (_.contains values, a) or (_.contains values, Number(a))
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

Handlebars.registerHelper "withPerm", (resource, options) ->
  authResources = window.resource
  if authResources.length is 1 and authResources[0] is ""
    options.fn(this)
  else if _.contains authResources, resource
    options.fn(this)
  else
    options.inverse(this)

Handlebars.registerHelper 'cdnPath', (a, b, c, options) ->
  canWebp = cookie.get("cwebp")

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

Handlebars.registerHelper 'default', (a, options) ->
  if a?
    a
  else
    for i in [1...arguments.length - 1]
      if arguments[i]?
        b = arguments[i]
        break
    b || ''

# only in frontend
Handlebars.registerHelper "equalsRemainder", (a, b, c, options) ->
  if (a + 1) % b is c
    options.fn(this)
  else
    options.inverse(this)

Handlebars.registerHelper 'splitter', (a, b, c, options) ->
  if typeof(a) is "STRING"
    a.split(c)[b]

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

Handlebars.registerHelper 'i18n', (key, options) =>
  i18n = if (typeof window == 'undefined') then options.data.root['__I18N__'] else window.i18n
  if (i18n == null)
    return key

  context = _.extend({keySeparator: ':/:'}, options.hash)
  bundlePrefix = "all_mix"

  if (arguments.length > 2)
    for i in [1...arguments.length - 1]
      context['' + (i - 1)] = arguments[i]

  if (options.hash.bundle)
    return i18n.t(bundlePrefix + ':@:' + options.hash.bundle + ":/:" + key, context)

  return i18n.t(key, context)

Handlebars.registerHelper "withPerm", (permStr, options) ->
  # permStr 为空就直接放过
  return options.fn(this) if (permStr == null || permStr.trim() is '')
  authInfo = window.userAuth
  return options.inverse(this) if (authInfo == null)
  resources = permStr.split(',')
  return options.fn(this) if (resources.some((role)=> return authInfo.resources.indexOf(role.trim()) > -1))
  return options.inverse(this)

Handlebars.registerHelper 'formatCent', (a, b, c, options) ->
  return if not a?
  formatedNum = (a / b).toFixed(c)
  return formatedNum

const YAML = require("js-yaml")
const _ = require("lodash")

module.exports = (options, shepherd) => {
  const log = shepherd.log
  let opts = {}

  if (options) {
    _.extend(opts, options)
  }

  return (assets) => {

    if (!Array.isArray(assets)) {
      assets = [assets]
    }

    const transferContent = {}

    assets.forEach( asset => {
      const path = asset.logicalPath()
      const content = YAML.safeLoad(asset.content, {json: true})
      const module = path.indexOf("/locales") === -1 ? false : path.substr(0, path.lastIndexOf("/locales"))
      const ns = module ? module.split("/")[0] : false

      _.each(content, (v, k) => {

        if (v == "true" || v == true) {
          content[k] = k
        }
      })

      try {
        if (!ns) {
          _.extend(transferContent, content)
        } else if (transferContent[ns]) {
          _.extend(transferContent[ns], content)
        } else {
          transferContent[ns] = content
        }
      } catch (e) {
        log.notice("error path: " + path + "\n" + e)
      }
    })

    assets[0].content = JSON.stringify(transferContent, null, "  ")

    return Promise.resolve([assets[0]])
  }
}

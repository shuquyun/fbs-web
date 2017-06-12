const _ = require("lodash")
const path = require("path")

module.exports = (options) => {
  const opts = {
    priority: ["app/components/", "app/components_eevee/", "app/components_vendor/", "app/"],
    override: true
  }

  if (options) {
    _.extend(opts, options)
  }

  return (assets) => {
    let dealAssets = [],
        dealPath = []

    opts.priority.forEach((order) => {
      let assetPath = path.join(process.cwd(), order)

      assets.forEach((asset) => {

        if (asset.path.indexOf(assetPath) !== -1) {
          if (opts.override) {
            if (dealPath.indexOf( asset.logicalPath()) === -1) {
              dealAssets.push(asset)
              dealPath.push(asset.logicalPath())
            }
          } else {
            dealAssets.push(asset)
          }
        }
      })
    })

    return Promise.resolve(dealAssets)
  }
}

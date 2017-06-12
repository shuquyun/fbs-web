const YAML = require("js-yaml")

module.exports = (options) => {

  return (assets) => {

    if (!Array.isArray(assets)) {
      assets = [assets]
    }

    assets.forEach( asset => {
      const path = asset.path

      asset.content = JSON.stringify({components: YAML.safeLoad(asset.content, {json: true})}, null, "  ")
      asset.path = path.substr(0, path.lastIndexOf(".")) + ".json"
    })

    return Promise.resolve(assets)
  }
}

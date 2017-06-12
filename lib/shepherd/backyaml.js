const YAML = require("js-yaml")
const _ = require("lodash")

module.exports = (options) => {
  if (options) {
    _.extend(opts, options)
  }

  return (assets) => {

    if (!Array.isArray(assets)) {
      assets = [assets]
    }

    assets.forEach( asset => {
      const path = asset.path
      const services = YAML.safeLoad(asset.content, {json: true})

      _.each(services, service => {
        if (service.query) {
          queries = service.query
          service.query = _.map(queries, query => {
            if (typeof query === 'object') {
              return query.key
            } else {
              return query
            }
          })
        }
      })

      asset.content = JSON.stringify({services}, null, "  ")
      asset.path = path.substr(0, path.lastIndexOf(".")) + ".json"
    })

    return Promise.resolve(assets)
  }
}

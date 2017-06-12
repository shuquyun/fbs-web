const _ = require("lodash")

module.exports = (options) => {
  if (options) {
    _.extend(opts, options)
  }

  return (assets) => {

    if (!Array.isArray(assets)) {
      assets = [assets]
    }

    const variables = {
      '\\$default\-background\-color': '$color-background',
      '\\$default\-overlay\-color': '$color-overlay',
      '\\$default\-darken-border\-color': '$color-border-disable',
      '\\$default\-border\-color': '$color-border',
      '\\$default\-note\-color': '$color-text-note',
      '\\$default\-danger\-color': '$color-danger',
      '\\$default\-hover\-color': '$color-primary',
      '\\$default\-body\-color': '$color-text',
    }

    assets.forEach( asset => {
      _.each(variables, (v, k) => {
        asset.content = asset.content.replace(new RegExp(k, 'g'), v)
      })
    })


    return Promise.resolve(assets)
  }
}

const _ = require("lodash")
const fs = require("fs")
const path = require("path")
const glob = require("glob")

module.exports = (options, shepherd) => {
  const log = shepherd.log
  const defaults = {
    locale: 'zh_CN',
    folders: ["app/{components_vendor,components}"]
  }

  _.extend(defaults, options)

  const templates = {}
  const locales = {}
  const js = {}
  glob.sync(`${defaults.folders}/**/view.hbs`).forEach(file => {
    const dir = path.dirname(file)
    const k = []
    glob.sync(`${dir}/**/*.hbs`).forEach(tf => {
      const content = fs.readFileSync(tf, { encoding: "utf8" })
      const matches = content.match(/{{i18n (".*?")}}/g)
      if (matches) {
        matches.map(m => {
          const ms = m.match(/\s+".*?"\s+/)
          if (ms) {
            return k.push(ms[0].trim())
          }
          return false
        })
      }
    })
    templates[dir] = k

    glob.sync(`${dir}/locales/${defaults.locale}.yaml`).forEach(lf => {
      const ks = []
      const content = fs.readFileSync(lf, { encoding: "utf8" })
      content.split("\n").forEach(line => {
        if (line.trim() !== "") {
          let key = line.trim().split(":")[0]
          if (!key.startsWith("\"")) {
            key = `"${key}"`
          }
          ks.push(key)
        }
      })
      locales[dir] = ks
    })

    glob.sync(`${dir}/**/*.{coffee,es6}`).forEach(lf => {
      const kss = []
      const content = fs.readFileSync(lf, { encoding: "utf8" })
      const matches = content.match(/i18n\.ct\('(.*?)'\)/g)
      if (matches) {
        matches.map(m => {
          const ms = m.match(/'(.*?)'/)
          if (ms) {
            return kss.push(ms[0].trim().replace(/'/g, '"'))
          }
          return false
        })
      }
      js[dir] = kss
    })
  })

  Object.keys(templates).forEach(k => {
    const diff = _.difference(templates[k], locales[k])
    if (!_.isEmpty(diff)) {
      log.notice(`${defaults.locale} Template: ${k} => ${_.uniq(diff)}`)
    }
  })

  Object.keys(templates).forEach(k => {
    const diff = _.difference(js[k], locales[k])
    if (!_.isEmpty(diff)) {
      log.notice(`${defaults.locale} JS: ${k} => ${_.uniq(diff)}`)
    }
  })

  return Promise.resolve("Hello Lint")
}


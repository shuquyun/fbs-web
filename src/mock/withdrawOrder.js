const { config, withdrawOrder } = require('./common')

const { apiPrefix } = config
let database = withdrawOrder

module.exports = {

  [`GET ${apiPrefix}/withdrawOrder`] (req, res) {
    const { query } = req
    let { pageSize, pageNo, ...other } = query
    pageSize = pageSize || 10
    pageNo = pageNo || 1

    let newData = database
    for (let key in other) {
      if ({}.hasOwnProperty.call(other, key)) {
        newData = newData.filter((item) => {
          if ({}.hasOwnProperty.call(item, key)) {
            return String(item[key]).trim().indexOf(decodeURI(other[key]).trim()) > -1
          }
          return true
        })
      }
    }

    res.status(200).json({
      data: newData.slice((pageNo - 1) * pageSize, pageNo * pageSize),
      total: newData.length,
    })
  },
}

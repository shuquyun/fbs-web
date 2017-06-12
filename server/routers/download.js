const fs = require('fs')
const http = require('http')
function readData(fileUrl) {
  return new Promise((resolve,reject) => {
    fs.readFile(fileUrl , (err,data) => {
      console.log(data)
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  }).then((data) => {
    console.log(data);
    return data
  }, (err) => {
    console.log(err)
    return err
  })
}
module.exports = ({ router, options }) => {
  router.get('/api/user/download', async(ctx, next) => {
    const fileUrl = 'http:' + ctx.query.fileUrl
    const fileName = ctx.query.fileName
    ctx.header['Content-disposition']  = `attachment;filename=${fileName}`
    ctx.header['Content-type'] = 'application/octet-stream'
    ctx.body = await readData(fileUrl)
  })
}

const CryptoJS = require('crypto-js')

module.exports = ({ router, options }) => {
  router.get('/api/get-app-sign', async(ctx, next) => {
    const upload = options.upload.options
    const random = parseInt(Math.random() * Math.pow(2, 32))
    const now = parseInt(new Date().getTime() / 1000)
    const e = now + 60
    const path = ctx.query.path || ''
    const bucket = ctx.query.bucket
    const str = 'a=' + upload.appId + '&k=' + upload.secretID + '&e=' + e + '&t=' + now + '&r=' + random +
            '&f=' + path + '&b=' + bucket

    const sha1Res = CryptoJS.HmacSHA1(str, upload.secretKey)//这里使用CryptoJS计算sha1值，你也可以用其他开源库或自己实现
    const strWordArray = CryptoJS.enc.Utf8.parse(str)
    const resWordArray = sha1Res.concat(strWordArray)
    const res = resWordArray.toString(CryptoJS.enc.Base64)
    ctx.body = res
    await next()
  })
}

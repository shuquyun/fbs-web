module.exports = () => async (ctx, next) => {
  const { header } = ctx;
  // 通过请求头accept 来判断是否支持webp
  ctx.herdContext['_CAN_WEBP_'] = header.accept && header.accept.indexOf("image/webp") > -1;
  await next();
}

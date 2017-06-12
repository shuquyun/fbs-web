module.exports = () => async (ctx, next) => {
  ctx.herdContext['_TERMINUS_KEY_'] = process.env.TERMINUS_KEY;
  await next();
}

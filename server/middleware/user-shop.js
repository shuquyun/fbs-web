module.exports = () => async (ctx, next) => {
  process.log.debug(`[Middleware user-shop] Try to user shop id ${ctx.path}`);
  try {
    // if (ctx.state.currentUser && ctx.state.currentUser.shopId) {
    //   ctx.herdContext['_MY_SHOP_ID_'] = ctx.state.currentUser.shopId;
    // }

    if (ctx.state.currentUser && ctx.state.currentUser.companyId) {
      ctx.herdContext['_COMPANY_ID_'] = ctx.state.currentUser.companyId;
    }

    if (process.log.isEnable('DEBUG')) {
      process.log.debug(`[Middleware user-shop] Get user shopId: ${ctx.herdContext['_MY_SHOP_ID_']}`);
    }
  } catch (e) {
    process.log.debug(`[Middleware user-shop] Error when try user shop id: ${e}`);
  }

  await next();
};

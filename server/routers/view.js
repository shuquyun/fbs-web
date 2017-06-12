module.exports = ({ router, invokers, handlebars }) => {
  router.get('/items/:itemId', async (ctx, next) => {
    const { itemId } = ctx.params;
    const item = await invokers.call('findItemByIdWithCache', { itemId });
    ctx.herdContext["itemId"] = itemId
    ctx.state.shopId = item.shopId
    await next();
  });

  router.get(/^\/list(?:\/|$)/, async (ctx, next) => {
    const { billId, bidId, connectId, companyIds, type } = ctx.query;
    Object.assign(ctx.herdContext, { billId, bidId, connectId, companyIds, typeId: type });
    await next();
  })
}

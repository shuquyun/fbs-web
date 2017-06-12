module.exports = ({ router, invokers, handlebars, options }) => {
  router.post('/buyer/pre-order', async ctx => {
    if (ctx.state.currentUser) {
      const {data, channel} = ctx.request.body;

      await ctx.render('/buyer/pre-order', {data, channel});
    }

    return this.status = 401;
  });

  router.get('/buyer/pre-order', async ctx => {
    await ctx.redirect("/buyer/cart");
  })
}

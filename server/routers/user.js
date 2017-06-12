function buildTreeNode(key, node) {
  let children;
  if (node.children) {
    children = Object.keys(node.children).map(childKey => buildTreeNode(childKey, node.children[childKey]));
  } else {
    children = [];
  }
  return {
    key,
    name: node.name,
    children,
  };
}

module.exports = ({ router, invokers, handlebars, options }) => {
  router.post('/api/user/login', async ctx => {
    const body = ctx.request.body;
    const result = await invokers.call('login', {
      username: body.loginBy,
      password: body.password,
    });
    ctx.session.userId = result.id;
    if (result.shopId != undefined && result.shopId != null) {
      ctx.session.shopId = result.shopId;
    }
    if (result.status == -4) {
      ctx.body = { redirect: `/register-company` }
    }else if (result.status == -5 || result.status == -6) {
      ctx.body = { redirect: `/register-result` }
    }else if (body.target) {
      ctx.body = { redirect: body.target };
    } else {
      ctx.body = { redirect: '/' };
    }
  });
  router.post('/api/user/logout', ctx => {
    ctx.session.userId = undefined;
    ctx.state.currentUser = undefined;
    ctx.session.shopId = undefined;
    ctx.body = true;
  });
  router.get('/api/user', ctx => {
    ctx.body = ctx.herdContext['_USER_'];
  });
  router.get('/api/auth/tree', ctx => {
    const role = ctx.query['role'];
    if (!options.auth.trees) {
      ctx.body = {};
      return;
    }
    const roleTree = options.auth.trees[role] || {};
    ctx.body = {
      baseRole: role,
      children: Object.keys(roleTree).map(key => buildTreeNode(key, roleTree[key])),
    };
  });
  router.get('/developer/*', async (ctx, next) => {
    const userInfo = ctx.herdContext['_USER_']
    if (userInfo.companyType == 2) {
      ctx.redirect("/supplier/index")
    } else {
      await next();
    }
  });
  router.get('/supplier/*', async (ctx, next) => {
    const userInfo = ctx.herdContext['_USER_']
    if (userInfo.companyType == 1) {
      ctx.redirect("/developer/index")
    } else {
      await next();
    }
  });
}

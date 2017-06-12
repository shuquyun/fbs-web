module.exports = ({ router, invokers, handlebars, useMiddleware, options }) => {
  require("./handlebars/helper")({ router, invokers, handlebars })

  require("./routers/user")({ router, invokers, handlebars, options })
  require("./routers/trade")({ router, invokers, handlebars, options })
  require("./routers/view")({ router, invokers, handlebars })
  require("./routers/download")({ router, options })
  require("./routers/upload")({ router, options })
  useMiddleware(require("./middleware/header-webp")())
  // useMiddleware(require("./middleware/user-shop")())
  useMiddleware(require("./middleware/terminus-key")())
}

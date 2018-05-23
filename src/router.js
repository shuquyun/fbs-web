import React from 'react'
import PropTypes from 'prop-types'
import {Router} from 'dva/router'
import App from './routes/app'

const registerModel = (app, model) => {
  if (!(app._models.filter(m => m.namespace === model.namespace).length === 1)) {
    app.model(model)
  }
}

const Routers = function ({history, app}) {
  const routes = [
    {
      path: '/',
      component: App,
      getIndexRoute (nextState, cb) {
        require.ensure([], (require) => {
          registerModel(app, require('./models/dashboard'))
          cb(null, {component: require('./routes/dashboard/')})
        }, 'dashboard')
      },
      childRoutes: [
        {
          path: 'index',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/dashboard'))
              cb(null, require('./routes/dashboard/'))
            }, 'dashboard')
          },
        }, {
          path: 'login',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/login'))
              cb(null, require('./routes/login/'))
            }, 'login')
          },
        }, {
          path: 'resetpwd',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              registerModel(app, require('./models/resetpwd'))
              cb(null, require('./routes/resetpwd/'))
            }, 'resetpwd')
          },
        }, {
          path: 'user/admin',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/user/admin'))
              cb(null, require('./routes/user/admin/'))
            }, 'userAdmin')
          },
        }, {
          path: 'user/list',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/user/list'))
              cb(null, require('./routes/user/list/'))
            }, 'userList')
          },
        }, {
          path: 'base/notice',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/base/notice'))
              cb(null, require('./routes/base/notice/'))
            }, 'baseNotice')
          },
        }, {
          path: 'base/message',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/base/message'))
              cb(null, require('./routes/base/message/'))
            }, 'baseMessage')
          },
        }, {
          path: 'base/info',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/base/info'))
              cb(null, require('./routes/base/info/'))
            }, 'baseInfo')
          },
        }, {
          path: 'base/role',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/base/role'))
              cb(null, require('./routes/base/role/'))
            }, 'baseRole')
          },
        }, {
          path: 'base/permission',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              registerModel(app, require('./models/base/permission'))
              cb(null, require('./routes/base/permission/'))
            }, 'basePermission')
          },
        },
        {
          path: '*',
          getComponent (nextState, cb) {
            require.ensure([], (require) => {
              cb(null, require('./routes/error/'))
            }, 'error')
          },
        },
      ],
    },
  ]

  return <Router history={history} routes={routes}/>
}

Routers.propTypes = {
  history: PropTypes.object,
  app: PropTypes.object,
}

export default Routers

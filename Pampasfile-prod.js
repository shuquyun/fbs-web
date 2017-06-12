const _ = require("lodash")
const opts = {
  backendUrl: "http://parana-api.terminus.io",
  localUrl: "http://parana.terminus.io"
}

const config = {
  port: 8181,
  designer: {
    mysql: { // 如果不使用装修，那么 mysql 是不需要配的
      database: 'eeveeVanke',
      username: 'root',
      password: 'anywhere',
      host: 'localhost',
      port: '3306',// default 3306
      pool: {  // connection pool
        max: 10,  //max connections
        min: 0,
        idle: 10000 //idle time(ms),that a connection can be idle before being released
      }
    }
  },
  session: {
    store: 'redis',
    cookieDomain: 'vanke.dithub.com',
    prefix: 'afsession',
    maxAge: 1000 * 60 * 30,
    user: {
      idKey: 'userId',
      getService: 'getUserById',
    },
  },
  redis: {
    host: '127.0.0.1',
    port: 6379,
  },
  upload: {
    enable: true,
    points:[
      {
        url: '/api/user/files/upload',
        provider: "cos",
        bucket: "hshbucket",
        appId: "1253455349",
        secretID: "AKIDU1thKvUM4bw890sKxUq22rX4c6PYgKwN",
        secretKey: "VsAHCxzqttiLm26yfx9Azc4LQiv56vY2",
        region: "gz",
        targetHost: "hshbucket-1253455349.picgz.myqcloud.com"
      }
    ]
  },
  middlewareOpts: {
    bodyParser: {
      formLimit: '1mb'
    }
  }
}

const defaultOptions = require('./Pampasfile-default')(opts);

module.exports = _.defaultsDeep(config, defaultOptions);

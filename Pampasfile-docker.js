const _ = require("lodash")

const opts = {
  backendUrl: process.env.BACKEND_URL || "http://parana-api.terminus.io",
  localUrl: process.env.LOCAL_URL || "http://parana.terminus.io"
}

const config = {
  port: 9000,
  static: {
    maxage: 1000 * 60 * 60,
  },
  designer: {
    mysql: { // 如果不使用装修，那么 mysql 是不需要配的
      database: process.env.EEVEE_MYSQL_DATABASE || 'eevee',
      username: process.env.MYSQL_USERNAME || 'cdb_outerroot',
      password: process.env.MYSQL_PASSWORD || 'hsh_#$(872)78',
      host: process.env.MYSQL_HOST || '58d3dd833b0ab.gz.cdb.myqcloud.com',
      port: process.env.MYSQL_PORT || 13288, // default 3306
      pool: {  // connection pool
        max: 10,  //max connections
        min: 0,
        idle: 10000 //idle time(ms),that a connection can be idle before being released
      }
    }
  },
  session: {
    store: 'redis',
    cookieDomain: process.env.COOKIE_DOMAIN || 'terminus.io',
    prefix: 'afsession',
    maxAge: 1000 * 60 * 30,
    user: {
      idKey: 'userId',
      getService: 'getUserById',
    },
  },
  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || 'anywhere',
  },
  middlewareOpts: {
    bodyParser: {
      formLimit: '1mb'
    }
  },
  upload: {
    enable: true,
    points:[
      {
        url: '/api/user/files/upload',
        provider: "cos",
        bucket: process.env.COS_BUCKET,
        appId: process.env.COS_APPID,
        secretID: process.env.COS_SECRETID,
        secretKey: process.env.COS_SECRETKEY,
        region: "gz",
        targetHost: process.env.COS_TARGETHOST
      }
    ]
  }
}

const defaultOptions = require('./Pampasfile-default')(opts);

module.exports = _.defaultsDeep(config, defaultOptions);

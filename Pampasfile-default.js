const _ = require("lodash")

const options = {
  backendUrl: "http://119.29.89.14:8081",
  localUrl: "https://parana.terminus.io",
  components: require("./public/front_config.json").components,
  services: require("./public/back_config.json").services,
  mappings: require("./public/front_mappings.json").mappings,
  auth: require("./public/auth-config"),
  serviceConfig: (services, backendUrl, localUrl) => {
    _.each(services, service => {
      if (service.type.toLowerCase() === "http") {
        if (service.url.startsWith("/api/design/")) {
          service.url = localUrl + service.url;
        } else {
          service.url = backendUrl + service.url
        }
      }
    })

    return services
  }
}

module.exports = (opts) => {
  opts = _.defaultsDeep(opts, options)

  return {
    root: __dirname,
    extension: "lib/server/index",
    port: 8081,
    statics: "public",
    handlebars: {
      components: "public/components",
      views: "public/views"
    },
    csrf: {
      enable: false
    },
    shepherd: {
      enable: false
    },
    i18n: {
      enable: true,
      forceLng: "zh-CN",
      defaultLng: "zh-CN",
      cookieKey: "lng",
      resourceFormat: "json",
      resources: "public/resources",
      defaultNS: "all_mix",
      whitelist: ["zh-CN", "en-US"],
    },
    redis: {
      host: "127.0.0.1",
      port: 6379,
    },
    // Session
    session: {
      store: "redis",
      cookieDomain: "terminus.io",
      prefix: "afsession",
      maxAge: 1000 * 60 * 30,
      user: {
        idKey: "userId",
        getService: "getUserById",
      },
    },
    designer: {
      enable: true, // default false
      siteManageUrl: "system/sites",
      mobileBaseUrl: "http://m.parana.terminus.io",
      mysql: { // 如果不使用装修，那么 mysql 是不需要配的
        database: "eevee",
        username: "root",
        password: "wtf",
        host: "localhost",
        port: "3306", // default 3306
        pool: {  // connection pool
          max: 10,  // max connections
          min: 0,
          idle: 10000 // idle time(ms),that a connection can be idle before being released
        }
      },
      designer_layouts: { // 装修需要用到的 layouts
        editorLayout: "eevee/design.hbs",
        templateLayout: "eevee/template.hbs",  //
        mTemplateLayout: "",  // 移动端的模板
        layouts: {
          "PC-DEFAULT": {
            type: "SITE",
            root: "eevee",
            name: "默认 PC 端模版",
            desc: "默认主题的 PC 端模版"
          },
          "PC-SHOP": {
            type: "SHOP",
            root: "eevee",
            name: "默认 PC 端店铺模版",
            desc: "默认主题的 PC 端模版"
          },
          "M-SHOP": {
            type: "SHOP",
            app: "MOBILE",
            root: "/layouts/shop",
            name: "默认 MOBILE 端店铺模版",
            desc: "默认主题的 MOBILE 端模版"
          },
          "M-SITE": {
            type: "SITE",
            app: "MOBILE",
            root: "eevee",
            appType: "react",
            name: "默认 MOBILE 端模版",
            desc: "默认主题的 MOBILE 端模版"
          }
        }
      },
      shopId: 1,
      itemId: 5002
    },
    upload: { // upload 也是装修相关配置，无装修时不支持 upload
      enable: "false", // 需要oss时将此项改为true
      // provider: "oss",
      // accessKeyId: "",
      // accessKeySecret: "",
      // bucket: "terminus-designer",
      // region: "",
      // targetHost: "",
      // targetProtocol: "",
    },
    proxy: {
      enable: true, // default is false

      router: [ // a array, required if enable set to true and not have match,to. whole path will route when first matched in array.
        {
          match: '/api/.+', // a regex string, required if enable set to true. whole path matched
          to: opts.backendUrl, // required too
        }
      ]
    },
    auth: opts.auth,
    // Components
    components: opts.components,
    // Services
    services: opts.serviceConfig(opts.services, opts.backendUrl, opts.localUrl),
    // URL to service mappings
    mappings: opts.mappings
  }
}

const fs = require("fs-extra")
const i18nlint = require("./lib/shepherd/i18nlint")
const priority = require("./lib/shepherd/priority")
const yaml2json = require("./lib/shepherd/yaml2json")
const backyaml = require("./lib/shepherd/backyaml")
const i18n = require("./lib/shepherd/i18n")
const colorMigration = require("./lib/shepherd/colorMigration")

process.settings = {
  paths: {
    app: "app",
    test: "test",
    vendor: "vendor",
    public: "public"
  },
  bases: [
    "app/components/**/images/other-images/",
    "app/components/**/images/",
    "app/images/other-images/",
    "app/styles/",
    "app/components/items/styles/",
    "app/components/common/styles/",
    "app/components/shop/styles/",
    "app/components/settlement/styles/",
    "app/components/design/styles/",
    "app/components/user/styles/",
    "app/components/trade/styles/",
    "app/components/pay/styles/",
    "app/components/",
    "app/components_eevee/",
    "vendor/eevee/",
    "vendor/ta/",
    "vendor/",
    "app/*/",
    "{app,vendor}/{,eevee/,views/eevee/,*/}",
    "./node_modules/@terminus/eevee/dist/components/eevee/",
    "./node_modules/@terminus/eevee/dist/",
    "public/",
    "./",
  ],
  scriptsOrder: [
    "vendor/require.js",
    "vendor/es5-shim.js",
    "vendor/es5-sham.js",
    "vendor/pokeball.js",
    "...",
    "app/scripts/app.coffee"
  ],
  stylesOrder: [
    "vendor/pokeball.scss",
    "..."
  ],
  bundles: [
    {
      name: "pokeball.js",
      version: "master",
      url: "http://registry.terminus.io/packages/pokeball/2.0.12/pokeball.js"
    }, {
      name: "pokeball.scss",
      version: "master",
      url: "http://registry.terminus.io/packages/pokeball/2.0.12/pokeball.scss"
    }, {
      name: "../app/styles/pokeball/_variables.scss",
      version: "master",
      url: "http://registry.terminus.io/packages/pokeball/2.0.12/variables.scss"
    }, {
      name: "tree-model.js",
      version: "master",
      url: "http://registry.terminus.io/packages/treeModel/v1.0.6/tree-model.js"
    }, {
      name: "i18n-frontend.js",
      version: "master",
      url: "http://registry.terminus.io/packages/i18n-frontend/0.1.5/browser.js"
    }, {
      name: "i18n-helpers.js",
      version: "master",
      url: "http://registry.terminus.io/packages/i18n-helpers/0.1.0/index.js"
    }, {
      name: "jquery.lazyload.js",
      version: "1.9.3",
      url: "http://registry.terminus.io/packages/jquery.lazyload.js/1.9.3/jquery.lazyload.js"
    }, {
      name: "wysihtml5.js",
      version: "0.3.0",
      url: "http://registry.terminus.io/packages/wysihtml5/0.3.0/wysihtml5.js"
    }, {
      name: "advanced.js",
      version: "0.5.2",
      url: "http://registry.terminus.io/packages/wysihtml5/0.5.2/wysihtml5-advanced.js"
    }, {
      name: "es5-shim.js",
      version: "4.5.9",
      url: "http://cdn.bootcss.com/es5-shim/4.5.9/es5-shim.js"
    }, {
      name: "es5-sham.js",
      version: "4.5.9",
      url: "http://cdn.bootcss.com/es5-shim/4.5.9/es5-sham.js"
    }, {
      name: "require.js",
      version: "1.0.0",
      url: "http://registry.terminus.io/packages/require_definition/1.0.0/require.js"
    }
    // , {
    //   name: "ta/ta.js",
    //   version: "master",
    //   url: "http://registry.terminus.io/packages/ta/0.1.0/ta-min.js"
    // }
  ]
}

module.exports = (shepherd) => {
  const log = shepherd.log
  const { coffee, compass, copy, concat, cmd, babel, sprite, handlebars, jst, rev, uglifier, cleancss } = shepherd.chains
  const { repo, targz } = shepherd.plugins

  const copyResource = (src, dest) => {
    return shepherd.src(src)
      .then(copy(dest))
      .then(shepherd.dest())
  }

  const locale = (src, dest) => {
    return shepherd.src(src)
      .then(priority({ priority: ["app/files/", "app/components/"], override: false }))
      .then(i18n({}, shepherd))
      .then(concat(dest))
      .then(shepherd.dest())
  }

  const config = (src, dest) => {
    return shepherd.src(src)
      .then(priority({ priority: ["app/files/", "app/components/"], override: false }))
      .then(concat(dest))
      .then(yaml2json())
      .then(shepherd.dest())
  }

  const styles = (src, dest) => {
    return shepherd.src(src)
      .then(compass())
      .then(concat(dest, { order: process.settings.stylesOrder }))
      .then(cleancss())
      .then(shepherd.dest())
  }

  const scripts = (src, dest) => {
    return shepherd.src(src)
      .then(priority())
      .then(coffee())
      .then(babel({
        perferSyntax: [".babel", ".es", ".jsx", ".es6"],
        compileOptions: {
          presets: ["es2015"],
          plugins: ["add-module-exports", "transform-es3-property-literals", "transform-es3-member-expression-literals"]} }))
      .then(cmd())
      .then(concat(dest, { order: process.settings.scriptsOrder }))
      .then(uglifier({ compileOptions: { compress: { screw_ie8: false }, output: { ascii_only: true, screw_ie8: false }, mangle: { screw_ie8: false } } }))
      .then(shepherd.dest())
  }

  const templates = (src, dest) => {
    return shepherd.src(src)
      .then(priority())
      .then(handlebars())
      .then(concat(dest))
      .then(jst())
      .then(uglifier({ compileOptions: { compress: { screw_ie8: false }, output: { ascii_only: true, screw_ie8: false }, mangle: { screw_ie8: false } } }))
      .then(shepherd.dest())
  }

  const srcPath = {
    frontScriptPath: "app/{{scripts,components_eevee},components/{common,design,shop_design,utils}}/**/{!(config), *}.{js,coffee,jsx,es6,es}",
    backScriptPath: "app/{scripts,{components,components_eevee}/{shop_design/item_detail,!(design|shop_design), *}}/**/{!(config), *}.{js,coffee,jsx,es6,es}",
    frontTemplatePath: "app/components/{common,design,shop_design,utils}/**/{frontend_templates,all_templates}/*.hbs",
    backTemplatePath: "app/components/{!(design|shop_design), *}/**/{frontend_templates,all_templates}/*.hbs",
    frontStylePath: "app/{{styles,components_eevee},components/{common,design,shop_design,utils}}/**/[a-z]*.{css,scss,sass}",
    backStylePath: "app/{styles,{components,components_eevee}/{shop_design/item_detail,!(design|shop_design), *}}/**/[a-z]*.{css,scss,sass}",
    vendorScriptPath: "vendor/*.js",
    configScriptPath: "app/{scripts,components,components_eevee}/{common,design,shop_design,eevee}/**/config.{js,coffee,es6}",
    designAssetPath: "vendor/eevee/{scripts,styles,fonts}/*",
    designViewPath: "vendor/eevee/views/**/*",
    templatePath: "{app/views/**/templates/*.hbs,app/components/**/{frontend_templates,all_templates}/*.hbs}",
    spritePath: "app/{images,components}/**/images/*.png",
    imagePath: "app/{images,components}/**/other-images/*.{png,jpg,gif,ico,htc}",
    vendorStylePath: "vendor/[a-z]*.{css,scss,sass}",
    componentPath: "{app/{components_eevee,components}/**/{view.hbs,thumbnail.png},app/{components_eevee,components}/**/{backend_templates,all_templates}/*.hbs}",
    viewPath: "app/views/**/*.hbs",
    configPath: "./{{ecosystem,package}.json,{Pampasfile,shepherd}.js}",
    filePath: "app/files/{front_href,render_config,auth-config}.{js,yaml}",
    frontConfigPath: "{app/files/front_config.yaml,app/components/**/front_config.yaml}",
    backConfigPath: "{app/files/back_config.yaml,app/components/**/back_config.yaml}",
    frontMappingPath: "app/files/front_mappings.yaml",
    enLocalesPath: "app/{files,components}/**/en_US.yaml",
    zhLocalesPath: "app/{files,components}/**/zh_CN.yaml"
  }

  shepherd.task("clean", () => {
    return Promise.resolve(
      fs.emptyDirSync(process.settings.paths.public),
      fs.emptyDirSync("app/components_eevee"),
      fs.emptyDirSync("vendor/eevee")
    )
  })

  shepherd.task("repo", ["clean"], () => {
    return repo({ bundles: process.settings.bundles })
  })

  shepherd.task("eevee", ["clean"], () => {
    return copyResource("./node_modules/@terminus/eevee/dist/{fonts,scripts,styles,views}/**/*", "vendor/eevee")
  })

  shepherd.task("eeveeComponents", ["clean"], () => {
    return copyResource("./node_modules/@terminus/eevee/dist/components/eevee/**/*", "app/components_eevee/eevee")
  })

  shepherd.task("eeveeViews", () => {
    return copyResource("{vendor/eevee/views/**/*,app/views/eevee/**/*}", "public/views/eevee")
  })

  shepherd.task("frontScripts", () => {
    return scripts(srcPath.frontScriptPath, "public/assets/scripts/app-front.js")
  })

  shepherd.task("backScripts", () => {
    return scripts(srcPath.backScriptPath, "public/assets/scripts/app-back.js")
  })

  shepherd.task("scriptsVendor", () => {
    return shepherd.src(srcPath.vendorScriptPath)
      .then(concat("public/assets/scripts/vendor.js", { order: process.settings.scriptsOrder }))
      .then(uglifier({ compileOptions: { compress: { screw_ie8: false }, output: { ascii_only: true, screw_ie8: false }, mangle: { screw_ie8: false } } }))
      .then(shepherd.dest())
  })

  shepherd.task("ta", () => {
    return copyResource("vendor/ta/ta.js", "public/assets/scripts/")
  })

  shepherd.task("scriptsConfig", () => {
    return scripts(srcPath.configScriptPath, "public/assets/scripts/config.js")
  })

  shepherd.task("assetsDesigner", () => {
    return copyResource(srcPath.designAssetPath, "public/assets")
  })

  shepherd.task("viewsDesigner", () => {
    return copyResource(srcPath.designViewPath, "public/views")
  })

  shepherd.task("sprite", () => {
    return shepherd.src(srcPath.spritePath)
      .then(priority())
      .then(sprite({
          spritesheet_url: "/assets/images/icons.png",
          spritesheet_image: "public/assets/images/icons.png",
          spritesheet_css: "app/styles/_icons.scss",
          format: "css"
        }))
      .then(shepherd.dest())
  })

  shepherd.task("imagesCopy", () => {
    return copyResource(srcPath.imagePath, "public/assets/images/other-images")
  })

  shepherd.task("frontStyles", ["sprite"], () => {
    return styles(srcPath.frontStylePath, "public/assets/styles/app-front.css")
  })

  shepherd.task("backStyles", ["sprite"], () => {
    return styles(srcPath.backStylePath, "public/assets/styles/app-back.css")
  })

  shepherd.task("stylesVendor", () => {
    return shepherd.src(srcPath.vendorStylePath)
      .then(priority({ priority: ["vendor/pokeball.scss", "vendor/"], override: true }))
      .then((assets) => {
        assets[0].content = '@import "pokeball/theme";\n' + assets[0].content
        return Promise.resolve(assets)
      })
      .then(compass())
      .then(concat("public/assets/styles/vendor.css", { order: process.settings.stylesOrder }))
      .then(cleancss())
      .then(shepherd.dest())
  })

  shepherd.task("componentsView", () => {
    return shepherd.src(srcPath.componentPath)
      .then(priority())
      .then(copy("public/components"))
      .then(shepherd.dest())
  })

  shepherd.task("views", () => {
    return copyResource(srcPath.viewPath, "public/views")
  })

  shepherd.task("frontTemplates", () => {
    return templates(srcPath.frontTemplatePath, "public/assets/scripts/templates-front.js")
  })

  shepherd.task("backTemplates", () => {
    return templates(srcPath.backTemplatePath, "public/assets/scripts/templates-back.js")
  })

  shepherd.task("configFile", () => {
    return copyResource(srcPath.configPath, "public/")
  })

  shepherd.task("file", () => {
    return copyResource(srcPath.filePath, "public/")
  })

  shepherd.task("frontConfig", ["file"], () => {
    return config(srcPath.frontConfigPath, "public/front_config.json")
  })

  shepherd.task("front_mapping", ["file"], () => {
    return config(srcPath.frontMappingPath, "public/front_mappings.json")
  })

  shepherd.task("backConfig", ["file"], () => {
    return shepherd.src(srcPath.backConfigPath)
      .then(priority({ priority: ["app/files/", "app/components/"], override: false }))
      .then(concat("public/back_config.json"))
      .then(backyaml())
      .then(shepherd.dest())
  })

  shepherd.task("enLocales", () => {
    return locale(srcPath.enLocalesPath, "public/resources/all_mix/en-US.json")
  })

  shepherd.task("zhLocales", () => {
    return locale(srcPath.zhLocalesPath, "public/resources/all_mix/zh-CN.json")
  })

  shepherd.task("init", ["repo", "eevee", "eeveeComponents"])

  shepherd.task("app", [
    "server",
    "views", "frontStyles", "backStyles", "frontScripts", "backScripts", "frontTemplates", "backTemplates", "componentsView", "imagesCopy",
    "backConfig", "frontConfig", "front_mapping", "enLocales", "zhLocales",
    "assetsDesigner", "scriptsConfig",
    "scriptsVendor", "stylesVendor", "ta"
  ])

  shepherd.task("server", () => {
    return shepherd.src("server/**/*.{js,coffee}")
      .then(babel({ perferSyntax: [".js"], compileOptions: {plugins: ["transform-async-to-generator"]}}))
      .then(coffee())
      .then(copy("lib"))
      .then(shepherd.dest())
  })

  shepherd.task("revision", ["app"], () => {
    return shepherd.src("public/**/*")
      .then(rev({
        rootPath: `${process.cwd()}/public`,
        manifest: "manifest.json"
      }))
      .then(copy("public/", { bases: ["public/"] }))
      .then(shepherd.dest())
  })

  shepherd.task("zhI18nlint", () => {
    return i18nlint({locale: 'zh_CN'}, shepherd)
  })

  shepherd.task("enI18nlint", () => {
    return i18nlint({locale: 'en_US'}, shepherd)
  })

  shepherd.task("default", ["init"], () => {
    shepherd.watch(srcPath.componentPath, ["componentsView"])
    shepherd.watch(srcPath.viewPath, ["views"])
    shepherd.watch(srcPath.spritePath,  ["sprite"])
    shepherd.watch(srcPath.frontStylePath, ["frontStyles"])
    shepherd.watch(srcPath.backStylePath, ["backStyles"])
    shepherd.watch(srcPath.frontScriptPath, ["frontScripts"])
    shepherd.watch(srcPath.backScriptPath, ["backScripts"])
    shepherd.watch(srcPath.backConfigPath, ["backConfig"])
    shepherd.watch(srcPath.frontConfigPath, ["frontConfig"])
    shepherd.watch(srcPath.frontTemplatePath, ["frontTemplates"])
    shepherd.watch(srcPath.backTemplatePath, ["backTemplates"])
    shepherd.watch(srcPath.configScriptPath, ["scriptsConfig"])
    shepherd.watch(srcPath.filePath, ["file"])
    shepherd.watch(srcPath.frontMappingPath, ["front_mapping"])
    shepherd.watch(srcPath.imagePath, ["imagesCopy"])
    shepherd.watch(srcPath.vendorScriptPath, ["scriptsVendor"])
    shepherd.watch(srcPath.vendorStylePath, ["stylesVendor"])
    shepherd.watch("vendor/eevee/*", ["assetsDesigner"])
    shepherd.watch(srcPath.enLocalesPath, ["enLocales"])
    shepherd.watch(srcPath.zhLocalesPath, ["zhLocales"])
    shepherd.watch("vendor/ta/ta.js", ["ta"])
    shepherd.watch("server/**/*", ["server"])
    shepherd.watch("app/components/**/*", ["zhI18nlint"])
    shepherd.watch("app/components/**/*", ["enI18nlint"])
  })

  shepherd.task("build", ["init"], () => {
    return shepherd.run("revision")
  })

  shepherd.task("prepareConfig", () => {
    return Promise.resolve(fs.copy('Pampasfile-prod.js', 'Pampasfile.js'))
  })

  shepherd.task("migration", () => {
    return shepherd.src("app/components/**/*.{sass,css,scss}")
      .then(colorMigration())
      .then(shepherd.dest())
  })
}

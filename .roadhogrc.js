const path = require('path')

const svgSpriteDirs = [
  path.resolve(__dirname, 'src/svg/'),
  require.resolve('antd').replace(/index\.js$/, ''),
]

export default {
  entry: 'src/index.js',
  svgSpriteLoaderDirs: svgSpriteDirs,
  "theme": "./theme.config.js",
  // 接口代理示例
  "proxy": {
    "/api/v1": {
      "target": "http://192.168.31.131:8901",
      "changeOrigin": true,
      "pathRewrite": { "^/api/v1" : "/api" }
    },
    // "/api/v2": {
    //   "target": "http://192.168.31.130:8911",
    //   "changeOrigin": true,
    //   "pathRewrite": { "^/api/v2" : "/api" }
    // },
  },
  "env": {
      "development": {
        "extraBabelPlugins": [
          "dva-hmr",
          "transform-runtime",
  		    ["import", { "libraryName": "antd", "style": true }]
        ]
      },
      "production": {
        "extraBabelPlugins": [
          "transform-runtime",
  		    ["import", { "libraryName": "antd", "style": true}]
        ]
      }
  }
}

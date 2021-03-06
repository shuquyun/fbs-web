import { resolve } from "path";

export default {
    // for query-string@6 https://github.com/sorrycc/blog/issues/68
    es5ImcompatibleVersions: true,
    plugins: [
        [
            'umi-plugin-react',
            {
                dva: {
                    immer: true,
                },
                antd: true,
                routes: {
                    exclude: [
                        /model\.(j|t)sx?$/,
                        /service\.(j|t)sx?$/,
                        /models\//,
                        /components\//,
                        /services\//,
                        /chart\/Container\.js$/,
                        /chart\/ECharts\/.+Component\.js$/,
                        /chart\/ECharts\/.+ComPonent\.js$/,
                        /chart\/ECharts\/theme\/.+\.js$/,
                        /chart\/highCharts\/.+Component\.js$/,
                        /chart\/highCharts\/mapdata\/.+\.js$/,
                        /chart\/Recharts\/.+Component\.js$/,
                        /chart\/Recharts\/Container\.js$/,
                    ],
                },
                // dynamicImport: {
                //     webpackChunkName: true,
                // },
                // dynamicImport: true,
                hmr: true,
                dll: {
                    exclude: [],
                    include: ["dva", "dva/router", "dva/saga", "dva/fetch", "antd/es"],
                },
                hardSource: /* isMac */process.platform === 'darwin',   //使用webpack缓存 提升启动速度,但是在window10下启动较慢,所以需要做下配置
            },
        ],
    ],
    theme: "./theme.config.js",
    // 接口代理示例
    proxy: {
        "/api/v1/weather": {
            "target": "https://api.seniverse.com/",
            "changeOrigin": true,
            "pathRewrite": { "^/api/v1/weather": "/v3/weather" }
        },
        // "/api/v2": {
        //   "target": "http://192.168.0.110",
        //   "changeOrigin": true,
        //   "pathRewrite": { "^/api/v2" : "/api/v2"u i }
        // }
        // "/api/v1": {
        //     "target": "http://192.168.31.66:8801",
        //     "changeOrigin": true,
        //     "pathRewrite": { "^/api/v1": "/api" }
        // },
    },
    alias: {
        themes: resolve(__dirname, './src/themes'),
        components: resolve(__dirname, "./src/components"),
        utils: resolve(__dirname, "./src/utils"),
        config: resolve(__dirname, "./src/utils/config"),
        enums: resolve(__dirname, "./src/utils/enums"),
        services: resolve(__dirname, "./src/services"),
        models: resolve(__dirname, "./src/models"),
        routes: resolve(__dirname, "./src/routes"),
    },
    urlLoaderExcludes: [
        /\.svg$/,
    ],
    ignoreMomentLocale: true,
    chainWebpack(config) {
        config.module.rule('svg')
            .test(/\.svg$/i)
            .use('svg-sprite-loader')
            .loader(require.resolve('svg-sprite-loader'));
    },
}

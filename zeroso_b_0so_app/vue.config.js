const path = require('path')

function resolve(dir) {
    return path.join(__dirname, './', dir)
}

module.exports = {
    publicPath: '', //文件引用相对路径
    productionSourceMap: false,
    lintOnSave: true,
    chainWebpack: config => {
        config.plugin('define').tap(args => {
            const argv = process.argv
            const icourt = argv[argv.indexOf('--icourt-mode') + 1]

            args[0]['process.env'].MODE = `"${icourt}"`

            return args
        })
        // svg rule loader
        const svgRule = config.module.rule('svg') // 找到svg-loader
        svgRule.uses.clear() // 清除已有的loader, 如果不这样做会添加在此loader之后
        svgRule.exclude.add(/node_modules/) // 正则匹配排除node_modules目录
        svgRule // 添加svg新的loader处理
                .test(/\.svg$/)
                .use('svg-sprite-loader')
                .loader('svg-sprite-loader')
                .options({
                    symbolId: 'icon-[name]',
                })

        // 修改images loader 添加svg处理
        const imagesRule = config.module.rule('images')
        imagesRule.exclude.add(resolve('src/assets/icons'))
        config.module
                .rule('images')
                .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
    },
    devServer: {
        overlay: {
            warnings: true,
            errors: true
        },
        disableHostCheck: true,
        port: '80',
        // host: 'localhost',
        // host: '10.1.2.131',
        // https: false,
        // open: true,
        // proxy: 'http://localhost:4000' // 配置跨域处理，只有一个代理
        // proxy: {
        //   '/': {
        //     ws: false,
        //     target: 'http://10.1.1.169:5000', //肖哥本机订单系统
        //     changeOrigin: true,
        //     pathReWrite: {
        //       '^/': ''
        //     }
        //   }
        // }
    }
}

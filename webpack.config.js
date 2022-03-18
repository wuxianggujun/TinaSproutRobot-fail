const path = require('path');
//webpack中的所有的配置信息都应该写在这里
const HtmlWebpack = require('html-webpack-plugin');
//引入clean插件

module.exports = {
    //指定入口文件
    entry: "./src/main.ts",
    //指定文件打包所在目录
    output: {
        //指定打包文件的目录
        path: path.resolve(__dirname, 'build'),
        //打包后的文件
        filename: "bundle.js",
        //清空之前文件夹的文件
        clean: true

    },

    module: {
        rules: [{
            //指定规则生效的文件
            test: /\.ts$/,
            //要使用ts-loader
            use: [
                //配置babel
                {
                    //指定加载器
                    loader: "babel-loader",
                    //set babel
                    options: {

                        //设置预定义的环境
                        presets: [
                            [
                                //指定环境插件
                                "@babel/preset-env",
                                //配置信息
                                {
                                    //要兼容的目标浏览器
                                    target: {
                                        "chrome": "88"
                                    },
                                    //指定corejs版本
                                    "corejs": "3",
                                    "useBuiltIns": "usage"
                                }
                            ]
                        ]

                    }

                }, 'ts-loader'],
            //要排除的文件
            exclude: /node_modules/
        }]
    },

    //配置插件
    plugins: [
        new HtmlWebpack({
            title: "缇娜-斯普朗特"
        }),
    ],

    //用来设置引用模块
    resolve: {
        extensions: ['.js', '.ts', '.jsx', '.json', '.css']
    }

}
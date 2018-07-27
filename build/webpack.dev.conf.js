const path = require('path')
const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const vConsolePlugin = require('vconsole-webpack-plugin')

module.exports = function (_param) {
    return webpackMerge(new baseWebpackConfig(_param), {
        devtool: 'cheap-module-eval-source-map',
        mode: 'development',
        module: {
            rules: [{
                test: /\.(css|scss)$/,
                use: [
                    'style-loader?sourceMap',
                    'css-loader?sourceMap',
                    'postcss-loader?sourceMap',
                    'sass-loader?sourceMap',
                ],
            }, {
                test: /\.(js|jsx|mjs)$/,
                loader: 'eslint-loader',
                enforce: 'pre',
                include: [path.resolve(__dirname, '../src')],
                options: {
                    formatter: require('eslint-friendly-formatter')
                },
            }, {
                test: /\.(png|jpe?g|gif|svg)$/,
                use: [{
                    // 用url-loader加载进来，phaser不支持data-uri
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                    }
                }]
            }, ]
        },
        plugins: [
            new vConsolePlugin({
                enable: true && /h5/.test(_param)
            }),
            new webpack.HotModuleReplacementPlugin(),
            new FriendlyErrorsPlugin(),
        ],
    })
}
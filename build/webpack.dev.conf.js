const path = require('path')
const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

module.exports = function(_param) {
    return webpackMerge(new baseWebpackConfig(_param), {
        devtool: 'cheap-module-eval-source-map',
        mode: 'development',
        module: {
            rules: [
                {
                    test: /\.(css|scss)$/,
                    use: [
                        'style-loader?sourceMap',
                        'css-loader?sourceMap',
                        'postcss-loader?sourceMap',
                        'sass-loader?sourceMap',
                    ],
                },
                {
                    test: /\.(js|jsx|mjs)$/,
                    loader: 'eslint-loader',
                    enforce: 'pre',
                    include: [path.resolve(__dirname, '../src')],
                    options: {
                        formatter: require('eslint-friendly-formatter')
                    },
                },
            ]
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new FriendlyErrorsPlugin(),
        ],
    })
}

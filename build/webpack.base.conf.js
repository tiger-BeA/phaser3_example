const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin');
module.exports = function (_param) {
    let _entry = {}
    _entry[_param] = path.resolve(__dirname, `../src/${_param}/index.js`)
    return {
        entry: _entry,
        output: {
            filename: '[name].js',
            path: path.resolve(__dirname, `../dist/${_param}`),
            publicPath: '',
        },
        resolve: {
            alias: {},
            extensions: ['.js', '.mjs', '.es'],
        },
        module: {
            rules: [{
                test: /pixi.js/,
                use: [
                    "script-loader"
                ]
            }, {
                test: /\.(js|jsx|mjs)$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader',
                ]
            }, {
                test: /\.html$/,
                use: [{
                    loader: 'html-loader',
                    options: {
                        attrs: ['img:src', 'img:data-original']
                    }
                }, ]
            }, {
                test: /\.(eot|woff|woff2|svg|ttf|zip|mp3|mp4|flv|webm|ogv)$/,
                loader: 'url-loader',
                options: {
                    limit: 5000
                }
            }, {
                test: /\.(png|jpe?g|gif|svg)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        // limit: 16144,
                    }
                }]
            }, ]
        },
        plugins: [
            new CleanWebpackPlugin(['../dist']),
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, `../src/${_param}/index.html`),
                title: `./${_param}/index.html`,
                // inlineSource: '.(js|css)$'
            }),
            new webpack.ProvidePlugin({
                Phaser: 'phaser',
                $: 'jquery'
            })
        ]
    }
}
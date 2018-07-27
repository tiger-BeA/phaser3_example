const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = function (_param) {
    return webpackMerge(new baseWebpackConfig(_param), {
        mode: 'production',
        devtool: 'source-map',
        module: {
            rules: [{
                test: /\.(css|scss)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'sass-loader',
                ],
            }, {
                test: /\.(png|jpe?g|gif|svg)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        name: '[name].[ext]',
                        limit: 6144,
                    }
                }]
            }, ],
        },
        plugins: [
            new CleanWebpackPlugin('../dist'),
            new UglifyJSPlugin({
                sourceMap: true
            }),
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify('production')
            }),
            new MiniCssExtractPlugin({
                filename: "[name].css",
            }),
            new HtmlWebpackInlineSourcePlugin(),
            new webpack.optimize.ModuleConcatenationPlugin(),
        ]
    })
}
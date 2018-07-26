const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = function (_param) {
    return webpackMerge(new baseWebpackConfig(_param), {
        mode: 'production',
        devtool: 'source-map',
        module: {
            rules: [{
                    test: /\.(js|jsx|mjs)$/,
                    loader: 'babel-loader',
                    exclude: /node_modules/
                },
                {
                    test: /\.(png|jpe?g|gif|svg)$/,
                    use: [{
                        loader: 'file-loader',
                        // options: {
                        //     limit: 6144,
                        //     name: '[name].[ext]'
                        // }
                    }],
                },
                {
                    test: /\.(css|scss)$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        'postcss-loader',
                        'sass-loader',
                    ],
                }
            ],
        },
        plugins: [
            new UglifyJSPlugin({
                sourceMap: true
            }),
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify('production')
            }),
            new MiniCssExtractPlugin({
                filename: "[name].css",
            }),
            new webpack.optimize.ModuleConcatenationPlugin(),
        ]
    })
}
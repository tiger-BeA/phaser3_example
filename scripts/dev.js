const fs = require('fs-extra')
const path = require('path')
const webpack = require('webpack')
const argv = require('yargs').argv

const express = require('express')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const httpProxyMiddleware = require('http-proxy-middleware')
const portfinder = require('portfinder')
const opn = require('opn')
const ip = require('ip')
const execa = require('execa')

const webpackDev = require('../build/webpack.dev.conf')
const pathRewrite = require('../mock/pathRewrite')

function rGetFolder(_dir) {
    return fs.readdirSync(_dir)
        .filter((_file) => {
            return fs.statSync(path.join(_dir, _file)).isDirectory()
        })
}

const page = argv.page
const runPath = page ? [].concat(page) : rGetFolder(path.resolve(__dirname, '../src'))

portfinder.basePort = 3000
portfinder.getPortPromise().then((port) => {
    const uri = `http://${ip.address()}:${port}`
    execa.shell(`json-server --watch mock/mock.json --port ${port}`)
    opn(`${uri}/db`)
    console.log(`Mock Server: ${uri}`)
    return port
}).then((port) => {
    console.log(runPath);
    runPath.forEach((_folder) => {
        const webpackConfig = new webpackDev(_folder)
        Object.keys(webpackConfig.entry).forEach((name) => {
            webpackConfig.entry[name] = [path.resolve(__dirname, './client')].concat(webpackConfig.entry[name])
        })
        const app = express()
        const compiler = webpack(webpackConfig)
        const devMiddleware = webpackDevMiddleware(compiler, {
            quiet: true,
        })
        const hotMiddleware = webpackHotMiddleware(compiler, {
            log: false,
        })
        const httpProxy = httpProxyMiddleware({
            target: `http://${ip.address()}:${port}`,
            pathRewrite: pathRewrite,
            changeOrigin: true,
            ws: true,
        })

        app.use(devMiddleware)
        app.use(hotMiddleware)
        app.use('^/mock', httpProxy)

        portfinder.basePort = 9090
        portfinder.getPortPromise().then((port) => {
            app.listen(port, () => {
                const uri = `http://${ip.address()}:${port}`
                opn(uri)
                console.log(`Webpack Server: ${uri}`)
            })
        })
    })
})

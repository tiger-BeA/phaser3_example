const fs = require('fs-extra')
const ora = require('ora')
const chalk = require('chalk')
const path = require('path')
const webpack = require('webpack')
const argv = require('yargs').argv
const webpackProd = require('../build/webpack.prod.conf')

function rGetFolder(_dir) {
    return fs.readdirSync(_dir)
        .filter((_file) => {
            return fs.statSync(path.join(_dir, _file)).isDirectory()
        })
}
const page = argv.page;
const runPath = page ? [].concat(page) : rGetFolder(path.resolve(__dirname, '../src'));

runPath.forEach((_folder) => {
    const webpackConfig = new webpackProd(_folder);
    const spinner = ora(`${_folder} building for production...`);
    const uselessFiles = [
        path.resolve(__dirname, `../dist/${_folder}/*.js`),
        path.resolve(__dirname, `../dist/${_folder}/*.css`),
    ];

    spinner.start();

    webpack(webpackConfig, (err, stats) => {
        spinner.stop();
        if (err) throw err;
        uselessFiles.map((file) => {
            fs.remove(file, err => {
                if (err) throw err;
            });
        });
        console.log(chalk.cyan(`${_folder} pkg success!\n`));
    });
})

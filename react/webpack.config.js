// const path = require('path');
let webpack = require('webpack');
let WebpackBundleSizeAnalyzerPlugin = require('webpack-bundle-size-analyzer').WebpackBundleSizeAnalyzerPlugin;
let BabiliPlugin = require("babel-minify");
let fs = require('fs');
let ProgressBarPlugin = require('progress-bar-webpack-plugin');
let chalk = require('chalk');
let BLACKLIST = [
    'test',
    'common',
    'dashboard',
    'follow',
    'login',
    'utils'

];
let moduleName = 'modules';

const cssLoader = ["style-loader", "css-loader", "postcss-loader"]

const stylLoader = ["style-loader", "css-loader", "stylus-loader", "postcss-loader"]

module.exports = (env) => {
    return {

        entry: (function() {
            let files = fs.readdirSync('./' + moduleName);
            let folders = [];
            files.forEach(function (file) {
                if (fs.existsSync('./' + moduleName + '/' + file + '/app.jsx') && !~BLACKLIST.indexOf(file)) {
                    folders.push(file);
                }
            });

            let obj = {};
            folders.forEach(function (item) {
                obj[item] = __dirname + '/' + moduleName + '/' + item + '/app.jsx';
            });
            return obj;
        })(),

        output: (()=>{
            console.log('=-=============',__dirname);
            return {
                publicPath: __dirname,
                path: __dirname + '/../statics/bundles',
                filename: "[name].js"
            }
        })(),

        module: {
            rules: [
                {
                    test: /\.jsx$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            presets: ["env", "react"]
                        }
                    }
                },
                {
                    test: /\.js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            presets: ["env", "react"]
                        }
                    }
                },{
                    test: /\.css$/,
                    use: cssLoader
                }, {
                    test: /\.styl$/,
                    use: stylLoader
                }
            ],
        },
        resolve: {
            extensions: ['.js', '.jsx']
        },
        // externals: {
        //     'react': 'React',
        //     'react-dom': 'ReactDOM',
        //     'create-react-class': 'React.createClass',
        //     'jquery': 'jQuery'
        //     // 'lodash': 'lodash'
        // },
        // watch: false,
        watchOptions: {
            aggregateTimeout: 300,
            poll: 300
        },
        plugins: (function() {
            let plugins = [
                new ProgressBarPlugin((function() {
                    let buildNo = 0;
                    return {
                        format: `  ${chalk.green.bold('building :percent')}`,
                        callback: function() {
                            buildNo += 1;
                        },
                        summary: false,
                        customSummary: function(buildTime) {
                            let stream = process.stderr;
                            setTimeout(function() {
                                stream.write(chalk.green.bold('Build ' + chalk.cyan.bold(buildNo) + ' completed' + '\n\n'));
                            }, 0);
                        }
                    };
                })()),

                new webpack.optimize.CommonsChunkPlugin({
                    name: "commons",
                    filename: "commons.js",
                    minChunks: function(module, count) {
                        return module.resource
                            && (/React[\/|\\]modules[\/|\\]common/i).test(module.resource) // tách những module ở trong React/modules/common ra thành file vendor riêng
                        // && count >= 3; // nếu được require ở 3 module trở lên sẽ gộp vào file vendor
                    }
                })

            ];
            if (env === 'production') {
                plugins = plugins.concat([
                    new WebpackBundleSizeAnalyzerPlugin(__dirname + '/webpack-bundle-size-report.txt'),
                    new BabiliPlugin()
                ]);
            }
            return plugins;
        })()
    }
};
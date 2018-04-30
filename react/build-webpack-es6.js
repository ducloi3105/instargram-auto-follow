/**
 * node build-webpack-es6.js --help
 * node build-webpack-es6.js --minify --watch
 * node build-webpack-es6.js -mw
 */

let path = require('path');
let childProcess = require('child_process');
let program = require('commander');
let webpack = require('webpack');
let fs = require('fs');
let ProgressBarPlugin = require('progress-bar-webpack-plugin');
let chalk = require('chalk');
let BabelMinifyWebpackPlugin = require("babel-minify-webpack-plugin");
let WebpackBundleSizeAnalyzerPlugin = require('webpack-bundle-size-analyzer').WebpackBundleSizeAnalyzerPlugin;

let CONFIG = {
    modulesFolder: './modules',
    outputFolder: '../statics/bundles',
    moduleEntryFile: 'app.jsx'
};
let resolvePath = (...args) => path.resolve(__dirname, ...args);
let relPath = (...args) => {
    let isWindows = process.platform === "win32";
    let dot = isWindows ? '.\\' : './';
    let p = path.relative(__dirname, ...args);
    if (p.startsWith('.')) return p;
    else return dot + p;
};
let getImsModules = () => {
    let modulesPath = resolvePath(CONFIG.modulesFolder);
    let moduleEntryFile = CONFIG.moduleEntryFile;
    let folders = fs.readdirSync(modulesPath);
    return folders.reduce((modules, folder) => {
        let existEntryFileInFolder = fs.existsSync(resolvePath(modulesPath, folder, moduleEntryFile));
        if (existEntryFileInFolder) {
            modules.push(folder);
        }
        return modules;
    }, []);
};

const cssLoader = ["style-loader", "css-loader", "postcss-loader"]

const stylLoader = ["style-loader", "css-loader", "stylus-loader", "postcss-loader"]

let WebpackConfig = (env, noWatch) => {
    let entry = getImsModules().reduce((entries, module) => {
        let outputPath = relPath(resolvePath(CONFIG.outputFolder, module));
        let inputPath = relPath(resolvePath(CONFIG.modulesFolder, module, CONFIG.moduleEntryFile));
        entries[outputPath] = inputPath;
        return entries;
    }, {});
    // console.log(entry);
    return {
        node: { __dirname: true, __filename: true },
        entry: entry,
        output: {
            publicPath: '',
            path: path.resolve(__dirname, ''),
            filename: "[name].js"
        },
        module: {
            rules: [{
                test: /\.(js|jsx)$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: "babel-loader",
                    options: {
                        cacheDirectory: true,
                        presets: ["env", "react"],
                    }
                }
            },{
                test: /\.css$/,
                use: cssLoader
            }, {
                test: /\.styl$/,
                use: stylLoader
            }],
        },
        resolve: {
            extensions: ['.js', '.jsx']
        },
        watchOptions: {
            aggregateTimeout: 300,
            poll: 300
        },
        plugins: [
            new ProgressBarPlugin((f => {
                let buildNo = 0;
                return {
                    format: chalk.green.bold('  webpack building :percent'),
                    callback: function() {
                        buildNo += 1;
                    },
                    summary: false,
                    customSummary: function(buildTime) {
                        setTimeout(function() {
                            if (noWatch) return console.log(chalk.green.bold('  all done, closing webpack...'));
                            let stream = process.stderr;
                            stream.write(chalk.green.bold('  webpack build ' + chalk.cyan.bold(buildNo) + ' completed [' + new Date().toLocaleTimeString() + ']\n\n'));
                        }, 0);
                    }
                };
            })()),

            new webpack.optimize.CommonsChunkPlugin({
                name: "commons",
                filename: relPath(resolvePath(CONFIG.outputFolder, 'commons.js')),
                minChunks: (module, count) => {
                    if (!module || !module.resource) return;

                    // nếu require những module ở trong folder common -> gộp vào file
                    if (module.resource.startsWith(resolvePath(CONFIG.modulesFolder, 'common'))) return true;

                    // nếu require vào những module ở trong node_modules -> gộp vào file
                    if ((/node_modules/i).test(module.resource)) return true;
                    
                    // nếu được require ở 3 module trở lên sẽ gộp vào file vendor
                    // if (count >= 3) return true;
                }
            })

        ].concat(env !== 'production' ? [] : [ // production plugins
            new BabelMinifyWebpackPlugin()
        ])
    };
};

module.exports = WebpackConfig;





let start = () => {
    let opts = processArgs(process.argv);

    let compiler = webpack(WebpackConfig(opts.minify && 'production', !opts.watch));
    if (opts.watch) {
        let watching = compiler.watch({}, (err, stats) => console.log(stats.toString({ colors: true })));

        let currentModules = getImsModules();
        let timeout1;
        fs.watch(resolvePath(CONFIG.modulesFolder), function onFolderActivity(eventType, fileName) {
            clearTimeout(timeout1);
            timeout1 = setTimeout(() => {
                let newModules = getImsModules();
                if (JSON.stringify(currentModules) !== JSON.stringify(newModules)) {
                    currentModules = newModules;
                    restartWatch();
                }
            }, 100);
        });

        let restartWatch = () => {
            watching.close(() => {
                compiler = webpack(WebpackConfig(opts.minify && 'production'));
                watching = compiler.watch({}, (err, stats) => console.log(stats.toString({ colors: true })));
            });
        };
    } else {
        compiler.run((err, stats) => console.log(stats.toString({ colors: true })));
    }
};

let processArgs = args => {
    return program
        // .version('0.01', '-v, --version')
        .option('-w, --watch', 'watch files')
        .option('-m, --minify', 'minify code')
        .parse(args);
};

let runFromCommandLine = !module.parent;
if (runFromCommandLine) start();
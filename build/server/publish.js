const fs = require("fs");
const path = require("path");
const webpack = require("webpack");
const uglify = require('uglifyjs-webpack-plugin');
const pug = require("pug");
const zipFolder = require("zip-folder");
const mkdirp = require("mkdirp");

function publish(project, app) {

    let date = getDateString();
    let timestamp = Math.floor(Date.now() / 1000);
    let folder = date + "-" + project + "-" + app + "-" + timestamp;
    let target = path.join("../publish", folder); 

    let srcDir = mkdir(target, "src");
    let publicDir = mkdir(target, "public");
    let targetDir = path.join(__dirname, target);

    let sourceWatcher = new SourceWatcher();

    let process = compile(sourceWatcher, project, app, publicDir)
        .then(bundleSources(sourceWatcher, srcDir))
        .then(generateHtml(project, app, publicDir))
        .then(zipBundle(targetDir))
        .then(() => console.info("Done!"));
}

function zipBundle(directory) {
    return function() {
        return new Promise((resolve, reject) => {
            zipFolder(directory, `${directory}.zip`, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
}

function getDateString() {
    let date = new Date();
    let y = date.getFullYear();
    let m = pad(date.getMonth(), 2);
    let d = pad(date.getDate(), 2);
    return `${y}-${m}-${d}`;
}

/**
 * Pad function source: https://stackoverflow.com/questions/10073699/pad-a-number-with-leading-zeros-in-javascript
 */
function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function mkdir(...folders) {
    let dir = __dirname;
    for (let piece of folders) {
        dir = path.join(dir, piece);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
    }
    return dir;
}

function generateHtml(project, app, dir) {
    return function() {
        return new Promise((resolve, reject) => {
            let template = pug.compileFile(path.resolve(__dirname, "views", "publishApp.pug"));
            let props = {
                pageTitle: app + " (" + project + ")",
                script: "./app.js",
                style: "./app.css"
            };
            let html = template(props);

            let outputFile = path.join(dir, "index.html");
            fs.writeFile(outputFile, html, () => {
                resolve();
            }); 
        })
    };
}

function bundleSources(sourceWatcher, srcDir) {
    let projectSrc = path.join(__dirname, "../../src");
    return function() {
        return new Promise((resolve, reject) => {
            let promises = [];
            for (let source of sourceWatcher.sources.values()) {
                let target = path.join(srcDir, source.replace(projectSrc, ""));
                mkdirp.sync(path.dirname(target));
                promises.push(new Promise( (resolve, reject) => {
                    let inputPath = path.join(source);
                    let inputStream = fs.createReadStream(inputPath);
                    let outputPath = target;
                    let outputStream = fs.createWriteStream(outputPath);
                    inputStream.pipe(outputStream).on("finish", resolve);
                }));
            }
            Promise.all(promises).then(() => resolve());
        });
    }
}

function compile(sourceWatcher, project, app, dir) {
    return new Promise((resolve, reject) => {
        let webpacker = webpack(webpackConfig(sourceWatcher, project, app, dir));
        webpacker.run((err, stats) => {
            if (err) {
                reject(err);
            } else if (stats.hasErrors()) {
                reject(stats.toString());
            } else {
                resolve();
            }
        });
    });
}

class SourceWatcher {
    constructor() {
        this.sources = new Set();
    }

    apply(compiler) {
        compiler.plugin("compilation", (compilation) => {
            compilation.plugin("after-optimize-module-ids", (modules) => {
                let srcDir = path.join(__dirname, "../../src");
                modules
                    .filter((module) => module.resource && module.resource.replace("\\\\","\\").indexOf(srcDir) > -1 )
                    .map( (module) => path.format(path.parse(module.resource)) )
                    .forEach( (module) => this.sources.add(module) );
            });
        });
    }
}

function webpackConfig(sourceWatcher, project, app, dir) {
    const ExtractTextPlugin = require("extract-text-webpack-plugin");
    const extract = new ExtractTextPlugin("app.css");
    return {
        context: path.join(__dirname, "../../src/"),
        entry: path.join(__dirname, "../../src", project, app + "-app.ts"),
        resolve: {
            extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
        },
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: ExtractTextPlugin.extract({
                        fallback: "style-loader",
                        use: "css-loader"
                    })
                },
                {
                    test: /\.tsx?$/,
                    loader: "ts-loader",
                    exclude: /node_modules/,
                    options: {
                        logLevel: "warning",
                        configFileName: "tsconfig.json"
                    }
                }
            ]
        },
        output: {
            filename: "app.js",
            path: dir
        },
        plugins: [
           extract,
           new uglify(),
           sourceWatcher
        ],
        stats: "errors-only"
    };
}

publish("demo", "prompt");
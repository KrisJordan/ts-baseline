const path = require("path");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    devServer: {
        contentBase: path.join(__dirname, "../public"),
        publicPath: "/dist/",
        inline: true,
        overlay: true
    },
    context: path.resolve(__dirname, "./"),
    entry: () => {
        return {
            hi: ["../lecture00/src/hello.ts"], 
            bye: ["../lecture00/src/bye.js"]
        }
    },
    resolve: {
        extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },
    module: {
        loaders: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                options: {
                    logLevel: "error"
                }
            }
        ]
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "../public/dist")
    },
    plugins: [
        new UglifyJSPlugin()
    ],
    stats: "errors-only"
};
const path = require("path");

module.exports = {
    entry: ["./src/index.tsx"],
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js",
        publicPath: "/output"
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                exclude: /node_modules/
            }
        ]
    },
    devServer: {
        contentBase: "./wwwroot",
        publicPath: "/output",
        hot: true,
        headers: {
            "Access-Control-Allow-Origin": "*"
        },
        historyApiFallback: true,
        index: "index.html"
    },
    mode: "development"
}
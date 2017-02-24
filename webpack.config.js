module.exports = {
    entry: "./dist/frontend/app.js",
    output: {
        path: __dirname + "/dist/public",
        filename: "bundle.js"
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: "babel-loader"
            }
        ]
    }
}
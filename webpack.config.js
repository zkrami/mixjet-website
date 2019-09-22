var webpack = require('webpack');
var path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const devMode = true ; 
module.exports = {
    entry: {
        entry: __dirname + '/entry.js',
        test: __dirname + '/test.js',
        canvas: __dirname + '/canvas.js',
        style: __dirname + '/assets/sass/test.scss'
    },
    output: {
        path: path.resolve(__dirname, 'assets'),
        filename: 'js/[name].bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.scss$/i,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: true
                        },
                    },
                    'css-loader',
                    'sass-loader',
                ],
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: devMode ? '[name].css' : '[name].[hash].css',
            chunkFilename: devMode ? '[id].css' : '[id].[hash].css',

        })
    ]
}
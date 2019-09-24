var webpack = require('webpack');
var path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin')
require("css-loader");

var isDev = process.env.NODE_ENV === 'dev' // true or false

let devCss = ['style-loader', 'css-loader', 'sass-loader'];
let prodCss = [
    {
        loader: MiniCssExtractPlugin.loader,
        options: {
            publicPath: './',

        },
    },
    'css-loader', 'sass-loader',
];

var cssConfig = isDev ? devCss : prodCss

module.exports = {
    entry: {
        entry: __dirname + '/assets/js/entry.js',
        style: __dirname + '/assets/sass/index.scss',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.scss$/i,
                use: cssConfig,
            },
            {
                test: /\.(jpe?g|png|gif|otf|woff|woff2|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 8192
                    }
                }
            }

        ],
    },
    devServer: {
        contentBase: path.join(__dirname),
        compress: true,
        hot: true,
        open: true
    },
    plugins: [

        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: '[name].css',
            chunkFilename: '[id].css',
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        new HtmlWebpackPlugin({
            title: 'Project Demo',
            hash: true,
            template: './index.html',
            filename: './index.html'
        })
    ]
}
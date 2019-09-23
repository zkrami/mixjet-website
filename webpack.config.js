var webpack = require('webpack');
var path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin')

const devMode = false;


let devCss = [];
let prodCss = [
    {
        loader: MiniCssExtractPlugin.loader,
        options: {
            publicPath: './',

        },
    },
     'css-loader', 'sass-loader',
]
module.exports = {
    entry: {
        entry: __dirname + '/entry.js',
        style: __dirname + '/assets/sass/index.scss',
    },
    output: {
        path: path.resolve(__dirname, 'assets'),
        filename: 'js/[name].bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.scss$/i,
                use: prodCss,
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
        hot: false,
        open: true
    },
    plugins: [

        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: '[name].css',
            chunkFilename: '[id].css',
        }),
        /*  new webpack.HotModuleReplacementPlugin(),
          new webpack.NamedModulesPlugin(),
          new HtmlWebpackPlugin({
              title: 'Project Demo',
              hash: true,
              template: './index2.html',
              filename: './dist.html'
          })*/
    ]
}
var webpack = require('webpack');
var path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin')
var isDev = process.env.NODE_ENV !== 'production' // true or false
let devCss = ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'];
let prodCss = [
    {
        loader: MiniCssExtractPlugin.loader,
        options: {
            publicPath: '../../',

        },
    },
    'css-loader', 'postcss-loader', 'sass-loader',
];

var cssConfig = isDev ? devCss : prodCss

module.exports = {
    entry: {
        entry: __dirname + '/assets/js/entry.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.(scss|css)$/i,
                use: cssConfig,
            },
            {
                // HTML LOADER
                test: /\.html$/,
                use: {
                    loader: 'html-loader',
                    options: {
                        interpolate: true,
                        attrs: ['img:src' , 'source:src' ,'image:xlink:href'],

                    }
                }
            },
            {
                test: /\.(jpe?g|mp3|png|gif|otf|woff|woff2|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
                use: {
                    loader: 'url-loader',

                    options: {
                        limit: 8192,
                        fallback: {
                            loader: 'file-loader',
                            options: {
                                name: '[path][name].[ext]',
                            },
                        }
                    }
                }
            }

        ],
    },
    devServer: {
        contentBase: path.join(__dirname),
        compress: false,
        hot: true,
        open: false,
        host: "0.0.0.0"
    },
    plugins: [

        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: 'assets/css/[name].css',
            chunkFilename: '[id].css',
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        new HtmlWebpackPlugin({
            template: './index.html',
            filename: './dist.html'
        }),
        new HtmlWebpackPlugin({
            template: './temp.html',
            filename: './temp.html'
        })
    ]
}
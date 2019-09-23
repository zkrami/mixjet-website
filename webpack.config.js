var webpack = require('webpack');
var path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin')

const devMode = true;
module.exports = {
    entry: {
         entry: __dirname + '/entry.js',
        style: __dirname + '/style.js',
    },
    output: {
        path: path.resolve(__dirname, 'assets'),
        filename: 'js/[name].bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.scss$/i,
                use: ['style-loader', 'css-loader', 'sass-loader'],
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

    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new HtmlWebpackPlugin({
        title: 'Project Demo',
        hash: true,
        template: './index2.html',
        filename: './dist.html'
    })
]
}
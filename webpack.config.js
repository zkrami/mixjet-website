var webpack = require('webpack');
var path = require("path"); 
module.exports = {
    entry: {
        entry: __dirname + '/entry.js' , 
        test: __dirname + '/test.js'
    },
    output: {
        path: path.resolve(__dirname, 'assets'),
        filename: 'js/[name].bundle.js' , 
    },
    module: {

    },

}
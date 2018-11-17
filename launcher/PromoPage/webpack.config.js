const webpack = require('webpack');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const FlowWebpackPlugin = require('flow-webpack-plugin')

const config = {
    entry: "./src/index.js",

    output: {
        filename: "bundle.js",
        path: __dirname + "/build",
        publicPath: './'
    },

    module: {
        loaders: [
            {
                test: /\.(js|jsx)?(\.erb)?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015', 'stage-0', 'stage-2', ['env', {modules: false}], 'babel-polyfill'],
                    plugins: ["babel-plugin-transform-class-properties"]
                }
            },
            { test: /\.gif$/, loader: 'url-loader?limit=10000&mimetype=image/gif' },
            { test: /\.jpg$/, loader: 'url-loader?limit=10000&mimetype=image/jpg' },
            { test: /\.png$/, loader: 'url-loader?limit=10000&mimetype=image/png' },
            { test: /\.svg/, loader: 'url-loader?limit=26000&mimetype=image/svg+xml' },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            },
            { test: /\.ttf/, use: [{ loader: 'file-loader' }] },
        ],
    },
    plugins: [
        // new FlowWebpackPlugin(),
        new ExtractTextPlugin("styles.css"),
        new HtmlWebpackPlugin({
            template: './public/index.html',
            filename: 'index.html',
            inject: 'body'
        }),
        new webpack.optimize.ModuleConcatenationPlugin({
            compress: {
              warnings: false,
              screw_ie8: true,
              conditionals: true,
              unused: true,
              comparisons: true,
              sequences: true,
              dead_code: true,
              evaluate: true,
              if_return: true,
              join_vars: true
            },
            output: {
              comments: false
            }
        }),
        new webpack.HashedModuleIdsPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.optimize.AggressiveMergingPlugin(),
    ]
};

module.exports = config;

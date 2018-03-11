const webpack = require('webpack');
const path = require('path');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');
const CompressionPlugin = require("compression-webpack-plugin");

const isProductionBuild = process.env.NODE_ENV === 'production';

const loaders = [
    {
        exclude: /node_modules/,
        test: /\.js/,
        loader: 'babel-loader',
        query: {
            cacheDirectory: true,
            presets: isProductionBuild
                ? ['react-optimize', 'react', 'env', 'stage-0']
                : ['react', 'env', 'stage-0'],
            plugins: [
                'transform-decorators-legacy',
                ['react-intl', {'messagesDir': __dirname + '/strings/', 'enforceDescriptions' : true}]
            ],
        }
    }, {
        test: /\.scss$/,
        use: isProductionBuild
            ? [{
                loader: "style-loader",
            }, {
                loader: "css-loader",
                options: {
                    modules: true,
                    importLoaders: 1,
                    localIdentName: '[hash:base64:6]',
                    data: '@import "' + path.resolve(__dirname, 'src/common/styles/theme.scss') + '";'
                }
            }, {
                loader: "sass-loader", // compiles Sass to CSS
            }] : [{
                loader: "style-loader",
                options: {
                    sourceMap: true
                }
            }, {
                loader: "css-loader",
                options: {
                    modules: true,
                    importLoaders: 1,
                    localIdentName: '[path]__[local]___[hash:base64:5]'
                }
            }, {
                loader: "sass-loader", // compiles Sass to CSS
            }]
    }, {
        test: /\.css$/,
        use: [
            "style-loader",
            {
                loader: "css-loader",
                options: {
                    modules: true, // default is false
                    sourceMap: true,
                    importLoaders: 1,
                    localIdentName: "[name]--[local]--[hash:base64:8]"
                }
            },
            "postcss-loader"
        ]
    }, {
        test: /\.(png|jpg|jpeg|gif|woff|svg)$/,
        loader: 'url-loader?limit=8192'
    }, {
        test: /\.json$/,
        loader: 'json-loader'
    }, {
        test: /\.html$/,
        loader: 'html-loader'
    }
];

const plugins = [
    new ExtractTextPlugin('styles.css', {
        allChunks: true
    }),
    new FaviconsWebpackPlugin({
        logo: __dirname +'/src/common/img/favicon.png',
        prefix: 'icons/',
        statsFilename: 'iconstats.json',
        title: 'OPENET admin interface',
    }),
    new HtmlWebpackPlugin({
        xhtml: true,
        template: __dirname + '/src/common/index.html'
    }),
];

if (!isProductionBuild){
    //En desarrollo usamos la recarga rapida de componentes de react
    /*loaders.unshift({
        exclude: /node_modules/,
        test: /\.js/,
        loader: 'react-hot-loader/webpack',
    });*/
    loaders.push({
        test: require.resolve("react"),
        loader: 'expose-loader?React'
    })
} else {
    //Antes del empaquetado para produccion eliminamos el contenido de la carpeta dist
    plugins.unshift(new webpack.DefinePlugin({'process.env': {'NODE_ENV': JSON.stringify('production')}}));
    plugins.unshift(new WebpackCleanupPlugin({}));
    plugins.push(new CompressionPlugin({
        asset: "[path].gz[query]",
        algorithm: "gzip",
        minRatio: 0.5
    }))
}

module.exports = {
    cache: true,
    entry:{
        javascript: __dirname + '/src/common/index.js',
    },
    output: {
        filename: 'app.js',
        path: __dirname + '/dist',
        publicPath: '/',
    },
    devtool: isProductionBuild ? false : 'source-map',

    module: {
        rules: loaders,
    },
    plugins: plugins,
};

/*
* const webpack = require('webpack');
const path = require('path');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');
const CompressionPlugin = require("compression-webpack-plugin");
const CssNext = require('postcss-cssnext');

const isProductionBuild = process.env.NODE_ENV === 'production';

var loaders = [
    {
        exclude: /node_modules/,
        test: /\.js/,
        loader: 'babel-loader',
        query: {
            cacheDirectory: true,
            presets: isProductionBuild
                ? ['react-optimize', 'react', 'env', 'stage-0']
                : ['react', 'env', 'stage-0'],
            plugins: [
                'transform-decorators-legacy',
                ['react-intl', {'messagesDir': __dirname + '/strings/', 'enforceDescriptions' : true}]
            ],
        }
    }, {
        test: /\.scss$/,
        use: isProductionBuild
            ? [{
                loader: "style-loader",
            }, {
                loader: "css-loader",
                options: {
                    modules: true,
                    importLoaders: 1,
                    localIdentName: '[hash:base64:6]',
                    data: '@import "' + path.resolve(__dirname, 'src/common/styles/theme.scss') + '";'
                }
            }, {
                loader: "sass-loader", // compiles Sass to CSS
            }] : [{
                loader: "style-loader",
                options: {
                    sourceMap: true
                }
            }, {
                loader: "css-loader",
                options: {
                    modules: true,
                    importLoaders: 1,
                    localIdentName: '[path]__[local]___[hash:base64:5]'
                }
            }, {
                loader: "sass-loader", // compiles Sass to CSS
            }]
    }, {
        test: /\.css$/,
        use: [
            "style-loader",
            {
                loader: "css-loader",
                options: {
                    modules: true, // default is false
                    sourceMap: true,
                    importLoaders: 1,
                    localIdentName: "[name]--[local]--[hash:base64:8]"
                }
            },
            "postcss-loader"
        ]
    }, {
        test: /\.(png|jpg|jpeg|gif|woff|svg)$/,
        loader: 'url-loader?limit=8192'
    }, {
        test: /\.json$/,
        loader: 'json-loader'
    }, {
        test: /\.html$/,
        loader: 'html-loader'
    }
];

var plugins = [
    new ExtractTextPlugin('styles.css', {
        allChunks: true
    }),
    new FaviconsWebpackPlugin({
        logo: __dirname +'/src/common/img/favicon.png',
        prefix: 'icons/',
        statsFilename: 'iconstats.json',
        title: 'OPENET admin interface',
    }),
    new HtmlWebpackPlugin({
        xhtml: true,
        template: __dirname + '/src/common/index.html'
    }),
];

if (!isProductionBuild){
    //En desarrollo usamos la recarga rapida de componentes de react
    loaders.unshift({
        exclude: /node_modules/,
        test: /\.js/,
        loader: 'react-hot-loader/webpack',
    });
loaders.push({
    test: require.resolve("react"),
    loader: 'expose-loader?React'
})
} else {
    //Antes del empaquetado para produccion eliminamos el contenido de la carpeta dist
    plugins.unshift(new webpack.DefinePlugin({'process.env': {'NODE_ENV': JSON.stringify('production')}}))
    plugins.unshift(new WebpackCleanupPlugin({}))
    plugins.push(new CompressionPlugin({
        asset: "[path].gz[query]",
        algorithm: "gzip",
        minRatio: 0.5
    }))
}

module.exports = {
    cache: true,
    entry:{
        javascript: __dirname + '/src/common/index.js',
    },
    output: {
        filename: 'app.js',
        path: __dirname + '/dist',
        publicPath: '/',
    },
    devtool: isProductionBuild ? false : 'source-map',

    module: {
        rules: loaders,
    },
    plugins: plugins,
};*/
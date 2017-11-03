const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const glob = require('glob');


const { ROOT_PATH, DEVELOPMENT_IP, DEVELOPMENT_PORT, RELEASE_PATH } = require('./config');
const SOURCE = 'src';
const DEVELOPMENT = 'development';
const PRODUCTION = 'production';
const ENTRIES_FOLDER = 'entries';
const HTML_FOLDER = 'templates';
const COMMON_CHUNK_NAME = 'common';
const SOURCE_PATH = path.resolve(ROOT_PATH, SOURCE);
const NODE_ENV = process.env.NODE_ENV || PRODUCTION;

//rules
const jsRule = {
    test: /\.js$/,
    exclude: /node_modules/,
    use: [
        'babel-loader',
    ],
};
const cssRule = {
    test: /\.css$/,
    use: [
        'style-loader',
        'css-loader',
    ],
};
const lessRule = {
    test: /\.less$/,
    use: [
        'style-loader',
        'css-loader',
        'less-loader',
    ],
};

const fileRule = {
    test: /\.(png|jpg|gif)$/,
    use: [
        {
            loader: 'url-loader',
            options: {
                limit: 8192,
                name: 'images/[name]-[hash].[ext]',
            },
        },
    ],
};
//entry
let devtool = 'source-map';
let plugins = [];
let entries = getEntries();//obj格式的入口
const htmlPlugins = Object.keys(entries).map((key) => {
    const entry = entries[key];
    const htmlPath = entry.replace(`${ENTRIES_FOLDER}/${key}.js`, `${HTML_FOLDER}/${key}.html`);
    const filename = path.basename(htmlPath);
    return new HtmlWebpackPlugin({
        template: htmlPath,
        filename,
        chunks: [
            COMMON_CHUNK_NAME,
            key,
        ],
    })
});
//diff config
switch (NODE_ENV) {
    case DEVELOPMENT:
        entries = addDevToEntry(entries);
        devtool = 'eval';
        plugins = [
            ...htmlPlugins,
            new webpack.HotModuleReplacementPlugin(),
        ];
        // support react-hot-loader@3, @see https://github.com/gaearon/react-hot-loader/tree/next-docs
        jsRule.use.push('react-hot-loader/webpack');
        break;

    default:
        plugins = [
            ...htmlPlugins,
            new webpack.optimize.UglifyJsPlugin({
                sourceMap: true,
            })
        ];
        break;

}
module.exports = {
    entry: entries,
    output: {
        path: path.resolve(ROOT_PATH, RELEASE_PATH),
        filename: 'js/[name].js',
        publicPath: './',
    },
    module: {
        rules: [
            jsRule,
            cssRule,
            lessRule,
            fileRule
        ],
    },
    plugins: [
        ...plugins,
        new webpack.EnvironmentPlugin([
            'NODE_ENV',
        ]),
        new webpack.optimize.CommonsChunkPlugin({
            names: [COMMON_CHUNK_NAME],
            // pages rests in different folder levels
            filename: 'js/[name].js',
            minChunks: 2, // Infinity
        })
    ],
    devtool
};

/*
* util func
* */


function getEntries() {
    const entries = {};
    const entryFilesPath = glob.sync(`${path.join(SOURCE_PATH, ENTRIES_FOLDER)}/*.js`);
    const entryFiles = entryFilesPath.map((entryPath) => {
        return path.basename(entryPath, '.js');
    });
    entryFiles.forEach((entryFile) => {
        entries[entryFile] = path.join(SOURCE_PATH, ENTRIES_FOLDER, `${entryFile}.js`);
    });
    return entries;
}

function addDevToEntry(entry) {
    const newEntry = {};
    Object.keys(entry).forEach((entryName) => {
        const ent = entry[entryName];
        newEntry[entryName] = [
            `webpack-dev-server/client?http://${DEVELOPMENT_IP}:${DEVELOPMENT_PORT}`,
            'webpack/hot/only-dev-server',
            // support react-hot-loader@3, @see https://github.com/gaearon/react-hot-loader/tree/next-docs
            'react-hot-loader/patch',
            ent,
        ];
    });
    return newEntry;
}

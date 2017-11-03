const open = require('react-dev-utils/openBrowser');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('../webpack.config');
const fs = require('fs');
const path = require('path');

const {RELEASE_PATH, MOCK_SERVER_BASE, DEVELOPMENT_PORT, DEVELOPMENT_IP} = require('../config');
const compiler = webpack(webpackConfig);
fs.writeFile(path.resolve(__dirname,'config.json'),JSON.stringify(webpackConfig))
let opened = false;

const devServerOptions = {
    contentBase: [
        RELEASE_PATH,
        MOCK_SERVER_BASE,
    ],
    hot: true,
    historyApiFallback: true,
    stats: {
        colors: true,
    },
};

const server = new WebpackDevServer(compiler, devServerOptions);

const openBrowser = () => {
    const address = server.listeningApp.address();
    const url = `http://${address.address}:${address.port}`;
    console.log(`server started: ${url}`);
    open(`${url}/index.html`);
};

compiler.plugin('done', () => {
    if (!opened) {
        opened = true;
        openBrowser();
    }
});

server.listen(DEVELOPMENT_PORT, DEVELOPMENT_IP, (err) => {
    if (err) {
        console.log(err);
    }
});

const stdIn = process.stdin;
stdIn.setEncoding('utf8');
stdIn.on('data', openBrowser);
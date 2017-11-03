/**
 * @since 2017-11-03 20:27
 * @author jq.yao
 */
import webpack from 'webpack';
import webpackConfig from '../webpack.config';

const compiler = webpack(webpackConfig);

compiler.run((err) => {
    if (err) {
        console.error(err);
    }
});
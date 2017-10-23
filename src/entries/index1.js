//import 'babel-polyfill';
import render from '../utils/render';

//render();
if (module.hot) {
    module.hot.accept('../containers/index', () => {
        const newPage = require('../containers/index').default;
        newPage();
    });
}
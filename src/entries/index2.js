import render from '../utils/render';
import App from '../containers/index';

render(App);

if (module.hot) {
    module.hot.accept('../containers/index', () => {
        const newPage = require('../containers/index').default;
        newPage();
    });
}
import render from '../utils/render';
import App from '../containers/index';

render(App);

if (module.hot) {
    module.hot.accept('../containers/index', () => {
        render(require('../containers/index').default);
    });
}
import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';

module.exports = () => {
    return render(
        <AppContainer>
            <div>111</div>
        </AppContainer>,
        document.querySelector('#app')
    )
}
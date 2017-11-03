import React from 'react';
import { render } from 'react-dom';

module.exports = (Cmp) => {
    return render(
        <Cmp />,
        document.querySelector('#app')
    )
}
import React from 'react';

function Text(props) {
    return (
        <p className={`${props.className || ''}`}>{ props.children }</p>
    );
}

export default Text;

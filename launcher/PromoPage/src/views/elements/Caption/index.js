import React from 'react';

function Caption(props) {
    return (
        <p className={`caption ${props.className || ''}`}>
          { props.children }
        </p>
    );
}

export default Caption;
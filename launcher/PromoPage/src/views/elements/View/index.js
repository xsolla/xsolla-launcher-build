import React from 'react';

function View(props) {
    return (
        <div style={props.style} className={`view ${props.className || ''}`} onClick={ props.onClick }>
          { props.children }
        </div>
    );
}

export default View;
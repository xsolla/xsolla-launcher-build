import React from 'react';
import View from '../View';

function ArrowButton(props) {
    const arrow = props.big ?
        require('../../../imgs/icons/leftpad_big.svg') :
        require('../../../imgs/icons/leftpad.svg');
    let className = `arrow_btn ${props.big ? 'arrow_btn__big' : ''} ${props.className || ''}`;

    if (props.disabled) {
        className = `arrow_btn__disabled ${props.big ? 'arrow_btn__big' : ''} ${props.className || ''}`;
    }

    return (
        <View onClick={ props.disabled ? () => {} : props.onClick } className={ className }>
            <img
                className={`arrow_btn__arrow ${props.right ? 'arrow_btn__right' : ''}`}
                src={arrow}
                alt="arrow"
            />
        </View>
    );
}

export default ArrowButton;
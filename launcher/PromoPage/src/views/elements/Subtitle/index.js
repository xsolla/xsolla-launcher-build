import React from 'react';
import View from '../View';

function Subtitle(props) {
    let element = (
        <h2 onClick={ props.onClick } className={`subtitle ${props.className || ''}`}>{ props.children }</h2>
    );

    if (props.link) {
        element = (
            <a onClick={ props.onClick } className={`subtitle link ${props.className || ''}`}>{ props.children }</a>
        );
    }

    if (props.header) {
        return getHeader(element, props.containerClassName);
    }

    return element;
}

function getHeader(subtitle, containerClassName = '') {
    return (
        <View className={`subtitle_header ${containerClassName}`}>
            { subtitle }
        </View>
    );
}

export default Subtitle;
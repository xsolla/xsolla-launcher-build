import React from 'react';
import View from '../View';

function Title(props) {
    let element = (
        <h1 className={`title ${props.className || ''}`}>{ props.children }</h1>
    );

    if (props.link) {
        element = (
            <a onClick={ props.onClick } className={`title link ${props.className || ''}`}>{ props.children }</a>
        );
    }

    if (props.header) {
        return getHeader(element, props.nav);
    }

    return element
}

function getHeader(title, nav = null) {
    let className = 'title_header';

    if (nav !== null) {
        className += ' title_header__nav';
    }

    return (
        <View className={ className }>
            { title }
            { nav }
        </View>
    );
}

export default Title;
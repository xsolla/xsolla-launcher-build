import React from 'react';
import View from '../View';

function Description(props) {
    return (
        <View className={`${props.point ? 'description-point' : ''}`}>
            {
                props.point &&
                    <View className="point" />
            }
            <p className={`description ${props.className || ''}`}>
                { props.children }
            </p>
        </View>
    );
}

export default Description;
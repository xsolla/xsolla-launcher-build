import React from 'react';
import View from '../View';

function Tag(props) {
    return (
        <View className="tag">
          { props.children }
        </View>
    );
}

export default Tag;
import React from 'react';
import View from '../View';

function TimeLabel(props) {
    return (
        <View className="view">
          { props.children }
        </View>
    );
}

export default TimeLabel;
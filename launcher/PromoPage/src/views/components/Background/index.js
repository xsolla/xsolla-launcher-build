import React from 'react';
import './index.css';
import {
  View
} from '../../elements';

function BG(props) {
  return (
      <View className="bg">
        {/* <View className="bg-img">
          <View className={`bg-gradient ${props.full ? 'bg-gradient-full' : ''}`} />
        </View> */}
        <View className="bg__content">
          { props.children }
        </View>
      </View>
  );
}

export default BG;
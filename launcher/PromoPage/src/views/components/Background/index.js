import React from 'react';
import './index.css';
import {
  View
} from '../../elements';

function BG(props) {
  return (
      <div className="bg__container">
        <View className="bg">
          { props.children }
        </View>
      </div>
  );
}

export default BG;
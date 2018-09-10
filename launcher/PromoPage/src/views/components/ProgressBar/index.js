import React from 'react';
import './index.css';
import {
  View,
} from '../../elements';

class AllGames extends React.Component {
  constructor(props) {
    super(props);

    this.className = props.className;

    this.state = {
      //
    };
  }

  render() {
    return (
      <View className={`progress-wraper ${this.className}`}>
        <View className="progress-bar" style={{ width: `${this.props.progress}%` }} />
      </View>
    );
  }
}

export default AllGames;

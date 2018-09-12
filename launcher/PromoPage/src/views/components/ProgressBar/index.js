import React from 'react';
import { connect } from 'react-redux';
import './index.css';
import {
  View,
} from '../../elements';

class ProgressBar extends React.Component {
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
        <View className="progress-bar" style={{ width: `${this.props.curProgress}%` }} />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  curProgress: state.games.curProgress,
});

export default connect(mapStateToProps)(ProgressBar);

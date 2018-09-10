import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import './index.css';

import {
  Background,
  GameDescription,
  GameDetails,
} from '../../components';

import { View, Description } from '../../elements';

import {
  userSomeReq,
} from '../../../actions/users';

class GamePage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      //
    };
  }

  render() {
    return (
      <Background full>
        <View className="game-page">
          <View className="game-page__back_home" onClick={() => { this.props.openPage('Home') }}>
            <img alt="homeback" className="game-page__back_home__arrow" src={require('../../../imgs/icons/orange_left.svg')} />
            <Description className="link">Home</Description>
          </View>
          <GameDescription game={ this.props.game } openPage={ this.props.openPage } />
          <GameDetails
            game={ this.props.game }
            openPage={ this.props.openPage }
            curGame={{
              id: this.props.curGameId,
              status: this.props.curGameStatus,
              progress: this.props.curProgress,
            }}
          />
        </View>
      </Background>
    );
  }
}

const mapStateToProps = state => ({
    game: state.games.selectedGame,
    curGameId: state.games.curGameInLauncher,
    curProgress: state.games.curProgress,
    curGameStatus: state.games.curGameStatus,
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    userSomeReq,
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(GamePage);

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import './index.css';
import { text } from '../../../langs';

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
          <View
            className={`game-page__back_home${this.props.pageDirection === 'ltr' ? '' : '__rtl'}`}
            onClick={() => { this.props.openPage('Home') }}
          >
            {
              this.props.pageDirection !== 'ltr' &&
                <Description className="link">{ text('GAME_PAGE.BACK_HOME') }</Description>
            }
            <img
              alt="homeback"
              className={`game-page__back_home__arrow${this.props.pageDirection === 'ltr' ? '' : '__rtl'}`}
              src={require('../../../imgs/icons/orange_left.svg')} />
            {
              this.props.pageDirection === 'ltr' &&
                <Description className="link">{ text('GAME_PAGE.BACK_HOME') }</Description>
            }
          </View>
          {
            this.props.pageDirection === 'ltr' &&
              <GameDescription
                pageDirection={ this.props.pageDirection }
                game={ this.props.game }
                openPage={ this.props.openPage }
              />
          }
          <GameDetails
            game={ this.props.game }
            openPage={ this.props.openPage }
            curGame={{
              id: this.props.curGameId,
              status: this.props.curGameStatus,
            }}
            pageDirection={ this.props.pageDirection }
          />
          {
            this.props.pageDirection !== 'ltr' &&
              <GameDescription
                pageDirection={ this.props.pageDirection }
                game={ this.props.game }
                openPage={ this.props.openPage }
              />
          }
        </View>
      </Background>
    );
  }
}

const mapStateToProps = state => ({
    game: state.games.selectedGame,
    curGameId: state.games.curGameInLauncher,
    curGameStatus: state.games.curGameStatus,
    pageDirection: state.pages.direction,
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    userSomeReq,
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(GamePage);

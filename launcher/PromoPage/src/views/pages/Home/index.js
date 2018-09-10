import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import './index.css';

import {
  Background,
  FeatucheringViewPager,
  LastUpdates,
  AllGames,
} from '../../components';
import { View } from '../../elements';

class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      //
    };
  }

  selectGame = game => {
    this.props.gamesSelectGameReq(game);
  }

  render() {
    return (
      <Background>
        <View className="home">
          <img className="home__logo" src={ require('../../../imgs/logo.svg') } alt="logo" />
          {
            Boolean(this.props.games.length) &&
              <FeatucheringViewPager
                openPage={ this.props.openPage }
                selectGame={ this.selectGame }
                className="home__featured-pager"
                games={this.props.games}
                curGame={{
                  id: this.props.curGameId,
                  status: this.props.curGameStatus,
                  progress: this.props.curProgress,
                }}
              />
          }
          {
            Boolean(this.props.news.length) &&
              <LastUpdates
                openPage={ this.props.openPage }
                className="home__last-update"
                news={this.props.news}
              />
          }
          {
            Boolean(this.props.games.length) &&
              <AllGames
                openPage={ this.props.openPage }
                selectGame={ this.selectGame }
                className="home__all-games"
                games={this.props.games}
                curGame={{
                  id: this.props.curGameId,
                  status: this.props.curGameStatus,
                  progress: this.props.curProgress,
                }}
              />
          }
        </View>
      </Background>
    );
  }
}

const mapStateToProps = state => ({
    games: state.games.list,
    news: state.news.list,
    curGameId: state.games.curGameInLauncher,
    curProgress: state.games.curProgress,
    curGameStatus: state.games.curGameStatus,
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    //
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import './index.css';

import {
  Background,
  FeatucheringViewPager,
  LastUpdates,
  AllGames,
  NewGames,
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
          <View style={{ flexDirection: 'row' }}>
            <img
              className="home__logo"
              src={ window.publisher_logo || '' }
              alt="logo"
            />
          </View>
          
          {
            Boolean(this.props.featureGames.length) &&
              <FeatucheringViewPager
                openPage={ this.props.openPage }
                selectGame={ this.selectGame }
                className="home__featured-pager"
                games={this.props.featureGames}
                curGame={{
                  id: this.props.curGameId,
                  status: this.props.curGameStatus,
                }}
                pageDirection={ this.props.pageDirection }
              />
          }
          {
            Boolean(this.props.news.length) &&
              <LastUpdates
                openPage={ this.props.openPage }
                className="home__last-update"
                news={this.props.news}
                pageDirection={ this.props.pageDirection }
              />
          }
          {
            Boolean(this.props.newGames.length) &&
              <NewGames
                openPage={ this.props.openPage }
                selectGame={ this.selectGame }
                className="home__all-games"
                games={this.props.newGames}
                curGame={{
                  id: this.props.curGameId,
                  status: this.props.curGameStatus,
                }}
                pageDirection={ this.props.pageDirection }
              />
          }
          {
            Boolean(this.props.allGame.length) &&
              <AllGames
                openPage={ this.props.openPage }
                selectGame={ this.selectGame }
                className="home__all-games"
                games={this.props.allGame}
                curGame={{
                  id: this.props.curGameId,
                  status: this.props.curGameStatus,
                }}
                pageDirection={ this.props.pageDirection }
              />
          }
        </View>
      </Background>
    );
  }
}

const mapStateToProps = state => ({
    allGame: state.games.list,
    newGames: state.games.newGames,
    featureGames: state.games.featureGames,
    news: state.news.list,
    curGameId: state.games.curGameInLauncher,
    curGameStatus: state.games.curGameStatus,
    pageDirection: state.pages.direction,
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    //
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);

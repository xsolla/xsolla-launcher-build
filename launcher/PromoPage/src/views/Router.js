import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Home from './pages/Home';
import Game from './pages/GamePage';
import { initConnectionFunc } from '../ws';
import { pageSetCurPageReq, pageSetLangReq } from '../actions/pages';
import {
  gamesSetListReq,
  gamesSelectGameReq,
  gamesSetCurLauncherGameReq,
  gamesSetCurProgressGameReq,
  gamesSetCurStatusGameReq,
} from '../actions/games';
import { newsSetListReq } from '../actions/news';

class Router extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      //
    };
  }

  componentWillMount() {
    initConnectionFunc({
      onSuccess: ({ games, news }) => {
        this.props.gamesSetListReq(games);
        this.props.newsSetListReq(news);
      },
      onChangeGames: games => {
        this.props.gamesSetListReq(games);
      },
      onChangeNews: news => {
        this.props.newsSetListReq(news);
      },
      initCurrentGame: id => {
        this.props.gamesSetCurLauncherGameReq(id);
      },
      initCurrentProgress: progress => {
        this.props.gamesSetCurProgressGameReq(progress);
      },
      initCurGameStatus: status => {
        this.props.gamesSetCurStatusGameReq(status);
      },
      onChangeLang: lang => {
        this.props.pageSetLangReq(lang);
      },
      onError: () => {},
    });
  }

  openPage = page => {
    this.props.pageSetCurPageReq(page);
  }

  render() {
    if (this.props.curPage === 'Home') {
      return (<Home {...this.props} openPage={ this.openPage } />);
    }

    if (this.props.curPage === 'Game') {
      return (<Game {...this.props} openPage={ this.openPage } />);
    }

    return null;
  }
}

const mapStateToProps = state => ({
  curPage: state.pages.curPage,
  lang: state.pages.lang,
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    pageSetCurPageReq,
    gamesSetListReq,
    newsSetListReq,
    gamesSelectGameReq,
    gamesSetCurLauncherGameReq,
    gamesSetCurProgressGameReq,
    gamesSetCurStatusGameReq,
    pageSetLangReq,
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Router);

import React from 'react';
import './index.css';
import ProgressBar from '../ProgressBar';
import {
  View,
  Text,
  Title,
  Description,
  Button,
  ArrowButton,
} from '../../elements';

const uuidv4 = require('uuid/v4');
const autoShowTime = 5 * 1000;
let autoShowInterval = null;

class FeatucheringViewPager extends React.Component {
  constructor(props) {
    super(props);

    this.className = props.className;
    this.autoShow = true;

    this.state = {
      pagerPage: 0,
    };
  }

  componentWillMount() {
    autoShowInterval = setInterval(() => {
      if (this.autoShow) {
        this.turnRight();
      }
    }, autoShowTime);
  }

  componentWillUnmount() {
    clearInterval(autoShowInterval);
  }

  turnLeft = () => {
    const curPage = this.state.pagerPage;

    if (curPage > 0) {
      this.setState({pagerPage: curPage - 1});
    } else if (curPage === 0) {
      this.setState({pagerPage: this.props.games.slice(0, 5).length - 1});
    }

    clearInterval(autoShowInterval);
  }

  turnRight = (userClick = false) => {
    const curPage = this.state.pagerPage;

    if (curPage < this.props.games.slice(0, 5).length - 1) {
      this.setState({pagerPage: curPage + 1});
    } else {
      this.setState({pagerPage: 0});
    }

    if (userClick) {
      clearInterval(autoShowInterval);
    }
  }

  openGame = game => () => {
    if (game.hasUserGame) {
      window.openGame(game.id);
    } else {
      this.props.selectGame(game);
    }
  }

  onClickBtn = (game, action) => () => {
    switch(action) {
      case 'buy': {
        window.buyGame(game.id);
        break;
      }
      case 'install': {
        window.installGame(game.id);
        break;
      }
      case 'launch': {
        window.launchGame(game.id);
        break;
      }
      case 'redeem': {
        window.redeemKeyByGameID(game.id);
        break;
      }
      default: {
        
      }
    }
  }

  render() {
    return (
      <View className={`fe-pager ${this.className}`}>
        <ArrowButton big className="fe-pager__arrow-left" onClick={ this.turnLeft }/>
        <View className="fe-pager__lenta" style={{ left: `-${this.state.pagerPage * 100}%` }}>
          { this.props.games.slice(0, 5).map(g => this.renderGame(g)) }
        </View>
        <ArrowButton big right className="fe-pager__arrow-right" onClick={ () => this.turnRight(true) }/>
      </View>
    );
  }

  renderGame(game) {
    const { curGame } = this.props;
    const install = curGame.status === 'INSTALLING' || curGame.status === 'PAUSED';
    const installProccess = curGame.id === game.id && install;

    return (
      <View className="fe-pager__game" key={uuidv4()}>
        <img onClick={ this.openGame(game) } className="fe-pager__image" src={ game.gameIcon } alt={uuidv4()}/>
        <View className="fe-pager__info-wraper">
          <Text>Featured game</Text>
          <Title
            link
            className="fe-pager__info-wraper__title"
            onClick={ this.openGame(game) }
          >
            { game.name }
          </Title>
          <Description>
            { this.renderGameDescription(game.description) }
          </Description>
          {
             installProccess &&
              <ProgressBar className="fe-pager__progress-bar" progress={curGame.progress} />
          }
          { this.renderBtn(game, installProccess, curGame.status, install) }
        </View>
      </View>
    );
  }

  renderGameDescription(text) {
    if (text.length > 203) {
      let newText = text.slice(0, 200).split(' ');
      newText = newText.slice(0, newText.length - 1).join(' ');

      return newText + ' ...';
    }

    return text;
  }

  renderBtn(game, installProccess, status, install) {
    if (installProccess) {
      if (status === 'INSTALLING') {
        return <Text className="fe-pager__status">Installing...</Text>;
      }
      return <Text className="fe-pager__status">Paused...</Text>;
    }

    if (game.hasUserGame && game.installed) {
      return (
        <Button
          className="fe-pager__info-wraper__buy-btn"
          onClick={ this.onClickBtn(game, 'launch') }
        >
          Launch
        </Button>
      );
    }

    if (game.hasUserGame && !game.installed) {
      return (
        <Button
          className="fe-pager__info-wraper__buy-btn"
          disabled={ install }
          onClick={ this.onClickBtn(game, 'install') }
        >
          Install
        </Button>
      );
    }

    if (game.buy_option_enabled && !game.key_redeem_enabled) {
      return (
        <Button
          className="fe-pager__info-wraper__buy-btn"
          green
          onClick={ this.onClickBtn(game, 'buy') }
        >
          Buy
        </Button>
      );
    }

    if (game.buy_option_enabled && game.key_redeem_enabled) {
      return (
        <View className="fe-pager__info__btn__wrap">
          <Button
            green
            className="fe-pager__info__btn"
            onClick={ this.onClickBtn(game, 'buy') }
          >
            Buy
          </Button>
          <Button
            redeem
            small
            toolpitClassName="fe-pager__info__btn_redeem__toolpit"
            className="fe-pager__info__btn_redeem"
            onClick={ this.onClickBtn(game, 'redeem') }
          />
        </View>
      );
    }

    if (game.key_redeem_enabled) {
      return (
        <Button
          redeem
          className="fe-pager__info-wraper__buy-btn"
          onClick={ this.onClickBtn(game, 'redeem') }
        >
          Redeem
        </Button>
      );
    }
  }
}

export default FeatucheringViewPager;

import React from 'react';
import './index.css';

import {
  View,
  Title,
  Text,
  Button,
  ArrowButton,
} from '../../elements';

import ProgressBar from '../ProgressBar';

const uuidv4 = require('uuid/v4');
const step = 2;

class AllGames extends React.Component {
  constructor(props) {
    super(props);

    this.className = props.className;

    this.state = {
      pagerPage: 0,
      lastInPager: 0,
    };
  }

  turnLeft = () => {
    let { pagerPage, lastInPager } = this.state;

    if (pagerPage === 1) {
      lastInPager = 0;
    }

    if (pagerPage > 0) {
      this.setState({pagerPage: pagerPage - 1, lastInPager});
    }
  }

  turnRight = () => {
    const curPage = this.state.pagerPage;
    const L = this.props.games.length;
    const lastCount = L - ((curPage + 1) * step);

    let lastInPager = 0;

    if (lastCount < step) {
      lastInPager = lastCount - step;
    }

    if (curPage < Math.floor(this.props.games.length / curPage * step)) {
      this.setState({pagerPage: curPage + 1, lastInPager});
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
    // const { lastInPager, pagerPage } = this.state;
    // const pers = pagerPage * (50 * step) + (50 * lastInPager);
    // const px = pagerPage * (20 * (0.5 * step)) + (20 * (0.5 * lastInPager));

    return (
      <View className={`${this.className}`}>
        <Title
          header
          // nav={ this.renderNav() }
        >
          All Games
        </Title>

        {/* <View className="all__games">
          <View className="all__lenta" style={{ left: `calc(-${pers}% - ${px}px)` }}>
            { this.props.games.slice(0, 5).map(g => this.renderGameBlock(g)) }
          </View>
        </View> */}

         <View className="all__games">
          { this.props.games.slice(0, 5).map(g => this.renderGameBlock(g)) }
        </View>
      </View>
    );
  }

  renderNav() {
    return (
      <View className="all__header__nav">
        <ArrowButton onClick={ this.turnLeft } />
        <ArrowButton onClick={ this.turnRight } right />
      </View>
    );
  }

  renderGameBlock(g) {
    const { curGame } = this.props;
    const installing = curGame.status === 'INSTALLING' || curGame.status === 'PAUSED';
    const installProccess = curGame.id === g.id && installing;

    return (
      <View className="all__game" key={uuidv4()}>
        <View className="all__game__img">
          <img onClick={ this.openGame(g) } className="all__game__img__fon" src={ g.getGameBanner() } alt={uuidv4()} />
          <View className="all__game__info">
            <Title link onClick={ this.openGame(g) }>
              { g.name }
            </Title>
            { this.renderBtn(g, installProccess, curGame.status, installing) }
            {
              installProccess &&
                <ProgressBar className="all__progress-bar" />
            }
          </View>
        </View>
      </View>
    );
  }

  renderBtn(game, installProccess, status, installing) {
    if (installProccess) {
      if (status === 'INSTALLING') {
        return <Text>Installing...</Text>;
      }
      return <Text>Paused...</Text>;
    }

    if (game.hasUserGame && game.installed) {
      return (
        <Button
          className="all__game__info__btn"
          onClick={ this.onClickBtn(game, 'launch') }
        >
          Launch
        </Button>
      );
    }

    if (game.hasUserGame && !game.installed) {
      return (
        <Button
          className="all__game__info__btn"
          disabled={ installing }
          onClick={ this.onClickBtn(game, 'install') }
        >
          Install
        </Button>
      );
    }

    if (game.buy_option_enabled && !game.key_redeem_enabled) {
      return (
        <Button
          className="all__game__info__btn"
          green
          onClick={ this.onClickBtn(game, 'buy') }
        >
          Buy
        </Button>
      );
    }

    if (game.buy_option_enabled && game.key_redeem_enabled) {
      return (
        <View className="all__game__info__btn__wrap">
          <Button
            redeem
            small
            toolpitClassName="all__game__info__btn_redeem__toolpit"
            className="all__game__info__btn_redeem"
            onClick={ this.onClickBtn(game, 'redeem') }
          >
            Redeem
          </Button>
          <Button
            green
            className="all__game__info__btn"
            onClick={ this.onClickBtn(game, 'buy') }
          >
            Buy
          </Button>
        </View>
      );
    }

    if (game.key_redeem_enabled) {
      return (
        <Button
          redeem
          className="all__game__info__btn"
          onClick={ this.onClickBtn(game, 'redeem') }
        >
          Redeem
        </Button>
      );
    }
  }
}

export default AllGames;

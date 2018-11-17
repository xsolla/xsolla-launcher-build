import React from 'react';
import './index.css';
import ProgressBar from '../ProgressBar';
import {
  View,
  Text,
  Title,
  // Description,
  Button,
  ArrowButton,
} from '../../elements';

import { text } from '../../../langs';

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

  onArrowClick = left => () => {
    if (this.props.pageDirection === 'ltr') {
      if (left) {
        this.turnLeft();
      } else {
        this.turnRight(true);
      }
    } else {
      if (!left) {
        this.turnLeft();
      } else {
        this.turnRight(true);
      }
    }
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
      <View className={`fe-pager ${this.className}`} style={{ direction: this.props.pageDirection }}>
        {
          this.props.games.length > 1 &&
            <ArrowButton big
              className="fe-pager__arrow-left"
              onClick={ this.onArrowClick(true) }
            />
        }
        <View
          className="fe-pager__lenta"
          style={{ left: `${this.props.pageDirection === 'ltr' ? '-' : ''}${this.state.pagerPage * 100}%` }}
        >
          { this.props.games.slice(0, 5).map(g => this.renderGame(g)) }
        </View>
        {
          this.props.games.length > 1 &&
            <ArrowButton
              big right
              className="fe-pager__arrow-right"
              onClick={ this.onArrowClick(false) }
            />
        }
      </View>
    );
  }

  renderGame(game) {
    const { curGame } = this.props;
    const install = curGame.status === 'INSTALLING' || curGame.status === 'PAUSED';
    const installProccess = curGame.id === game.id && install;

    return (
      <View className="fe-pager__game" key={uuidv4()}>
        <img onClick={ this.openGame(game) } className="fe-pager__image" src={ game.getGameBanner() } alt={uuidv4()}/>
        <View className={ this.props.pageDirection !== 'ltr' ? 'fe-pager__info-wraper__rtl' : 'fe-pager__info-wraper'}>
          <Text>{ text('HOME.TITLE_FEATURED_GAME') }</Text>
          <Title
            link
            className="fe-pager__info-wraper__title"
            onClick={ this.openGame(game) }
          >
            { game.name }
          </Title>
          <div dangerouslySetInnerHTML={{ __html: game.title }}></div>
          {/* <Description>
            { this.renderGameDescription(game.description) }
          </Description> */}
          {
             installProccess &&
              <ProgressBar className="fe-pager__progress-bar" />
          }
          { this.renderBtn(game, installProccess, curGame.status, install) }
        </View>
      </View>
    );
  }

  renderGameDescription(text) {
    if (text.length > 153) {
      let newText = text.slice(0, 150).split(' ');
      newText = newText.slice(0, newText.length - 1).join(' ');

      return newText + ' ...';
    }

    return text;
  }

  renderBtn(game, installProccess, status, install) {
    const rtl = this.props.pageDirection !== 'ltr';

    if (installProccess) {
      return <Text
        className={`fe-pager__status${rtl ? '__rtl' : ''}`}>
          {
            status === 'INSTALLING' ?
              text('ELEMENT.LABEL_INSTALLING') :
              text('ELEMENT.LABEL_PAUSED')
          }
        </Text>;
    }

    if (game.hasUserGame && game.installed) {
      return (
        <Button
          className={`fe-pager__info-wraper__buy-btn${rtl ? '__rtl' : ''}`}
          onClick={ this.onClickBtn(game, 'launch') }
        >
          { text('ELEMENT.BTN_LAUNCH') }
        </Button>
      );
    }

    if (game.hasUserGame && !game.installed) {
      return (
        <Button
          className={`fe-pager__info-wraper__buy-btn${rtl ? '__rtl' : ''}`}
          disabled={ install }
          onClick={ this.onClickBtn(game, 'install') }
        >
          { text('ELEMENT.BTN_INSTALL') }
        </Button>
      );
    }

    if (game.buy_option_enabled && !game.key_redeem_enabled) {
      return (
        <Button
          className={`fe-pager__info-wraper__buy-btn${rtl ? '__rtl' : ''}`}
          green
          onClick={ this.onClickBtn(game, 'buy') }
        >
          { text('ELEMENT.BTN_BUY') }
        </Button>
      );
    }

    if (game.buy_option_enabled && game.key_redeem_enabled) {
      return (
        <View
          className={`fe-pager__info__btn__wrap${rtl ? '__rtl' : ''}`}
        >
          <Button
            green
            className="fe-pager__info__btn"
            onClick={ this.onClickBtn(game, 'buy') }
          >
            { text('ELEMENT.BTN_BUY') }
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
          className={`fe-pager__info-wraper__buy-btn${rtl ? '__rtl' : ''}`}
          onClick={ this.onClickBtn(game, 'redeem') }
        >
          { text('ELEMENT.BTN_REDEEM') }
        </Button>
      );
    }
  }
}

export default FeatucheringViewPager;

import React from 'react';
import './index.css';
import ProgressBar from '../ProgressBar';
import { text } from '../../../langs';

import {
  View,
  Subtitle,
  Title,
  Text,
  // Description,
  Button,
} from '../../elements';

class Details extends React.Component {
  constructor(props) {
    super(props);

    this.className = props.className;

    this.state = {
      //
    };
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
    const { game, curGame } = this.props;
    const installProccess = curGame.id === game.id && (curGame.status === 'INSTALLING' || curGame.status === 'PAUSED');
    return (
      <View className={`gdetails ${this.className}`} style={{ direction: this.props.pageDirection }}>
        <View className="gdetails__main-info" >
          <View style={{ flexDirection: 'row' }}>
            <img
              // src={`../img/web/game_logo_${game.publisher_project_id}.png`}
              src={ game.game_logo }
              alt="logo"
              className="gdetails__logo"
            />
          </View>
          
          <Title className="gdetails__main-info__title">{ game.name }</Title>

          <div dangerouslySetInnerHTML={{ __html: game.title }}></div>

          <View className="gdetails__buy-btn_wrap">
            {
              installProccess &&
                <ProgressBar className="gdetails__progress-bar" />
            }
            { !installProccess && this.renderBtn(game) }
            { curGame.status === 'INSTALLING' && installProccess && <Text className="gdetails__status">{ text('ELEMENT.LABEL_INSTALLING') }</Text> }
            { curGame.status === 'PAUSED' && installProccess && <Text className="gdetails__status">{ text('ELEMENT.LABEL_PAUSED') }</Text> }
          </View>
        </View>
        
        <View className="gdetails__info_container">
          <Subtitle containerClassName="gdetails__title_container" header>{ text('GAME_PAGE.TITLE_DETAILS') }</Subtitle>
          <div dangerouslySetInnerHTML={{ __html: game.details }}></div>
        </View>

        <View className="gdetails__info_container">
          <Subtitle containerClassName="gdetails__title_container" header>{ text('GAME_PAGE.TITLE_SYS_REQ') }</Subtitle>

          <div dangerouslySetInnerHTML={{ __html: game.system_requirements }}></div>
        </View>
      </View>
    );
  }

  renderBtn(game) {
    if (game.hasUserGame && !game.installed) {
      return (
        <Button
          className="gdetails__buy-btn"
          onClick={ this.onClickBtn(game, 'install') }
        >
          { text('ELEMENT.BTN_INSTALL') }
        </Button>
      );
    }

    if (game.hasUserGame && game.installed) {
      return (
        <Button
          className="gdetails__buy-btn"
          onClick={ this.onClickBtn(game, 'launch') }
        >
          { text('ELEMENT.BTN_LAUNCH') }
        </Button>
      );
    }

    if (game.buy_option_enabled && !game.key_redeem_enabled) {
      return (
        <Button
          className="gdetails__buy-btn"
          green
          onClick={ this.onClickBtn(game, 'buy') }
        >
          { text('ELEMENT.BTN_BUY') }
        </Button>
      );
    }

    if (game.buy_option_enabled && game.key_redeem_enabled) {
      return (
        <View className="gdetails__info__btns_redeem__wrap">
          <Button
            green
            className="gdetails__buy-btn"
            onClick={ this.onClickBtn(game, 'buy') }
          >
            { text('ELEMENT.BTN_BUY') }
          </Button>
          <Button
            redeem
            small
            toolpitClassName="fe-pager__info__btn_redeem__toolpit"
            className="gdetails__btn_redeem"
            onClick={ this.onClickBtn(game, 'redeem') }
          />
        </View>
      );
    }

    if (!game.buy_option_enabled && game.key_redeem_enabled) {
      return (
        <Button
          redeem
          className="gdetails__buy-btn"
          onClick={ this.onClickBtn(game, 'redeem') }
        >{ text('ELEMENT.BTN_REDEEM') }</Button>
      );
    }
  }
}

export default Details;

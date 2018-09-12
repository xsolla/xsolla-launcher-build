import React from 'react';
import './index.css';
import ProgressBar from '../ProgressBar';
import {
  View,
  Subtitle,
  Title,
  Text,
  Description,
  Button,
} from '../../elements';

class AllGames extends React.Component {
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
      <View className={`gdetails ${this.className}`}>
        <View className="gdetails__main-info" >
          <View style={{ flexDirection: 'row' }}>
            <img src={`../img/web/game_logo_${game.publisher_project_id}.png`} alt="logo" className="gdetails__logo" />
          </View>
          
          <Title className="gdetails__main-info__title">{ game.name }</Title>
          {/* <Description>
            { game.description  }
          </Description> */}
          <View className="gdetails__buy-btn_wrap">
            {
              installProccess &&
                <ProgressBar className="gdetails__progress-bar" />
            }
            { !installProccess && this.renderBtn(game) }
            { curGame.status === 'INSTALLING' && installProccess && <Text className="gdetails__status">Installing...</Text> }
            { curGame.status === 'PAUSED' && installProccess && <Text className="gdetails__status">Paused...</Text> }
          </View>
        </View>
        
        {/* <Subtitle header>Details</Subtitle>

        <View className="gdetails_info-block">
          <Description>Title: <span className="gdetails_info-block__value">Value</span></Description>
          <Description>Developer: <span className="gdetails_info-block__value">Value</span></Description>
          <Description>Publisher: <span className="gdetails_info-block__value">Value</span></Description>
          <Description>Release Date: <span className="gdetails_info-block__value">Value</span></Description>
        </View> */}

        <Subtitle header>System requirements</Subtitle>

        <View className="gdetails_info-block">
          {
            game.getMinSysReq().map(r =>
              <Description key={`${r.field}-${r.value}`}>{r.field}<span className="gdetails_info-block__value">{r.value ? `: ${r.value}` : ''}</span></Description>
            )
          }
          {/* <Description>OS: <span className="gdetails_info-block__value">Value</span></Description>
          <Description>Processor: <span className="gdetails_info-block__value">Value</span></Description>
          <Description>Memory: <span className="gdetails_info-block__value">Value</span></Description>
          <Description>Graphics: <span className="gdetails_info-block__value">Value</span></Description>
          <Description>Network: <span className="gdetails_info-block__value">Value</span></Description>
          <Description>Storage: <span className="gdetails_info-block__value">Value</span></Description>
          <Description>Sound Card: <span className="gdetails_info-block__value">Value</span></Description> */}
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
          Install
        </Button>
      );
    }

    if (game.hasUserGame && game.installed) {
      return (
        <Button
          className="gdetails__buy-btn"
          onClick={ this.onClickBtn(game, 'launch') }
        >
          Launch
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
          Buy
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
            Buy
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
        >Redeem</Button>
      );
    }
  }
}

export default AllGames;

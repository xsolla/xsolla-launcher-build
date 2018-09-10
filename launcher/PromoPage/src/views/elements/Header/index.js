import React from 'react';
import View from '../View';
import Subtitle from '../Subtitle';
import Description from '../Description';

function Header (props) {
    return (
        <View className="header">
          <View className="header__nav">
            <Subtitle
              onClick={() => { props.history.push('/') }}
              className={`header__nav-item ${props.selected === 0 ? 'active' : ''}`}
            >
              Home
            </Subtitle>
            <Subtitle
              className={`header__nav-item ${props.selected === 1 ? 'active' : ''}`}
            >
              Games
            </Subtitle>
            <Subtitle
              className={`header__nav-item ${props.selected === 2 ? 'active' : ''}`}
            >
              News
            </Subtitle>
          </View>
          
          <View className="header__nav">
            <Description className="header__user-name">UserName</Description>
            <View className="header__user-photo">
              <View className="header__user-status"/>
            </View>
            <img className="header__chat" src={require('../../../imgs/icons/chat.svg')} alt="chat"/>
            <Description>2</Description>
            <img className="header__video" src={require('../../../imgs/icons/video.svg')} alt="video"/>
          </View>
        </View>
    );
}

export default Header;
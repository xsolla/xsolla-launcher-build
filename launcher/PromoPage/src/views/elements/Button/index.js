import React from 'react';
import View from '../View';
import { text } from '../../../langs';

function Button (props) {
    if (props.redeem) {
        return RedeemButton(props);
    }

    const {
        disabled = false,
        black = false,
        green = false,
        blackText = false,
        className = '',
    } = props;

    let otherClass = '';

    if (disabled) {
        otherClass = ' btn__disabled';
    } else if (black) {
        otherClass = ' btn__black';
    } else if (green) {
        otherClass = ' btn__green';
    }

    if (blackText) {
        otherClass += ' btn__black_text';
    }

    return (
        <View className={`btn ${className}${otherClass}`} onClick={ disabled ? () => {} : props.onClick }>
          { props.children }
        </View>
    );
}

function RedeemButton(props) {
    const {
        disabled = false,
        className = '',
        small = false,
        toolpitClassName = '',
    } = props;

    let otherClass = '';

    if (disabled) {
        otherClass = ' btn__redeem__disabled';
    }

    if (small) {
        return (
            <View className={`toolpit_container ${className}`}>
              <View className={`btn btn__redeem btn__redeem_small ${otherClass}`} onClick={ props.onClick }>
                <img className="btn__redeem__union" src={ require('../../../imgs/icons/union.svg') } alt="union" />
              </View>
              <View className={`btn__redeem__toolpit ${toolpitClassName}`}>
                <img src={ require('../../../imgs/union-toolpit.svg') } alt="toolpit"/>
                <View className="btn__redeem__toolpit__text">{ text('ELEMENT.REEDEM_CODE_TOOLPIT') }</View>
              </View>
            </View>
        );
    }

    return (
        <View className={`btn btn__redeem ${className}${otherClass}`} onClick={ props.onClick }>
          <img className="btn__redeem__union" src={ require('../../../imgs/icons/union.svg') } alt="union" />
          { props.children }
        </View>
    );
}

export default Button;
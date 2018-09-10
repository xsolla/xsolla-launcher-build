import React from 'react';
import './index.css';
import GameMedia from '../GameMedia';

import {
  View,
  Subtitle,
  Description,
} from '../../elements';

class GameDesc extends React.Component {
  constructor(props) {
    super(props);

    this.className = props.className;

    this.state = {
      //
    };
  }

  render() {
    return (
      <View className={`gdesc ${this.className}`}>
        {
          Boolean(this.props.game && this.props.game.arts.length) &&
            <GameMedia media={ this.props.game.arts }/>
        }

        <Subtitle header>Description</Subtitle>

        <Description>
          { this.props.game.description }
          {/* THE RAPTURE HAS HAPPENED. YOU DIDN'T MAKE THE CUT.
        </Description>
        <Description point>
          Rapture Rejects is a top down isometric last man standing game set in the apocalyptic Cyanide & Happiness universe.
        </Description>
        <Description point>
          When God leaves the worst of us to fight for ourselves, all that’s left to do is to kill each other.
        </Description>
        <Description point>
          Scavenge for weapons and kill every other person on Earth, to impress the almighty enough to let you into Heaven.
        </Description>
        <Description>
          Rapture Rejects is a dark comedy Battle Royale game based on the
          Cyanide & Happiness web comics. */}
        </Description>

        {/* <a className="link gdesc__read-more">Read more</a> */}
      </View>
    );
  }
}

export default GameDesc;

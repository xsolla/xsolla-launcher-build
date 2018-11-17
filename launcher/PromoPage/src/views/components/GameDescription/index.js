import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import GameMedia from '../GameMedia';
import { text } from '../../../langs';

import {
  View,
  Subtitle,
  // Description,
} from '../../elements';

class GameDesc extends React.Component {
  constructor(props) {
    super(props);

    this.className = props.className;

    this.state = {
      maxHeightContainer: 'inherit',
      realHeight: 0,
      showReadMore: false,
    };
  }

  componentDidMount() {
    const node = ReactDOM.findDOMNode(this.refs.desc);
    if (node) {
      const calculatedHeight = node.clientHeight;

      if (calculatedHeight > 300) {
        this.setState({
          maxHeightContainer: 300,
          realHeight: calculatedHeight,
          showReadMore: true,
        });
      }
    }
  }

  onReadMore = () => {
    this.setState({ maxHeightContainer: this.state.realHeight, showReadMore: false });
  }

  render() {
    return (
      <View
        className={`${ this.props.pageDirection === 'ltr' ? 'gdesc' : 'gdesc__rtl'} ${this.className}`} 
        style={{ direction: this.props.pageDirection }}
      >
        {
          Boolean(this.props.game && this.props.game.arts.length) &&
            <GameMedia media={ this.props.game.arts } pageDirection={ this.props.pageDirection }/>
        }

        <Subtitle containerClassName="gdesc__title_container" header>{ text('GAME_PAGE.TITLE_DESCRIPTION') }</Subtitle>

        <div ref="desc" className="gdesc__desc-container" style={{ maxHeight: this.state.maxHeightContainer }}>
          <div dangerouslySetInnerHTML={{ __html: this.props.game.description }}></div>
        </div>

        {
          this.state.showReadMore &&
            <a onClick={ this.onReadMore } className="link gdesc__read-more">{ text('GAME_PAGE.READ_MORE') }</a>
        }
      </View>
    );
  }
}

export default GameDesc;

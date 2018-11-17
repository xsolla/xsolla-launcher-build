import React from 'react';
import './index.css';
import YouTube from 'react-youtube';
import {
  View,
  ArrowButton,
} from '../../elements';

const uuidv4 = require('uuid/v4');
const step = 1;

class Media extends React.Component {
  constructor(props) {
    super(props);

    this.className = props.className;

    console.log(props)

    this.state = {
      pagerPage: 0,
      lastInPager: 0,
      selectedMedia: props.media[0] || null,
      selectedIndex: 0,
    };
  }

  onArrowClick = (left = false) => () => {
    console.log(left, this.props.pageDirection)
    if (this.props.pageDirection === 'ltr') {
      if (left) {
        this.turnLeft();
      } else {
        this.turnRight();
      }
    } else {
      if (!left) {
        this.turnLeft();
      } else {
        this.turnRight();
      }
    }
  }

  turnLeft = () => {
    let { pagerPage, selectedIndex } = this.state;

    if (selectedIndex > 0) {
      selectedIndex -= 1;
      this.setState({selectedIndex, selectedMedia: this.props.media[selectedIndex]});
    }

    if (pagerPage > 0) {
      this.setState({pagerPage: pagerPage - 1});
    }
  }

  turnRight = () => {
    let { pagerPage: curPage, selectedIndex } = this.state;
    const L = this.props.media.length;

    if (selectedIndex < L - 1) {
      selectedIndex += 1;
      this.setState({selectedIndex, selectedMedia: this.props.media[selectedIndex]});
    }

    if (curPage < L - 4) {
      this.setState({pagerPage: curPage + 1});
    }
  }

  selectMedia = (selectedMedia, index) => () => {
    this.setState({ selectedMedia, selectedIndex: index });
  }

  render() {
    const { lastInPager, pagerPage } = this.state;
    const ltr = this.props.pageDirection === 'ltr';
    const pers = pagerPage * (25 * step) + (25 * lastInPager);
    const px = pagerPage * (6.5 * (0.25 * step)) + (6.5 * (0.25 * lastInPager))
     + (ltr ? 0 : 6.5 * step);
    const calcSymbol = ltr ? '-' : '+';

    return (
      <View className={`${this.className}`}>
        <View className="gmedia__selected_wraper">
          {
            Boolean(this.state.selectedMedia) &&
              this.renderSelectedMedia(this.state.selectedMedia)
          }
        </View>
        <View className="gmedia__list">
          <ArrowButton big className="gmedia__arrow" onClick={ this.onArrowClick(true) } />

          <View className="gmedia__lenta" style={{ left: `calc(${calcSymbol}${pers}% ${calcSymbol} ${px}px)` }}>
            { this.props.media.map((m, index) => this.renderMedia(m, index)) }
          </View>

          <ArrowButton big right className="gmedia__arrow_right" onClick={ this.onArrowClick() } />
        </View>
      </View>
    );
  }

  renderMedia(m, index) {
    const isVideo = m.type === 'video';

    if (!isVideo) {
      return (
        <View className="gmedia__item__wraper" key={uuidv4()}>
          <img onClick={ this.selectMedia(m, index) } src={m.link} className="gmedia__item" alt={uuidv4()}/>
          {
            m.link === this.state.selectedMedia.link &&
              <View className="gmedia__item__selected" />
          }
        </View>
      );
    }

    return (
      <View className="gmedia__item__wraper" key={uuidv4()}>
        <View onClick={ this.selectMedia(m) } className="gmedia__item gmedia__item__video">
          <View className="gmedia__item__play">
            <img className="gmedia__item__play_arrow" src={require('../../../imgs/icons/play.svg')} alt="play" />
          </View>
        </View>
          {
            m.link === this.state.selectedMedia.link &&
              <View className="gmedia__item__selected" />
          }
      </View>
    );
  }

  renderSelectedMedia(m) {
    const isVideo = m.type === 'video';

    if (isVideo) {
      let videoId = m.link.split('watch?v=')[1];
      
      if (!videoId) {
        const parts = m.link.split('/');

        videoId = parts[parts.length - 1];
      }
      
      return (
        <YouTube
          containerClassName="gmedia__selected"
          videoId={videoId}
          opts={{ height: '100%', width: '100%' }}
        />
      );
    }

    return (
      <img src={m.link} className="gmedia__selected" alt="selectedMedia"/>
    );
  }
}

export default Media;

import React from 'react';
import './index.css';
import {
  View,
  Title,
  ArrowButton,
  Caption,
  Subtitle,
} from '../../elements';
import Time from '../../../models/Time';

import { text } from '../../../langs';

const uuidv4 = require('uuid/v4');
const step = 1;

class LastUpdates extends React.Component {
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
    const L = this.props.news.length;
    const lastCount = L - ((curPage + 1) * step);

    let lastInPager = 0;

    if (lastCount < step) {
      lastInPager = lastCount - step;
    }

    if (this.canTurnRight()) {
      this.setState({pagerPage: curPage + 1, lastInPager});
    }
  }

  render() {
    const { lastInPager, pagerPage } = this.state;
    const pers = pagerPage * (25 * step) + (25 * lastInPager);
    const px = pagerPage * (20 * (0.25 * step)) + (20 * (0.25 * lastInPager));

    return (
      <View className={`last-update ${this.className}`}>
        <View style={{ direction: this.props.pageDirection }}>
          <Title header nav={ this.renderNav() }>
            { text('HOME.TITLE_LAST_UPDATE') }
          </Title>
        </View>

        <View className="lu__games">
          <View
            className="lu__lenta"
            style={{ left: `calc(-${pers}% - ${px}px)` }}
          >
            { this.props.news.map(n => this.renderNewsBlock(n)) }
          </View>
        </View>
      </View>
    );
  }

  renderNav() {
    if (this.props.pageDirection !== 'ltr') {
      return (
        <View className="lu__header__nav">
          <ArrowButton onClick={ this.turnRight } right disabled={ !this.canTurnRight() } />
          <ArrowButton onClick={ this.turnLeft } disabled={this.state.pagerPage === 0} />
        </View>
      );
    }

    return (
      <View className="lu__header__nav">
        <ArrowButton onClick={ this.turnLeft } disabled={this.state.pagerPage === 0} />
        <ArrowButton onClick={ this.turnRight } right disabled={ !this.canTurnRight() } />
      </View>
    );
  }

  renderNewsBlock(n) {
    const date = new Time(n.date);

    return (
      <View className="lu__game" key={ uuidv4() } style={{ direction: this.props.pageDirection }}>
        <img onClick={ () => { window.openOneNews(n.id) } } className="lu__game__img" src={ n.image } alt={ uuidv4() }/>
        <Caption className="lu__game__date">{ date.getFormat() }</Caption>
        <Subtitle link onClick={ () => { window.openOneNews(n.id) } }>
          { n.title  }
        </Subtitle>
      </View>
    );
  }

  canTurnRight() {
    const curPage = this.state.pagerPage;

    return curPage < this.props.news.length - 4;
  }
}

export default LastUpdates;

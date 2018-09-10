import { combineReducers } from 'redux';

import users from './users';
import games from './games';
import pages from './pages';
import news from './news';

export default combineReducers({
    users,
    games,
    pages,
    news,
});

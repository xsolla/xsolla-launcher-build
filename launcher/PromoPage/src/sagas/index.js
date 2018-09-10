import users from './users';
import games from './games';
import pages from './pages';
import news from './news';

export default function* () {
  yield [
    users(),
    games(),
    pages(),
    news(),
  ];
};

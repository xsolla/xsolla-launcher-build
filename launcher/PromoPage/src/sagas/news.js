import { put, takeEvery } from 'redux-saga/effects';
import {
  newsSetListReq,
  newsSetListFin,
  newsSetListErr
} from '../actions/news';

import News from '../models/News';

export function* setListProc({ payload }) {
  try {
    yield put(newsSetListFin(payload.map(n => new News(n))));
    window.getNextNewsArray();
  } catch(err) {
    yield put(newsSetListErr());
  }
}

export default function* () {
  yield [
    takeEvery(newsSetListReq().type, setListProc),
  ];
}

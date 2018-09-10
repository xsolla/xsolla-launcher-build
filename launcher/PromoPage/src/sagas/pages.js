import { put, takeEvery } from 'redux-saga/effects';

import {
  pageSetCurPageReq,
  pageSetCurPage
} from '../actions/pages';

export function* setPageProc({ payload }) {
  try {
    yield put(pageSetCurPage(payload));
  } catch(err) {
    //
  }
}

export default function* () {
  yield [
    takeEvery(pageSetCurPageReq().type, setPageProc),
  ];
}

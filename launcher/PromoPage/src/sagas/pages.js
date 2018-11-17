import { put, takeEvery } from 'redux-saga/effects';

import {
  pageSetCurPageReq,
  pageSetCurPage,

  pageSetLangReq,
  pageSetLang,
} from '../actions/pages';

export function* setPageProc({ payload }) {
  try {
    yield put(pageSetCurPage(payload));
  } catch(err) {
    //
  }
}

export function* setLangProc({ payload }) {
  try {
    window.lang = payload.lang;
    yield put(pageSetLang(payload));
  } catch(err) {
    //
  }
}

export default function* () {
  yield [
    takeEvery(pageSetCurPageReq().type, setPageProc),
    takeEvery(pageSetLangReq().type, setLangProc),
  ];
}

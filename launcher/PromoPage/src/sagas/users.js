import { put, takeEvery } from 'redux-saga/effects';

import {
  userSomeReq,
  userSomeStart,
  userSomeFin,
  userSomeErr,
} from '../actions/users';

// const uuidv4 = require('uuid/v4');

export function* getSomeProc(action) {
  try {
    yield put(userSomeStart());
    yield put(userSomeFin());
  } catch(err) {
    yield put(userSomeErr());
  }
}

export default function* () {
  yield [
    takeEvery(userSomeReq().type, getSomeProc),
  ];
}

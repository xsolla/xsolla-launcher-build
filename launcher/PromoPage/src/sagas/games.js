import { put, takeEvery } from 'redux-saga/effects';
import { pageSetCurPage } from '../actions/pages';
import {
  gamesSetListReq,
  gamesSetListFin,
  gamesSetListErr,

  gamesSelectGameReq,
  gamesSelectGameFin,
  gamesSelectGameErr,

  gamesSetCurLauncherGameReq,
  gamesSetCurLauncherGameFin,
  gamesSetCurLauncherGameErr,

  gamesSetCurProgressGameReq,
  gamesSetCurProgressGameFin,
  gamesSetCurProgressGameErr,

  gamesSetCurStatusGameReq,
  gamesSetCurStatusGameFin,
  gamesSetCurStatusGameErr,
} from '../actions/games';

import Game from '../models/Game';

export function* setListProc({ payload }) {
  try {
    yield put(gamesSetListFin(payload.map(g => new Game(g))));
  } catch(err) {
    yield put(gamesSetListErr());
  }
}

export function* selectGameProc({ payload }) {
  try {
    yield put(gamesSelectGameFin(payload));
    yield put(pageSetCurPage('Game'));
  } catch(err) {
    yield put(gamesSelectGameErr());
  }
}

export function* setCurGameProc({ payload }) {
  try {
    yield put(gamesSetCurLauncherGameFin(payload));
  } catch(err) {
    yield put(gamesSetCurLauncherGameErr());
  }
}

export function* setCurProgressProc({ payload }) {
  try {
    yield put(gamesSetCurProgressGameFin(payload));
  } catch(err) {
    yield put(gamesSetCurProgressGameErr());
  }
}

export function* setCurGameStatusProc({ payload }) {
  try {
    yield put(gamesSetCurStatusGameFin(payload));
  } catch(err) {
    yield put(gamesSetCurStatusGameErr());
  }
}

export default function* () {
  yield [
    takeEvery(gamesSetListReq().type, setListProc),
    takeEvery(gamesSelectGameReq().type, selectGameProc),
    takeEvery(gamesSetCurLauncherGameReq().type, setCurGameProc),
    takeEvery(gamesSetCurProgressGameReq().type, setCurProgressProc),
    takeEvery(gamesSetCurStatusGameReq().type, setCurGameStatusProc),
  ];
}

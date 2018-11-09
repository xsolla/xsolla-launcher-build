import { put, takeEvery, select } from 'redux-saga/effects';
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
    const list = payload.map(g => new Game(g));
    let curSelectedGame = yield select(getSelectedGame);

    yield put(gamesSetListFin(list));

    if (curSelectedGame.id) {
      const newSelectedGame = list.find(g => g.id === curSelectedGame.id);

      if (newSelectedGame) {
        yield put(gamesSelectGameFin(newSelectedGame));
      }
    }
  } catch(err) {
    yield put(gamesSetListErr());
  }
}

function getSelectedGame(state) {
  return state.games.selectedGame;
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

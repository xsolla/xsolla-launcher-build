import { createReducer } from 'redux-act';
import Game from '../models/Game';
import {
  gamesSetListFin,
  gamesSetListErr,

  gamesSelectGameFin,
  gamesSelectGameErr,

  gamesSetCurLauncherGameFin,
  gamesSetCurLauncherGameErr,

  gamesSetCurProgressGameFin,
  gamesSetCurProgressGameErr,

  gamesSetCurStatusGameFin,
  gamesSetCurStatusGameErr,
} from '../actions/games';

export const initialState = {
  list: [],
  newGames: [],
  featureGames: [],

  selectedGame: new Game({}),

  curGameInLauncher: null,
  curProgress: 0,
  curGameStatus: null,
}

export default createReducer(
  {
    [gamesSetListFin]: (state, payload) => ({
      ...state,
      list: payload,
      newGames: payload.filter(g => g.is_new),
      featureGames: payload.filter(g => g.is_feature),
    }),

    [gamesSetListErr]: (state) => ({
      ...state,
    }),

    [gamesSelectGameFin]: (state, payload) => ({
      ...state,
      selectedGame: payload,
    }),

    [gamesSelectGameErr]: (state) => ({
      ...state,
      selectedGame: null,
    }),

    [gamesSetCurLauncherGameFin]: (state, payload) => ({
      ...state,
      curGameInLauncher: payload,
    }),

    [gamesSetCurLauncherGameErr]: (state) => ({
      ...state,
      curGameInLauncher: null,
    }),

    [gamesSetCurProgressGameFin]: (state, payload) => ({
      ...state,
      curProgress: payload,
    }),

    [gamesSetCurProgressGameErr]: (state) => ({
      ...state,
      curProgress: -1,
    }),

    [gamesSetCurStatusGameFin]: (state, payload) => ({
      ...state,
      curGameStatus: payload,
    }),

    [gamesSetCurStatusGameErr]: (state) => ({
      ...state,
      curGameStatus: null,
    }),
  },
  initialState,
)

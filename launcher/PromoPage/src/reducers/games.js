import { createReducer } from 'redux-act';
// import Game from '../models/Game';
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
  list: [
    // new Game({ name: 'Game 1', hasUserGame: false, installed: false, id: 1, gameIcon: 'https://images.lexus-europe.com//gb/CT/CT%20200h/F%20SPORT/width/740/height/340/scale-mode/0/padding/0,0/day-exterior-06_8X1.png' }),
    // new Game({ name: 'Game 2', hasUserGame: true, installed: false, id: 2, gameIcon: 'https://johncornacchia.files.wordpress.com/2011/11/vertical-farm-editt-tower-globacorp-john-cornacchia-1.jpg' }),
    // new Game({ name: 'Game 3', hasUserGame: true, installed: true, id: 3 }),
    // new Game({ name: 'Game 4', hasUserGame: true, installed: false, id: 4 }),
  ],
  selectedGame: null, //new Game({ name: 'Game 1', hasUserGame: false, installed: false, id: 1 }),

  curGameInLauncher: null,
  curProgress: 0,
  curGameStatus: null,
}

export default createReducer(
  {
    [gamesSetListFin]: (state, payload) => ({
      ...state,
      list: payload,
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

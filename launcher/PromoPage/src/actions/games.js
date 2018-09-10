import { createAction } from 'redux-act';

export const gamesSetListReq = createAction('GAMES@@SET_LIST');
export const gamesSetListFin = createAction('GAMES@@SET_LIST__FIN');
export const gamesSetListErr = createAction('GAMES@@SET_LIST__ERR');

export const gamesSelectGameReq = createAction('GAMES@@SELECT_GAME');
export const gamesSelectGameFin = createAction('GAMES@@SELECT_GAME__FIN');
export const gamesSelectGameErr = createAction('GAMES@@SELECT_GAME__ERR');

export const gamesSetCurLauncherGameReq = createAction('GAMES@@SET_CUR_GAME');
export const gamesSetCurLauncherGameFin = createAction('GAMES@@SET_CUR_GAME__FIN');
export const gamesSetCurLauncherGameErr = createAction('GAMES@@SET_CUR_GAME__ERR');

export const gamesSetCurProgressGameReq = createAction('GAMES@@SET_CUR_PROGRESS');
export const gamesSetCurProgressGameFin = createAction('GAMES@@SET_CUR_PROGRESS__FIN');
export const gamesSetCurProgressGameErr = createAction('GAMES@@SET_CUR_PROGRESS__ERR');

export const gamesSetCurStatusGameReq = createAction('GAMES@@SET_CUR_STATUS');
export const gamesSetCurStatusGameFin = createAction('GAMES@@SET_CUR_STATUS__FIN');
export const gamesSetCurStatusGameErr = createAction('GAMES@@SET_CUR_STATUS__ERR');


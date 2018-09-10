import { createAction } from 'redux-act';

export const newsSetListReq = createAction('NEWS@@SET_LIST');
export const newsSetListFin = createAction('NEWS@@SET_LIST__FIN');
export const newsSetListErr = createAction('NEWS@@SET_LIST__ERR');

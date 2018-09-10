import { createAction } from 'redux-act';

export const userSomeReq = createAction('USERS@@SOME');
export const userSomeStart = createAction('USERS@@SOME_START');
export const userSomeFin = createAction('USERS@@SOME__FIN');
export const userSomeErr = createAction('USERS@@SOME__ERR');

import { createAction } from 'redux-act';

export const pageSetCurPageReq = createAction('PAGE@@SET_CUR_PAGE');
export const pageSetCurPage = createAction('PAGE@@SET_CUR_PAGE__FIN');

export const pageSetLangReq = createAction('PAGE@@SET_LANG');
export const pageSetLang = createAction('PAGE@@SET_LANG__FIN');

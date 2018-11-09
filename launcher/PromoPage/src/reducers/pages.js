import { createReducer } from 'redux-act';

import {
  pageSetCurPage,
  pageSetLang,
} from '../actions/pages';

export const initialState = {
  curPage: 'Home',
  lang: 'en',
  direction: 'ltr',
}

export default createReducer(
  {
    [pageSetCurPage]: (state, payload) => ({
      ...state,
      curPage: payload,
    }),

    [pageSetLang]: (state, payload) => ({
      ...state,
      lang: payload.lang,
      direction: payload.direction
    }),
  },
  initialState,
)

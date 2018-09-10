import { createReducer } from 'redux-act';

import {
  pageSetCurPage,
} from '../actions/pages';

export const initialState = {
  curPage: 'Home',
}

export default createReducer(
  {
    [pageSetCurPage]: (state, payload) => ({
      ...state,
      curPage: payload,
    }),
  },
  initialState,
)

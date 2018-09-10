import { createReducer } from 'redux-act';

import {
  userSomeFin,
  userSomeErr,
} from '../actions/users';

export const initialState = {
  //
}

export default createReducer(
  {
    [userSomeFin]: (state, payload) => ({
      ...state,
    }),

    [userSomeErr]: (state, payload) => ({
      ...state,
    }),
  },
  initialState,
)

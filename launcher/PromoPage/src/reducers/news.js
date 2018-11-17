import { createReducer } from 'redux-act';
import {
  newsSetListFin,
  newsSetListErr,
} from '../actions/news';

export const initialState = {
  list: [],
}

export default createReducer(
  {
    [newsSetListFin]: (state, payload) => ({
      ...state,
      list: payload,
    }),

    [newsSetListErr]: (state) => ({
      ...state,
    }),
  },
  initialState,
)

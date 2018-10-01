import {
  CARDS_REQUEST,
  CARDS_RECEIVE
} from './actions'

const DEFAULT_STATE = {
  loading: true
}

export default function cards (state = DEFAULT_STATE, action) {
  const type = action.type
  const payload = action.payload

  switch (type) {
    case CARDS_REQUEST:
      return {
        ...state,
        loading: true
      }
    case CARDS_RECEIVE:
      return {
        ...state,
        loading: false,
        items: payload.items
      }
    default:
      return state
  }
}

import {
  PATIENTS_REQUEST,
  PATIENTS_RECEIVE
} from './actions'

const DEFAULT_STATE = {
  loading: true
}

export default function patients (state = DEFAULT_STATE, action) {
  const type = action.type
  const payload = action.payload

  switch (type) {
    case PATIENTS_REQUEST:
      return {
        ...state,
        loading: true
      }
    case PATIENTS_RECEIVE:
      return {
        ...state,
        loading: false,
        items: payload.items,
        total: payload.meta.total
      }
    default:
      return state
  }
}

import {
  DOCTORS_REQUEST,
  DOCTORS_RECEIVE,
  DOCTOR_DETAIL_REQUEST,
  DOCTOR_DETAIL_RECEIVE
} from './actions'

const DEFAULT_STATE = {
  loading: true,
  detail: null,
  detailLoading: true
}

export default function doctors (state = DEFAULT_STATE, action) {
  const type = action.type
  const payload = action.payload

  switch (type) {
    case DOCTORS_REQUEST:
      return {
        ...state,
        loading: true
      }
    case DOCTORS_RECEIVE:
      return {
        ...state,
        loading: false,
        items: payload.items,
        total: payload.meta.total
      }
    case DOCTOR_DETAIL_REQUEST:
      return {
        ...state,
        detailLoading: true
      }
    case DOCTOR_DETAIL_RECEIVE:
      return {
        ...state,
        detailLoading: false,
        detail: payload
      }
    default:
      return state
  }
}

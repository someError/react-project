import {
  USER_RECEIVE,
  USER_REQUEST,
  USER_CHANGE, USER_INVALIDATE,
  SOS_CARD_RECEIVE
} from './actions'

const DEFAULT_STATE = {
  loading: true,
  failed: false,
  sosLoading: true
}

export default function user (state = DEFAULT_STATE, action) {
  const type = action.type
  const payload = action.payload

  switch (type) {
    case USER_REQUEST:
      return {
        ...state,
        loading: true,
        failed: false
      }
    case USER_RECEIVE:
      if (payload) {
        return {
          ...state,
          loading: false,
          ...payload,
          fullName: `${payload.firstName} ${payload.lastName}`,
          cardId: (payload.card && payload.card.id) || null,
          failed: false
        }
      } else {
        return {
          ...DEFAULT_STATE,
          loading: false,
          failed: true
        }
      }
    case USER_CHANGE:
      return {
        ...state,
        ...payload,
        fullName: `${payload.firstName} ${payload.lastName}`,
        cardId: (payload.card && payload.card.id) || null
      }
    case SOS_CARD_RECEIVE:
      return {
        ...state,
        sos: payload,
        sosLoading: false
      }
    case 'SOS_CHANGE_STATUS':
      return {
        ...state,
        sos: payload
      }
    case USER_INVALIDATE:
      return {}
    default:
      return state
  }
}

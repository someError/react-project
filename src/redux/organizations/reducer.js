import {
  ORGANIZATIONS_REQUEST,
  ORGANIZATIONS_RECEIVE,
  ORG_DETAIL_REQUEST,
  ORG_DETAIL_RECEIVE
} from './actions'

const DEFAULT_STATE = {
  loading: true,
  detail: null,
  detailLoading: true
}

export default function cards (state = DEFAULT_STATE, action) {
  const type = action.type
  const payload = action.payload

  switch (type) {
    case ORGANIZATIONS_REQUEST:
      return {
        ...state,
        loading: true
      }
    case ORGANIZATIONS_RECEIVE:
      return {
        ...state,
        loading: false,
        items: payload.items,
        total: payload.meta.total
      }
    case ORG_DETAIL_REQUEST:
      return {
        ...state,
        detailLoading: true
      }
    case ORG_DETAIL_RECEIVE:
      return {
        ...state,
        detailLoading: false,
        detail: payload
      }
    default:
      return state
  }
}

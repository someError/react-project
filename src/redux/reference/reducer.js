import {
  REFERENCE_RECEIVE,
  REFERENCE_REQUEST
} from './actions'

const DEFAULT_STATE = {
  loading: true,
  parameters: [],
  sections: [],
  'service-types': [],
  specialties: [],
  bloods: [],
  timezones: [],
  regions: []
}

export default function cards (state = DEFAULT_STATE, action) {
  const { type, payload } = action

  switch (type) {
    case REFERENCE_REQUEST:
      return {
        ...state,
        [[payload.referenceType] + '-loading']: true,
        loading: true
      }
    case REFERENCE_RECEIVE:
      return {
        ...state,
        [payload.referenceType]: payload.data,
        [[payload.referenceType] + '-loading']: false,
        loading: false
      }
    default:
      return state
  }
}

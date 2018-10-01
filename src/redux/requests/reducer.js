import {
  RECORDS_REQUEST,
  RECORDS_RECEIVE,
  RECORD_CHANGE,
  // REMOVE_RECORD_REQUEST,
  RECORDS_RECEIVE_AFTER_REMOVE
} from './actions'
import store from '../store'

const DEFAULT_STATE = {
  loading: true,
  detailLoading: true
}

export default function records (state = DEFAULT_STATE, action) {
  const type = action.type
  const payload = action.payload
  let records = store && store.getState().records.items

  switch (type) {
    case RECORD_CHANGE:
      let record = null
      if (records) record = records.filter(record => { return record.id === payload.id })[0]
      if (record) record = Object.assign(record, payload)
      return {
        ...state,
        items: records
      }
    case RECORDS_REQUEST:
      return {
        ...state,
        loading: true
      }
    case RECORDS_RECEIVE:
      return {
        ...state,
        loading: false,
        items: payload.items,
        total: payload.meta.total
      }
    case RECORDS_RECEIVE_AFTER_REMOVE:
      if (records) records = records.filter(record => { return record.id !== payload })
      return {
        ...state,
        items: records
      }
    case 'QUEUES_ADD_RECORD':
      records && records.push(payload)
      return {
        ...state,
        items: records
      }
    default:
      return state
  }
}

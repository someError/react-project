import api from '../../api'

export const RECORD_CHANGE = 'RECORD_CHANGE'

export function receiveRecord (data) {
  return {
    type: RECORD_CHANGE,
    payload: data
  }
}

export function changeRecord (data) {
  return function (dispatch) {
    return dispatch(receiveRecord(data))
  }
}

export const RECORDS_REQUEST = 'RECORDS_REQUEST'

export const RECORDS_RECEIVE = 'RECORDS_RECEIVE'

export function receiveRecords (data) {
  return {
    type: RECORDS_RECEIVE,
    payload: data
  }
}

export function fetchRecords (query = '') {
  return function (dispatch) {
    dispatch({ type: RECORDS_REQUEST })

    const req = api.getScheduleRequests(query)

    req.then(({ data: { data } }) => {
      dispatch(receiveRecords(data))
    })

    return req
  }
}

export const REMOVE_RECORD_REQUEST = 'REMOVE_RECORD_REQUEST'

export const RECORDS_RECEIVE_AFTER_REMOVE = 'RECORDS_RECEIVE_AFTER_REMOVE'

export function receiveRecordsAfterRemove (id) {
  return {
    type: RECORDS_RECEIVE_AFTER_REMOVE,
    payload: id
  }
}

export function removeRequest (id) {
  return function (dispatch) {
    const _id = id
    dispatch({ type: REMOVE_RECORD_REQUEST })

    const req = api.removeRequest(id)

    req.then(() => {
      dispatch(receiveRecordsAfterRemove(_id))
    })

    return req
  }
}

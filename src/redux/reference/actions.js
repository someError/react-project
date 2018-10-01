import api from '../../api'

export const REFERENCE_REQUEST = 'REFERENCE_REQUEST'

export function requestReference (type) {
  return {
    type: REFERENCE_REQUEST,
    payload: {
      referenceType: type
    }
  }
}

export function fetchReference (type = '') {
  return function (dispatch) {
    dispatch(requestReference(type))

    const req = api.getReference(type)

    req.then(({ data: { data } }) => {
      dispatch(receiveReference(type, data.items))
    })

    return req
  }
}

export const REFERENCE_RECEIVE = 'REFERENCE_RECEIVE'

export function receiveReference (type, data) {
  return {
    type: REFERENCE_RECEIVE,
    payload: {
      referenceType: type,
      data: data
    }
  }
}

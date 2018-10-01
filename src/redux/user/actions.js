import api from '../../api'

export const USER_REQUEST = 'USER_REQUEST'

export const USER_RECEIVE = 'USER_RECEIVE'

export function receiveUser (data) {
  return {
    type: USER_RECEIVE,
    payload: data
  }
}

export function fetchUser () {
  return function (dispatch) {
    dispatch({ type: USER_REQUEST })

    const req = api.getUser()

    req
      .then(({ data: { data } }) => {
        dispatch(receiveUser(data))
      })
      .catch((e) => {
        dispatch(receiveUser(null))
      })

    return req
  }
}

export const USER_CHANGE = 'USER_CHANGE'

export function changeUser (data) {
  return function (dispatch) {
    dispatch({ type: USER_CHANGE, payload: data })
  }
}

export const USER_INVALIDATE = 'USER_INVALIDATE'

export function invalidateUser () {
  return {
    type: USER_INVALIDATE
  }
}

export const SOS_CARD_RECEIVE = 'SOS_CARD_RECEIVE'

export function receiveSosCard (data) {
  return {
    type: SOS_CARD_RECEIVE,
    payload: data
  }
}

export function fetchSosCard () {
  return function (dispatch) {
    const req = api.getEmergenciesCard()
    req
      .then(({ data: { data } }) => {
        dispatch(receiveSosCard(data))
      })
      .catch(() => {
        dispatch(receiveSosCard(null))
      })

    return req
  }
}

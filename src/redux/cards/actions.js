import api from '../../api'

export const CARDS_REQUEST = 'CARD_REQUEST'

export const CARDS_RECEIVE = 'CARD_RECEIVE'

export function receiveCards (data) {
  return {
    type: CARDS_RECEIVE,
    payload: data
  }
}

export function fetchCards () {
  return function (dispatch) {
    dispatch({ type: CARDS_REQUEST })

    const req = api.getUser()

    req.then(({ data: { data } }) => {
      dispatch(receiveCards(data))
    })

    return req
  }
}

const CARD_RECORDS_REQUEST = 'CARD_RECORDS_REQUEST'

export function fetchCardRecords (id, query) {
  return function (dispatch) {
    dispatch({ type: CARD_RECORDS_REQUEST })

    const req = api.getCardRecords(id, query)

    return req
  }
}

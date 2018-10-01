import api from '../../api'

export const ORGANIZATIONS_REQUEST = 'ORGANIZATIONS_REQUEST'

export const ORGANIZATIONS_RECEIVE = 'ORGANIZATIONS_RECEIVE'

export function receiveOrganizations (data) {
  return {
    type: ORGANIZATIONS_RECEIVE,
    payload: data
  }
}

export function fetchOrganizations (query) {
  return function (dispatch) {
    dispatch({ type: ORGANIZATIONS_REQUEST })

    const req = api.getOrganizations(query)

    req.then(({ data: { data } }) => {
      dispatch(receiveOrganizations(data))
    })

    return req
  }
}

export const ORG_DETAIL_REQUEST = 'ORG_DETAIL_REQUEST'

export const ORG_DETAIL_RECEIVE = 'ORG_DETAIL_RECEIVE'

export function receiveOrgDetail (data) {
  return {
    type: ORG_DETAIL_RECEIVE,
    payload: data
  }
}

export function fetchOrgDetail (id) {
  return function (dispatch) {
    dispatch({ type: ORG_DETAIL_REQUEST })

    const req = api.getOrgDetail(id)

    req.then(({ data: { data } }) => {
      dispatch(receiveOrgDetail(data))
    })

    return req
  }
}

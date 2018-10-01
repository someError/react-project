import api from '../../api'

export const PATIENTS_REQUEST = 'PATIENTS_REQUEST'

export const PATIENTS_RECEIVE = 'PATIENTS_RECEIVE'

export function receivePatients (data) {
  return {
    type: PATIENTS_RECEIVE,
    payload: data
  }
}

export function fetchPatients (query, self = false) {
  return function (dispatch) {
    dispatch({ type: PATIENTS_REQUEST })
    let req

    if (self) {
      req = api.getDoctorPatients(query)
    } else {
      req = api.getPatients(query)
    }

    req && req.then(({ data: { data } }) => {
      dispatch(receivePatients(data))
    })

    return req
  }
}

import api from '../../api'

export const DOCTORS_REQUEST = 'DOCTORS_REQUEST'

export const DOCTORS_RECEIVE = 'DOCTORS_RECEIVE'

export function receiveDoctors (data) {
  return {
    type: DOCTORS_RECEIVE,
    payload: data
  }
}

export function fetchDoctors (query) {
  return function (dispatch) {
    dispatch({ type: DOCTORS_REQUEST })

    const req = api.getDoctors(query)

    req.then(({ data: { data } }) => {
      dispatch(receiveDoctors(data))
    })

    return req
  }
}

export const DOCTOR_DETAIL_REQUEST = 'DOCTOR_DETAIL_REQUEST'

export const DOCTOR_DETAIL_RECEIVE = 'DOCTOR_DETAIL_RECEIVE'

export function receiveDoctorDetail (data) {
  return {
    type: DOCTOR_DETAIL_RECEIVE,
    payload: data
  }
}

export function fetchDoctorDetail (id) {
  return function (dispatch) {
    dispatch({ type: DOCTOR_DETAIL_REQUEST })

    const req = api.getDoctorDetail(id)

    req.then(({ data: { data } }) => {
      dispatch(receiveDoctorDetail(data))
    })

    return req
  }
}

import api from '../../api'

export const QUEUES_REQUEST = 'QUEUES_REQUEST'

export const QUEUES_RECEIVE = 'QUEUES_RECEIVE'

export function receiveQueues (data) {
  return {
    type: QUEUES_RECEIVE,
    payload: data
  }
}

export function fetchQueues (query) {
  return function (dispatch) {
    dispatch({ type: QUEUES_REQUEST })

    const req = api.getQueues(query)

    req.then(({ data: { data } }) => {
      dispatch(receiveQueues(data))
    })

    return req
  }
}

export const QUEUE_CLEAR = 'QUEUE_CLEAR'

export function clearQueue (queue) {
  return function (dispatch) {
    dispatch({ type: QUEUE_CLEAR })
    const req = api.clearQueue(queue)
    return req
  }
}

export const QUEUE_DELETE = 'QUEUE_DELETE'

export function deleteQueue (queue) {
  return function (dispatch) {
    dispatch({
      type: QUEUE_DELETE,
      queue
    })
    const req = api.clearQueue(queue, true)
    return req
  }
}

export const QUEUE_DETAIL_REQUEST = 'QUEUE_DETAIL_REQUEST'

export const QUEUE_DETAIL_RECEIVE = 'QUEUE_DETAIL_RECEIVE'

export function receiveQueueDetail (data) {
  return {
    type: QUEUE_DETAIL_RECEIVE,
    payload: data
  }
}

export function fetchQueueDetail (queue) {
  return function (dispatch) {
    dispatch({ type: QUEUE_DETAIL_REQUEST })

    const req = api.getQueueDetail(queue)

    req.then(({ data: { data } }) => {
      dispatch(receiveQueueDetail(data))
    })

    return req
  }
}

export const TIME_BOXES_REQUEST = 'TIME_BOXES_REQUEST'

export const TIME_BOXES_RECEIVE = 'TIME_BOXES_RECEIVE'

export function receiveTimeBoxes (data, queue) {
  return {
    type: TIME_BOXES_RECEIVE,
    payload: data,
    queue
  }
}

export function fetchTimeBoxes (query, queue = null) {
  return function (dispatch) {
    dispatch({ type: TIME_BOXES_REQUEST })

    const req = api.getQueueTimeboxes(query)

    req.then(({ data: { data } }) => {
      dispatch(receiveTimeBoxes(data, queue))
    })

    return req
  }
}

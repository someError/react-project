import {
  QUEUES_REQUEST,
  QUEUES_RECEIVE,
  QUEUE_DETAIL_REQUEST,
  QUEUE_DETAIL_RECEIVE,
  TIME_BOXES_REQUEST,
  TIME_BOXES_RECEIVE,
  QUEUE_CLEAR,
  QUEUE_DELETE
} from './actions'
import store from '../store'
import moment from 'moment'

const DEFAULT_STATE = {
  detail: {},
  timeBoxes: {},
  loading: true,
  timeBoxLoading: true
}

export default function queues (state = DEFAULT_STATE, action) {
  const type = action.type
  const payload = action.payload
  let _queues = store && store.getState().queues.items
  let timeBoxes = store && store.getState().queues.timeBoxes
  let detail = store && store.getState().queues.detail

  switch (type) {
    case QUEUES_REQUEST:
      return {
        ...state,
        loading: true
      }

    case QUEUES_RECEIVE:
      return {
        ...state,
        ...payload,
        loading: false

      }

    case QUEUE_DETAIL_REQUEST:
      return {
        ...state,
        detailLoading: true
      }

    case 'QUEUE_DETAIL_CHANGE':
      if (!detail) detail = {}
      detail[payload.id] = payload
      return {
        ...state,
        detail: detail
      }

    case QUEUE_DETAIL_RECEIVE:
      if (!detail) detail = {}
      detail[payload.id] = payload
      return {
        ...state,
        detailLoading: false,
        detail: detail
      }

    case TIME_BOXES_REQUEST:
      return {
        ...state,
        timeBoxLoading: true,
        timeBoxes: {}
      }

    case TIME_BOXES_RECEIVE:
      if (!timeBoxes) timeBoxes = {}
      if (action.queue && timeBoxes[action.queue]) {
        delete timeBoxes[action.queue]
      }

      if (payload.items.length) {
        // const sortedTimeBoxes = JSON.parse(JSON.stringify(payload.items))
        const sortedTimeBoxes = payload.items.sort((a, b) => {
          return moment(a.startTime).valueOf() - moment(b.startTime).valueOf()
        })

        let prevWeekDay = 0
        let i = 0

        sortedTimeBoxes.map((item) => {
          if (moment.utc(item.startTime).weekday() !== prevWeekDay) i = 0
          if (!timeBoxes[item.queue.id]) {
            timeBoxes[item.queue.id] = {}
          }
          if (!timeBoxes[item.queue.id][moment.utc(item.startTime).weekday()]) {
            timeBoxes[item.queue.id][moment.utc(item.startTime).weekday()] = []
          }
          item.recordKey = i
          timeBoxes[item.queue.id][moment.utc(item.startTime).weekday()].push(item)
          prevWeekDay = moment.utc(item.startTime).weekday()
          i++
        })
      }

      return {
        ...state,
        timeBoxLoading: false,
        timeBoxes: timeBoxes
      }

    case 'TIME_BOX_PUSH':
      timeBoxes[payload.queue.id][moment.utc(payload.startTime).weekday()].push(payload)
      return {
        ...state,
        timeBoxLoading: false,
        timeBoxes: timeBoxes
      }

    // case 'FILTER_TIME_BOXES':
    //
    //   return {
    //     ...state,
    //     timeBoxLoading: false,
    //     // timeBoxes: timeBoxes
    //   }

    case QUEUE_DELETE:
      _queues = _queues.filter((queue) => { return queue.id !== action.queue })
      if (timeBoxes[action.queue]) delete timeBoxes[action.queue]
      delete _queues[action.queue]
      return {
        ...state,
        items: _queues
      }

    case QUEUE_CLEAR:
      return {
        ...state,
        loading: false,
        items: payload.items
      }

    case 'QUEUES_ADD_RECORD':
      if (!timeBoxes[action.queue] || !timeBoxes[action.queue][action.day]) {
        return {...state}
      }

      let key = action.key
      if (typeof key !== 'number') key = timeBoxes[action.queue][action.day].length - 1

      timeBoxes[action.queue][action.day][key]['status'] = 'not_confirmed'
      timeBoxes[action.queue][action.day][key]['request'] = payload
      // const sortedTimeBoxes = JSON.parse(JSON.stringify(timeBoxes[action.queue][action.day]))
      const sortedTimeBoxes = timeBoxes[action.queue][action.day].sort((a, b) => {
        return moment(a.startTime).valueOf() - moment(b.startTime).valueOf()
      })
      sortedTimeBoxes.map((timeBox, i) => {
        timeBox.recordKey = i
      })
      timeBoxes[action.queue][action.day] = sortedTimeBoxes
      return {
        ...state,
        timeBoxes: timeBoxes
      }
    default:
      return state
  }
}

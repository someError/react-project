import React, { Component } from 'react'
import moment from 'moment'
import qs from 'qs'
import { injectIntl, defineMessages } from 'react-intl'
import classNames from 'classnames'
import { connect } from 'react-redux'
import MediaQuery from '../../../../components/MediaQuery'
import { parseSearchString, mergeFilters } from '../../../../util'
import './ScheduleDayPicker.css'
import OverlaySpinner from '../../../../components/Loader/OverlaySpinner'

const intlMessages = defineMessages({
  receptionsPlural: {
    id: 'receptions.plural',
    defaultMessage: `{total, plural, one {запись} few {записи} other {записей}}`
  },
  cellsPlural: {
    id: 'cells.plural',
    defaultMessage: `{total, plural, one {свободная ячейка} few {свободные ячейки} other {свободных ячеек}}`
  }
})

class ScheduleDayPicker extends Component {
  constructor (props) {
    super()
    const _search = parseSearchString(props.location.search)
    const _curDate = _search && _search.filter && _search.filter.date
    this.state = {
      activeDay: moment(_curDate || new Date()).weekday(),
      days: null
    }
    this.getDaysTimeBoxes = this.getDaysTimeBoxes.bind(this)
  }

  getDaysTimeBoxes (props) {
    const { timeBoxes } = props
    const days = {}
    Array.apply(null, new Array(7)).map((k, i) => {
      days[i] = []
      Object.keys(timeBoxes).map((key) => {
        if (!timeBoxes[key][i]) return
        timeBoxes[key][i].map((timeBox) => {
          days[i].push(timeBox)
        })
      })
    })
    this.setState({
      days: days
      // daysRecords: daysRecords
    })
  }

  componentDidMount () {
    this.getDaysTimeBoxes(this.props)
  }

  componentWillReceiveProps (nextProps) {
    this.getDaysTimeBoxes(nextProps)
  }

  // componentWillReceiveProps () {
  //   const { queues } = this.props
  //   const days = {}
  //   const daysRecords = {}
  //   Array.apply(null, new Array(7)).map((k, i) => {
  //     days[i] = []
  //     daysRecords[i] = {}
  //     daysRecords[i].total = 0
  //     daysRecords[i].free = 0
  //     Object.keys(queues.timeBoxes).map((key) => {
  //       if (!queues.timeBoxes[key][i]) return
  //       queues.timeBoxes[key][i].map((timeBox) => {
  //         days[i].push(timeBox)
  //         daysRecords[i].total += 1
  //         if (timeBox.status === 'free') daysRecords[i].free += 1
  //       })
  //     })
  //   })
  //   this.setState({
  //     days: days,
  //     daysRecords: daysRecords
  //   })
  // }

  render () {
    const { props, state } = this
    const { location, intl } = props
    const _search = parseSearchString(location.search)
    const _curDate = _search && _search.filter && _search.filter.date

    const query = parseSearchString(location.search)
    const filter = query.filter || {}

    return (
      <div className='scroll-wrap'>
        <div className='schedule-day-picker'>
          {
            state.days && Object.keys(state.days).map((key) => {
              // const totalCnt = state.days[key].length
              const freeCnt = state.days[key].filter((day) => { return day.status === 'free' }).length
              // const notConfirmCnt = state.days[key].filter((day) => { return day.status === 'not_confirmed' }).length
              // const competedCnt = state.days[key].filter((day) => { return day.status === 'completed' }).length
              const confirmedCnt = state.days[key].filter((day) => { return day.status === 'confirmed' }).length
              // const canceledCnt = state.days[key].filter((day) => {
              //   return day.status === 'patient_missing' || day.status === 'patient_canceled'
              // }).length
              return (
                <div
                  onClick={() => {
                    // !state.days[key].length ||
                    if (Number(state.activeDay) === Number(key)) return
                    this.setState({activeDay: key})
                    this.props.history.push({
                      // pathname: location.url,
                      search: qs.stringify({
                        ...query,
                        filter: mergeFilters(filter, {
                          date: moment((query.filter && query.filter.date) || new Date()).weekday(key).format()
                        })
                      })
                    })
                    props.onClick(key)
                  }}
                  className={`schedule-day-picker__item
                  ${classNames({
                  'active': Number(moment((query.filter && query.filter.date) || new Date()).weekday()) === Number(key),
                  'disabled': !state.days[key].length
                })}
                `}
                  key={`schedule-picker-${key}`}
                >
                  <div className='schedule-day-picker__item-header'>
                    {moment(_curDate || new Date()).utc().weekday(Number(key)).format('dd')}, {moment(_curDate || new Date()).weekday(Number(key)).format('DD')}
                  </div>
                  {
                    state.days[key].length ? (
                      props.loading ? (
                        <OverlaySpinner />
                      ) : (
                        <div className='schedule-day-picker__item-cont'>
                          {/* <div>записи</div> */}
                          <MediaQuery rule='(min-width: 768px)'>
                            <div className='schedule-day-picker__item-progress'>{ confirmedCnt }</div>
                          </MediaQuery>
                          <div>
                            <MediaQuery rule='(max-width: 767px)'><span>{ confirmedCnt } </span></MediaQuery>
                            { intl.formatMessage(intlMessages.receptionsPlural, { total: confirmedCnt }) }
                          </div>
                          {
                            freeCnt ? (
                              <div className='schedule-day-picker__free-row color-green'>{ freeCnt } {
                                intl.formatMessage(intlMessages.cellsPlural, { total: freeCnt })
                              }
                              </div>
                            ) : null
                          }
                          {/* <div> */}
                          {/* { */}
                          {/* canceledCnt ? <span className='schedule-day-picker__item-notify schedule-day-picker__item-notify--canceled'> */}
                          {/* { canceledCnt } */}
                          {/* </span> : null */}
                          {/* } */}
                          {/* { */}
                          {/* confirmedCnt ? <span className='schedule-day-picker__item-notify schedule-day-picker__item-notify--confirm'> */}
                          {/* { confirmedCnt } */}
                          {/* </span> : null */}
                          {/* } */}
                          {/* { */}
                          {/* freeCnt ? <span className='schedule-day-picker__item-notify'> */}
                          {/* { freeCnt } */}
                          {/* </span> : null */}
                          {/* } */}
                          {/* { */}
                          {/* notConfirmCnt ? <span className='schedule-day-picker__item-notify schedule-day-picker__item-notify--not-confirm'> */}
                          {/* { notConfirmCnt } */}
                          {/* </span> : null */}
                          {/* } */}
                          {/* </div> */}
                        </div>
                      )
                    ) : null
                  }
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ queues, user }) => {
  return {
    queues,
    user
  }
}

export default injectIntl(connect(mapStateToProps)(ScheduleDayPicker))

import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment-timezone'
import qs from 'qs'
import { connect } from 'react-redux'
import classNames from 'classnames'
import Button from '../../../components/Button'
import { Card, CardBody } from '../../../components/Card'
import { Tile, TileIcon, TileContent, TileAction } from '../../../components/Tile'
import './ScheduleMain.css'
import ScheduleDayPicker from './EntityViews/ScheduleDayPicker'
import { fetchQueues, fetchTimeBoxes, fetchQueueDetail, deleteQueue } from '../../../redux/queue/actions'
import { parseSearchString, getUtcString } from '../../../util'
import { Spinner } from '../../../components/Loader'
import Template from '../../../components/Template'
import FeatherIcon from '../../../components/Icons/FeatherIcon'
import ScheduleDetail from './ScheduleDetail'
import Modal from '../../../components/Modal'
import axios from 'axios'
import MediaQuery from '../../../components/MediaQuery'

const TIME_STATUSES = {
  free: {
    label: 'Свободна',
    className: 'color-green'
  },
  confirmed: {
    label: 'Визит назначен',
    className: 'color-yellow'
  },
  not_confirmed: {
    label: 'Не подтвержена',
    className: 'color-purple'
  },
  completed: {
    label: 'Визит состоялся',
    className: 'color-gray'
  },
  patient_canceled: {
    label: 'Отменен',
    className: 'color-red'
  },
  patient_missing: {
    label: 'Пропущен',
    className: 'color-red'
  }
}

const TimeBoxRow = ({onAccessClick, timeBox, search, active, onClick, timezone}) => {
  const _timezone = timezone.value / 3600
  const _startTime = moment(timeBox.startTime).utcOffset(_timezone).valueOf()
  const _nowTime = moment.tz(moment().format('YYYY-MM-DDTHH:mm'), timezone.name).valueOf()
  console.log(_startTime)
  return (
    <div className={classNames('schedule-main-table__row-wrap', {active})}>
      <Tile onClick={renderButtons(timeBox) ? onClick : null}
        className={`schedule-main-table__row ${classNames({'row--completed': timeBox.status === 'completed'})}`}>
        <TileContent>
          <TileIcon>
            {
              timeBox.request || _nowTime > _startTime ? (
                moment(timeBox.startTime).utcOffset(_timezone).format('HH:mm') + '—' + moment(timeBox.endTime).utcOffset(_timezone).format('HH:mm')
              ) : (
                <Link
                  to={{
                    pathname: `/cabinet/schedule/record`,
                    search,
                    state: {timeBox, search}
                  }}
                >
                  {moment(timeBox.startTime).utcOffset(_timezone).format('HH:mm') + '—' + moment(timeBox.endTime).utcOffset(_timezone).format('HH:mm')}
                </Link>
              )
            }
          </TileIcon>
          <TileContent className='schedule-main-table__row-event'>
            {
              timeBox.request ? (
                <span>{`${timeBox.request.patient.firstName} ${timeBox.request.patient.lastName}`}</span>
                // <Link className='schedule-main-table__row-name' to={`/cabinet/patients/${timeBox.request.patient.id}`}>
                // </Link>
              ) : <span>Нет событий</span>
            }
          </TileContent>
        </TileContent>
        <TileAction>
          <Tile>
            <TileContent
              className={`${classNames(TIME_STATUSES[timeBox.status]['className'])} schedule-main-table__row-status`}>
              <div>{TIME_STATUSES[timeBox.status]['label']}</div>
              {
                renderButtons(timeBox)
                  ? (
                    <MediaQuery rule='(max-width: 767px)'>
                      <FeatherIcon icon={`chevron-${active ? 'up' : 'down'}`} size={20} color='#787878'/>
                    </MediaQuery>
                  )
                  : null
              }
            </TileContent>
            <MediaQuery rule='(min-width: 768px)'>
              <TileAction>
                {renderButtons(timeBox, onAccessClick)}
              </TileAction>
            </MediaQuery>
          </Tile>
        </TileAction>
      </Tile>
      <MediaQuery rule='(max-width: 767px)'>
        <div className='schedule-main-table__row-drop'>{renderButtons(timeBox, onAccessClick)}</div>
      </MediaQuery>
    </div>
  )
}

const renderButtons = (timeBox, onAccessClick) => {
  if (!timeBox.request || (timeBox.request && !timeBox.request.patient.card)) {
    return false
  } else if (!onAccessClick) {
    return true
  }
  return (
    <Template>
      {
        (timeBox.request && timeBox.request.patient.card && !timeBox.request.patient.card.access) && <Button
          round
          ghost
          onClick={() => onAccessClick(timeBox.request.patient)}
        >
          <FeatherIcon icon='lock' size={18}/>
        </Button>
      }
      {
        (timeBox.request && timeBox.request.patient.card && timeBox.request.patient.card.access) && <Button
          round
          ghost
          to={`/cabinet/cards/${timeBox.request.patient.card.id}/records`}
        >
          <FeatherIcon icon='file' size={18}/>
        </Button>
      }
      {/* <Button round to={{ pathname: `/` }}> */}
      {/* <FeatherIcon icon='plus' size={18} /> */}
      {/* </Button> */}
    </Template>
  )
}

class ScheduleMain extends Component {
  constructor (props) {
    super()
    const _search = parseSearchString(props.location.search)
    const _curDate = _search && _search.filter && _search.filter.date
    this.state = {
      timeBoxesLoading: true,
      queuesLoading: true,
      day: moment(_curDate || new Date()).weekday(),
      showDetail: false,
      patient: null,
      filteredTimeBoxes: null,
      initialPatientQuery: true,
      activeRow: null
    }
  }

  getQueues (query) {
    this.setState({queuesLoading: true})
    const parsedQuery = parseSearchString(query) || parseSearchString(this.props.location.search) || {}
    const _query = {}
    if (parsedQuery.my === 'true') _query.doctor = this.props.user.id
    if (parsedQuery.organizations === 'true') _query.organization = this.props.user.organizations[0].id

    this.req = this.props.fetchQueues(_query)
    this.req
      .then(({data: {data}}) => {
        if (!data.items.length) {
          this.setState({
            timeBoxesLoading: false,
            queuesLoading: false
          })
          return
        }
        this.getTimeBoxes(data, query)
          .then(() => {
            this.setState({
              queuesLoading: false,
              timeBoxesLoading: false
            })
          })
      })
      .catch(() => {
        this.setState({
          timeBoxesLoading: false,
          queuesLoading: false
        })
      })
  }

  getTimeBoxes (data, query) {
    this.setState({timeBoxesLoading: true})
    query = parseSearchString(query) || parseSearchString(this.props.location.search) || {}
    const _dates = {}
    const _query = {}
    _query.statuses = query.statuses || {}
    // if (query.patient) _query.patientName = query.patient
    // const statuses = query.statuses || {}
    _dates.filter = {}
    _dates.filter.startTime = [
      {
        type: 'gt',
        value: moment.utc((query.filter && query.filter.date) ||
          moment(new Date()).format('YYYY-MM-DDThh:mm:ssZ')).startOf('week').format()
      },
      {
        type: 'lt',
        value: moment.utc((query.filter && query.filter.date) ||
          moment(new Date()).format('YYYY-MM-DDThh:mm:ssZ')).endOf('week').format()
      }
    ]
    const requests = []
    data.items.map((item, i) => {
      requests.push(
        this.props.fetchTimeBoxes(qs.stringify({
          queue: item.id,
          limit: 2000,
          ..._query,
          ..._dates
        })))
    })

    return axios.all(requests)
    // .then(() => { this.setState({ timeBoxesLoading: false }) })
  }

  showQueueDetail (queueId) {
    const {queues} = this.props
    if (!queues.detail[queueId] || queues.detail[queueId]['changed']) {
      this.setState({
        queueDetailLoading: true,
        showDetail: true
      })
      this.req = this.props.fetchQueueDetail(queueId)
      this.req.then(() => {
        this.setState({
          queueDetail: queues.detail[queueId],
          queueDetailLoading: false
        })
      })
    } else if (queues.detail[queueId] && !queues.detail[queueId]['changed']) {
      this.setState({
        queueDetail: queues.detail[queueId],
        showDetail: true
      })
    }
  }

  filterTimeBoxes (props, time = 0) {
    const _search = parseSearchString(props.location.search)
    // this.setState({timeBoxesLoading: true})
    const _timeBoxes = {}
    Object.keys(props.queues.timeBoxes).map((queueId) => {
      _timeBoxes[queueId] = {}
      Object.keys(props.queues.timeBoxes[queueId]).map((weekday) => {
        _timeBoxes[queueId][weekday] = props.queues.timeBoxes[queueId][weekday].filter((timeBox) => {
          if (timeBox.request) {
            const i = timeBox.request.patient && timeBox.request.patient.firstName.toLowerCase() + ' '
            const f = timeBox.request.patient && timeBox.request.patient.lastName.toLowerCase() + ' '
            const o = timeBox.request.patient.middleName && timeBox.request.patient.middleName.toLowerCase() + ' '
            return timeBox.request && _search.patient && (
              (f + i + o).indexOf(_search.patient.toLowerCase()) + 1 ||
              (f + o + i).indexOf(_search.patient.toLowerCase()) + 1 ||
              (i + f + o).indexOf(_search.patient.toLowerCase()) + 1 ||
              (i + o + f).indexOf(_search.patient.toLowerCase()) + 1 ||
              (o + f + i).indexOf(_search.patient.toLowerCase()) + 1 ||
              (o + i + f).indexOf(_search.patient.toLowerCase()) + 1
            )
          }
        })
      })
    })
    const promise = new Promise((resolve) => {
      window.setTimeout(() => {
        resolve(_timeBoxes)
      }, time)
    })
    return promise.then((timeBoxes) => {
      this.setState({filteredTimeBoxes: timeBoxes})
    })
  }

  componentDidMount () {
    // const _search = parseSearchString(this.props.location.search)
    this.getQueues(this.props.location.search)
  }

  componentWillReceiveProps (nextProps) {
    const {state} = this
    // const { user: { id } } = this.props
    const {history: {location}} = nextProps
    const _prevSearch = parseSearchString(this.props.location.search) || {}
    const _search = parseSearchString(nextProps.location.search)

    if (!_prevSearch.patient) _prevSearch.patient = ''

    if (location.state && location.state.getQueues) {
      this.props.history.replace({state: null})
      this.getQueues()
    }

    if (_search.patient && state.initialPatientQuery && Object.keys(nextProps.queues.timeBoxes).length) {
      // this.setState({initialPatientQuery: false})
      this.filterTimeBoxes(nextProps)
        .then(filtered => {
          this.setState({
            filteredTimeBoxes: filtered,
            initialPatientQuery: false
          })
        })
    }

    if (nextProps.location.pathname === this.props.location.pathname &&
      !(nextProps.location.search === this.props.location.search)) {
      const _curDate = _search && _search.filter && _search.filter.date
      const _prevDate = (_prevSearch && _prevSearch.filter && _prevSearch.filter.date) || new Date()
      if (state.day !== moment(_curDate).weekday() && _curDate) {
        this.setState({day: moment(_curDate || new Date()).weekday()})
      }

      if (
        moment(_curDate).valueOf() > moment(_prevDate).endOf('week').valueOf() ||
        moment(_curDate).valueOf() < moment(_prevDate).startOf('week').valueOf() ||
        _prevSearch.my !== _search.my || _prevSearch.organizations !== _search.organizations
      ) {
        this.setState({filteredTimeBoxes: null})
        this.getQueues(nextProps.location.search)
      }

      if ((!_prevSearch.statuses && _search.statuses) || (_prevSearch.statuses && !_search.statuses) ||
        (_search.statuses && (_search.statuses.length !== _prevSearch.statuses.length))
      ) {
        // this.setState({timeBoxesLoading: true})
        this.getTimeBoxes(nextProps.queues, nextProps.location.search)
          .then(() => {
            this.setState({timeBoxesLoading: false})
            // this.filterTimeBoxes(this.props)
            //     .then(() => this.setState({timeBoxesLoading: false}))
          })
      }

      if (
        ((_search.patient && _search.patient.length && !_prevSearch.patient) ||
          (_search.patient && _search.patient.length && (_search.patient.length !== _prevSearch.patient.length)))
      ) {
        this.filterTimeBoxes(nextProps, 200)
          .then(() => this.setState({timeBoxesLoading: false}))
      } else if (_prevSearch.patient && !_search.patient) {
        this.setState({timeBoxesLoading: true})
        window.setTimeout(() => {
          this.setState({
            filteredTimeBoxes: null,
            timeBoxesLoading: false
          })
        }, 210)
      }
    }
  }

  render () {
    const {state, props} = this
    const {match, queues, queues: {timeBoxes}, user} = this.props
    return (
      <div className='schedule-main'>
        <header className='page-header'>
          <h2>
            Расписание
            <div className='title-btns'>
              <Button size='sm' to={`${match.url}/add`}>Создать расписание</Button>
              {user.queuesCount ? <Button ghost size='sm' to={`${match.url}/record`}>Записать пациента</Button> : null}
            </div>
          </h2>
        </header>
        {
          queues.loading || state.queuesLoading ? (
            <Spinner />
          ) : (
            <Template>
              {
                queues.items.length ? <Card className='card--content schedule-nav list-item'>
                  <CardBody>
                    {
                      queues.items.map((queue, i) => {
                        return (
                          <Tile key={`schedule-nav-${i}-${queue.id}`} className='schedule-nav__row'>
                            <TileContent>
                              <a
                                onClick={(e) => {
                                  e.preventDefault()
                                  this.showQueueDetail(queue.id)
                                }}
                                href='#'
                                className='schedule-nav__row-title'>
                                {queue.title}
                              </a>
                              {
                                queue.status === 'active' && (
                                  <div className='schedule-nav__row-btns'>
                                    <FeatherIcon
                                      className='schedule-nav__row-item'
                                      onClick={() => {
                                        this.showQueueDetail(queue.id)
                                      }}
                                      icon='info'
                                      size={17}
                                    />
                                    <Link
                                      className='schedule-nav__row-item'
                                      to={`${match.url}/edit/${queue.id}`}>
                                      <FeatherIcon icon='edit-2' size={15}/>
                                    </Link>
                                    <FeatherIcon
                                      onClick={() => {
                                        props.deleteQueue(queue.id)
                                      }}
                                      className='schedule-nav__row-item'
                                      icon='x'
                                      size={15} />
                                  </div>
                                )
                              }

                              { (queue.status === 'new' || queue.status === 'pending') && (
                                <span className='color-green' style={{paddingTop: 4 + 'px'}}>Создается</span>
                              )}

                              { queue.status === 'removing' && <span className='color-red' style={{paddingTop: 4 + 'px'}}>Удаляется</span> }
                            </TileContent>
                            <TileAction>
                              { moment(queue.timeboxTimeFrom).utcOffset(user.timezone.value / 3600).format('HH:mm') + '—' + moment(queue.timeboxTimeTo).utcOffset(user.timezone.value / 3600).format('HH:mm') }
                            </TileAction>
                          </Tile>
                        )
                      })
                    }
                  </CardBody>
                </Card> : null
              }
              <ScheduleDayPicker
                {...props}
                loading={state.timeBoxesLoading}
                timeBoxes={state.filteredTimeBoxes || timeBoxes}
                onClick={day => {
                  this.setState({day: day})
                }}
              />
              <div className='spinner-wrap'>
                {
                  state.timeBoxesLoading ? <Spinner /> : (
                    queues.items.map((queue, queueIndex) => {
                      if (!timeBoxes[queue.id] || !timeBoxes[queue.id][state.day]) return

                      return (
                        <Card key={queue.id + queueIndex} className='card--content schedule-main-table list-item'>
                          <CardBody>
                            <div className='schedule-main-table__title'>
                              {queue.title}
                              <Button round to={{
                                pathname: `${match.url}/edit/${queue.id}`,
                                search: `${props.location.search}`
                              }}>
                                <FeatherIcon icon='plus' size={18} />
                              </Button>
                            </div>
                            <MediaQuery rule='(min-width: 768px)'>
                              <Tile className='schedule-main-table__row schedule-main-table__row--th'>
                                <TileContent>
                                  <TileIcon>Время</TileIcon>
                                  <TileContent>Пациент</TileContent>
                                </TileContent>
                                <TileAction>
                                  Статус записи
                                </TileAction>
                              </Tile>
                            </MediaQuery>
                            {
                              ((state.filteredTimeBoxes &&
                                state.filteredTimeBoxes[queue.id] &&
                                state.filteredTimeBoxes[queue.id][state.day]) ||
                                timeBoxes[queue.id][state.day]).map((timeBox, i) => {
                                  const qIndex = queueIndex.toString()
                                  return (
                                    <TimeBoxRow
                                      onAccessClick={(patient) => {
                                        this.setState({
                                          showRequestAccessModal: true,
                                          patient
                                        })
                                      }}
                                      onClick={() => {
                                        if (state.activeRow !== qIndex + i) {
                                          this.setState({activeRow: qIndex + i})
                                        } else {
                                          this.setState({activeRow: null})
                                        }
                                      }}
                                      active={state.activeRow === qIndex + i}
                                      key={timeBox.id + i}
                                      timeBox={timeBox}
                                      search={props.location.search}
                                      timezone={user.timezone}
                                    />
                                  )
                                })
                            }
                          </CardBody>
                        </Card>
                      )
                    })
                  )
                }
              </div>
            </Template>
          )
        }
        {
          state.showDetail && <Modal
            onRequestClose={() => {
              this.setState({showDetail: false})
            }}
          >
            <Card className='card--content'>
              <CardBody>
                {
                  state.queueDetailLoading ? (
                    <Spinner />
                  ) : (
                    <ScheduleDetail {...state.queueDetail} timezone={user.region.timezone.value / 3600} deleteQueue={() => {
                      props.deleteQueue(state.queueDetail.id)
                      this.setState({showDetail: false})
                    }} />
                  )
                }
              </CardBody>
            </Card>
          </Modal>
        }
      </div>
    )
  }
}

const mapStateToProps = ({queues, user}) => {
  return {
    queues,
    user
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchQueues: function (query) {
      return dispatch(fetchQueues(query))
    },
    fetchTimeBoxes: function (query) {
      return dispatch(fetchTimeBoxes(query))
    },
    fetchQueueDetail: function (queue) {
      return dispatch(fetchQueueDetail(queue))
    },
    deleteQueue: function (queue) {
      return dispatch(deleteQueue(queue))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleMain)

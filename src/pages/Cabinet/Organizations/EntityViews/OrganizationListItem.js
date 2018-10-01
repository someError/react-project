import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import moment from 'moment'
import qs from 'qs'

import api from '../../../../api'
import { Card, CardBody } from '../../../../components/Card'
import { Spinner, OverlaySpinner } from '../../../../components/Loader'
import { Tile, TileContent, TileIcon, TileAction } from '../../../../components/Tile'
import { Avatar } from '../../../../components/Avatar'
import Button from '../../../../components/Button'
import FeatherIcon from '../../../../components/Icons/FeatherIcon'

import { DoctorScheduleForm, DoctorScheduleTimeRow } from '../../../../components/DoctorScheduleForm'
import { fetchTimeBoxes, fetchQueues } from '../../../../redux/queue/actions'

import { Select, DateInput } from '../../../../components/Form'
import RequestModal from '../Form/RequestModal'
import RequestAccessModal from '../Form/RequestAccessModal'
import Modal from '../../../../components/Modal'

class DoctorListItem extends Component {
  constructor (props) {
    super()

    this.state = {
      showRequestAccessModal: false,
      date: null,
      timeBoxesLoading: false,
      timeBoxes: [],
      showRequestModal: false,
      postLoading: false,
      access: props.medicalCardInfo.access
    }
    this.onRequestSubmit = this.onRequestSubmit.bind(this)
  }

  getQueues () {
    this.props.fetchQueues({
      doctor: this.props.id,
      filter: {
        timeboxTimeTo: [
          {
            type: 'gt',
            value: moment().format('YYYY-MM-DDTHH:mm:ssZ')
          }
        ]
      }
    })
  }

  getTimeBoxes (date = this.state.date, queue = this.state.queue && this.state.queue.id) {
    this.setState({timeBoxesLoading: true})
    this.timeBoxreq = api.getQueueTimeboxes(qs.stringify({
      queue: queue,
      limit: 50,
      filter: {
        startTime: [
          {
            type: 'gt',
            value: moment.utc(date).utcOffset('+00:00').startOf('day').format()
          },
          {
            type: 'lt',
            value: moment.utc(date).utcOffset('+00:00').endOf('day').format()
          }
        ]
      }
    }))
      .then(({data: {data}}) => {
        this.setState({
          timeBoxesLoading: false,
          timeBoxes: data.items
        })
      })
    return this.timeBoxreq
  }

  onRequestSubmit () {
    const { state, props } = this
    const { user } = props
    this.setState({
      postLoading: true
    })
    api.postScheduleRequest({
      patient: user.id,
      timeBox: state.timeBox.id,
      organization: props.id,
      phone: user.phone,
      email: user.email,
      birthday: user.birthday,
      fullName: user.fullName
    })
      .then(() => {
        const curTimeBox = state.timeBoxes.filter((timeBox) => { return timeBox.id === state.timeBox.id })
        curTimeBox[0].status = 'not_confirmed'
        this.setState({
          timeBoxes: state.timeBoxes,
          showConfirmModal: false,
          postLoading: false
        })
      })
      .catch((err) => {
        console.log(err)
        this.setState({postLoading: false})
      })
  }

  render () {
    const { props, state } = this
    const { queues } = props

    return <Card>
      <CardBody className='l-user-card'>
        <Tile>
          <TileContent className='l-user-card__content'>
            <TileIcon>
              <Avatar
                size='2xl'
                src={props.avatar ? props.avatar.url : null}
                // initial={props.firstName.charAt(0) + props.lastName.charAt(0)}
              />
            </TileIcon>
            <TileContent>
              <h4 className='doctor-name'>
                <Link to={`/cabinet/organizations/${props.id}`}>{props.name}</Link>
                { props.favorite && <FeatherIcon color='#FD5577' icon='heart' size={16} />}
              </h4>
              <div className='doctor-specialties'>
                {
                  props.specialties.map((specialty, i) => {
                    let str = specialty.name
                    if (props.specialties.length > (i + 1)) {
                      str += ', '
                    }
                    return str
                  })
                }
              </div>
              <div className='doctor-text'>
                {
                  props.serviceTypes.length ? (
                    props.serviceTypes.map((service, i) => {
                      return (
                        <span key={service.id}>{`${service.name}, `}</span>
                      )
                    })
                  ) : null
                }
              </div>
              <div className='doctor-contacts'>{ props.region.name }</div>
            </TileContent>
          </TileContent>
          <TileAction className='doctor-action l-user-card__action'>
            {
              state.access
                ? null
                : <Button
                  onClick={() => { this.setState({ showRequestAccessModal: true }) }}
                  className='doctor-action-button'
                  ghost
                  size='sm'
                >
                  <FeatherIcon icon='lock' size={16} /> <span>Предоставить доступ</span>
                </Button>
            }
            {
              props.queuesCount ? (
                <Button
                  to={{
                    pathname: `/cabinet/organizations/${props.id}`,
                    state: {scrollTo: 'workers'}
                  }}
                  className='doctor-action-button'
                  size='sm'>
                  Записаться на приём
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    this.setState({showRequestModal: true})
                  }}
                  className='doctor-action-button'
                  ghost
                  size='sm'>
                  Заявка на прием
                </Button>
              )
            }

          </TileAction>
        </Tile>
        {
          props.opened && (
            <DoctorScheduleForm
              id='form'
              onSubmit={(e) => {
                e.preventDefault()
                // const curTime = state.formDay + moment.utc(state.formTime * 3600 * 1000).valueOf()
                // alert(moment(curTime).format('DD MMM YYYY hh:mm a'))
              }}
            >
              <div className='doctor-schedule-form__options'>
                <div className='columns'>
                  <div className='column col-8'>
                    <Select
                      material
                      value={state.queue}
                      onChange={(e) => {
                        const _value = e.target.value
                        api.getQueuesDates({queue: e.target.value})
                          .then(({data: {data}}) => {
                            this.setState({availableDates: data})
                          })
                        this.setState({
                          queue: queues.items && queues.items.filter(queue => queue.id === _value)[0]
                        })
                      }}
                      label='Выберите очередь'
                    >
                      {
                        queues.items && queues.items.map((queue) => {
                          // if (!queues.timeBoxes[queue.id]) return
                          return <option key={`service-${queue.id}`} value={queue.id}>{ queue.title }</option>
                        })
                      }
                    </Select>
                  </div>

                  <div className='column col-4'>
                    <DateInput
                      disabled={!state.queue}
                      label='Дата посещения'
                      value={state.date && moment(this.state.date).format('DD.MM.YYYY')}
                      onDayChange={(date) => {
                        this.setState({
                          date: date && date.toDate()
                        })
                        date && this.getTimeBoxes(date.toDate())
                      }}
                      dayPickerProps={{
                        onDayClick: date => {
                          console.log(date)
                          this.setState({ date })
                          this.getTimeBoxes(date)
                        },
                        disabledDays: (day) => {
                          let recordBeforeHours
                          if (state.queue &&
                            ((state.queue.beforeMinimumHours && state.queue.beforeMinimumHours > 23) || (state.queue.beforeMinimumDays))
                          ) {
                            recordBeforeHours = state.queue.beforeMinimumHours || state.queue.beforeMinimumDays * 24
                          }
                          return (this.state.availableDates && this.state.availableDates.find((availableDate) => {
                            return moment(day).format('YYYY-MM-DD') === moment(availableDate).format('YYYY-MM-DD')
                          }) === undefined) || moment(day).startOf('day').isBefore(moment().startOf('day').add(recordBeforeHours, 'hours'))
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className='spinner-wrap'>
                {
                  state.timeBoxes.length ? (
                    <DoctorScheduleTimeRow
                      queue={state.queue}
                      timeBoxes={state.timeBoxes}
                      activeBox={state.timeBox && state.timeBox.id}
                      onClick={(timeBox) => {
                        this.setState({
                          timeBox: timeBox,
                          showConfirmModal: true
                        })
                      }}
                    />
                  ) : null
                }
                {
                  (state.timeBoxesLoading && !state.timeBoxes.length) ? <Spinner /> : null
                }
                {
                  (state.timeBoxesLoading && state.timeBoxes.length) ? <OverlaySpinner /> : null
                }
              </div>
            </DoctorScheduleForm>
          )
        }
      </CardBody>
      {
        state.showRequestModal && <RequestModal
          onRequestClose={() => {
            this.setState({showRequestModal: false})
          }}
          {...props}
        />
      }
      {
        state.showRequestAccessModal && <RequestAccessModal
          onRequestClose={() => {
            this.setState({showRequestAccessModal: false})
          }}
          organization={props.id}
          onSubmit={(data) => {
            this.setState({access: data})
          }}
        />
      }
      {
        state.showConfirmModal && <Modal
          onRequestClose={() => {
            this.setState({showConfirmModal: false})
          }}
        >
          <Card>
            <CardBody>
              <h1>Прием у врача в { moment(state.date).format('dddd') } <br />
                { moment(state.date).format('DD MMMM') } в { moment(state.timeBox.startTime).utcOffset('+00:00').format('HH:mm') }
              </h1>
              <span>Продолжительность приема { state.timeBox.queue.duration } минут.</span>
            </CardBody>
            <CardBody>Адрес: { props.region.name }</CardBody>
            <CardBody className='bg-orange'>
              <FeatherIcon icon='alert-circle' size={34} color='#FDAE55' style={{marginRight: 10}} />
              { state.timeBox.queue.advice }
            </CardBody>
            <CardBody>
              Очередь: {state.timeBox.queue.title}
            </CardBody>
            <CardBody>
              <Button
                loading={state.postLoading}
                onClick={this.onRequestSubmit}
              >
                Подтвердить
              </Button>
            </CardBody>
          </Card>
        </Modal>
      }
    </Card>
  }
}

const mapStateToProps = ({ reference, queues, patients, user }) => {
  return {
    queues,
    user
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchTimeBoxes: function (query, queue) {
      return dispatch(fetchTimeBoxes(query, queue))
    },
    fetchQueues: function (query) {
      return dispatch(fetchQueues(query))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DoctorListItem)

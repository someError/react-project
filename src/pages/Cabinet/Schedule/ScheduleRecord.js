import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { injectIntl, defineMessages } from 'react-intl'
import store from '../../../redux/store'
import { DoctorScheduleForm, DoctorScheduleHeader, DoctorScheduleTimeRow } from '../../../components/DoctorScheduleForm'
import api from '../../../api'
import { MaterialInput, Select, DateInput, TimeInput } from '../../../components/Form'
import linkState from 'linkstate'
import { fetchPatients } from '../../../redux/patients/actions'
import { fetchTimeBoxes, fetchQueues } from '../../../redux/queue/actions'
import Spinner from '../../../components/Loader/Spinner'
import Button from '../../../components/Button'
import Template from '../../../components/Template/index'
import './ScheduleAdd.css'
import OverlaySpinner from '../../../components/Loader/OverlaySpinner'
import qs from 'qs'

import commonIntlMessages from '../../../i18n/common-messages'

const intlMessages = defineMessages({
  recordTitle: {
    id: 'schedule.record.title',
    defaultMessage: 'Запись пациента на прием'
  },
  choosePatient: {
    id: 'schedule.record.label.choose_patient',
    defaultMessage: 'Выберите пациента'
  },
  phoneOptional: {
    id: 'schedule.label.phone',
    defaultMessage: 'Телефон (необязательно)'
  },
  chooseSchedule: {
    id: 'schedule.label.choose_schedule',
    defaultMessage: 'Расписание'
  },
  visitDate: {
    id: 'schedule.label.visit_date',
    defaultMessage: 'Дата посещения'
  },
  enrollBtn: {
    id: 'schedule.enroll.btn',
    defaultMessage: 'Записать'
  },
  setVisitTime: {
    id: 'schedule.set_visit_time',
    defaultMessage: 'Или введите новое время приема'
  }
})

class ScheduleRecord extends Component {
  constructor (props) {
    super(props)
    this.state = {
      patient: '',
      queue: '',
      timeBoxes: [],
      timeBox: null,
      date: null,
      postLoading: false,
      startTime: '',
      endTime: '',
      phone: ''
    }

    this.onSubmit = this.onSubmit.bind(this)
    this.getTimeBoxes = this.getTimeBoxes.bind(this)
  }

  componentDidMount () {
    const { queues, location } = this.props

    if (!queues.items) {
      this.props.fetchQueues(qs.stringify({
        filter: {
          timeboxTimeTo: [
            {
              type: 'gt',
              value: moment().format('YYYY-MM-DDTHH:mm:ssZ')
            }
          ]
        }
      }))
    }
    if (this.props.patientId) {
      this.setState({patient: this.props.patientId})
    }
    this.props.fetchPatients({patientType: 'all'})
      .then(() => {
        if (location && location.state) {
          if (location.state.timeBox) {
            this.setState({
              date: moment(location.state.timeBox.startTime).utc(),
              queue: location.state.timeBox.queue.id
            })
            api.getQueuesDates({queue: location.state.timeBox.queue.id})
              .then(({data: {data}}) => {
                this.setState({availableDates: data})
              })
          }

          this.getTimeBoxes(this.state.date)
            .then(() => {
              this.setState({timeBox: location.state.timeBox})
            })
        }
      })
  }

  getTimeBoxes (date = this.state.date, queue = this.state.queue) {
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

  sendRequest (_data) {
    api.postScheduleRequest(_data)
      .then(({data: {data}}) => {
        store.dispatch({
          type: 'QUEUES_ADD_RECORD',
          payload: data,
          day: moment(this.state.date).weekday(),
          queue: this.state.queue,
          key: (this.state.timeBox && this.state.timeBox.recordKey)
        })
        this.setState({ postLoading: false })
        const closeUrl = this.props.closeUrl && this.props.closeUrl.split('?')
        this.props.history && this.props.history.push({ pathname: closeUrl[0] || this.props.closeUrl, search: closeUrl[1] })
        this.props.onSuccess()
      })
      .catch((err) => {
        console.log(err)
        this.setState({ postLoading: false })
      })
  }

  onSubmit (e) {
    // const { user } = this.props
    const { patient, timeBox, birthday, email, phone, fullName, queue, date, startTime, endTime } = this.state
    e.preventDefault()
    this.setState({ postLoading: true })
    const _data = { patient, timeBox: timeBox && timeBox.id, birthday, email, phone, fullName }
    if (!timeBox) {
      api.postQueueTimeboxes({
        queue: queue,
        durations: [
          {
            startTime: moment.utc(date).utcOffset('+00:00').set({h: startTime.substr(0, 2), m: startTime.substr(3, 5)}).format(),
            endTime: moment.utc(date).utcOffset('+00:00').set({h: endTime.substr(0, 2), m: endTime.substr(3, 5)}).format()
          }
        ]
      })
        .then(({data: {data}}) => {
          store.dispatch({
            type: 'TIME_BOX_PUSH',
            payload: {
              ...data[0],
              recordKey: this.state.timeBoxes.length
            }
          })
          _data.timeBox = data[0].id
          this.sendRequest(_data)
        })
    } else {
      this.sendRequest(_data)
    }
  }

  render () {
    const { state, props } = this
    const { queues, patients, intl } = props

    return (
      <DoctorScheduleForm
        onSubmit={this.onSubmit}
      >
        <DoctorScheduleHeader title={intl.formatMessage(intlMessages.recordTitle)} />
        <div className='form-grid'>
          <div className='form-grid__group'>
            <div className='columns'>
              <div className='column col-8'>
                <Select
                  material
                  value={state.patient}
                  onChange={linkState(this, 'patient')}
                  label={intl.formatMessage(intlMessages.choosePatient)}
                >
                  {
                    patients.items && patients.items.map((patient) => {
                      return <option key={`patient-${patient.id}`} value={patient.id}>{ patient.firstName } {patient.lastName}</option>
                    })
                  }
                </Select>
              </div>
              <div className='column col-4'>
                <MaterialInput
                  phone
                  value={state.phone}
                  onChange={linkState(this, 'phone')}
                  label={intl.formatMessage(intlMessages.phoneOptional)}
                />
              </div>
            </div>
            <div className='form-grid__group'>
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
                      this.setState({queue: _value})
                    }}
                    label={intl.formatMessage(intlMessages.chooseSchedule)}
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
                    label={intl.formatMessage(intlMessages.visitDate)}
                    value={state.date && moment(this.state.date).format('DD.MM.YYYY')}
                    onDayChange={(date) => {
                      this.setState({
                        date: date && date.toDate()
                      })
                      date && this.getTimeBoxes(date.toDate())
                    }}
                    dayPickerProps={{
                      onDayClick: date => {
                        this.setState({ date })
                        this.getTimeBoxes(date)
                      },
                      disabledDays: (day) => {
                        return (this.state.availableDates && this.state.availableDates.find((availableDate) => {
                          return moment(day).format('YYYY-MM-DD') === moment(availableDate).format('YYYY-MM-DD')
                        }) === undefined) || moment(day).startOf('day').isBefore(moment().startOf('day'))
                      }
                    }}
                  />
                </div>
              </div>
            </div>
            <div className='spinner-wrap'>
              {
                state.timeBoxes.length ? (
                  <Template>
                    <div className='form-grid__group'>
                      <DoctorScheduleTimeRow
                        timeBoxes={state.timeBoxes}
                        activeBox={state.timeBox && state.timeBox.id}
                        onClick={(timeBox) => {
                          if (state.startTime || state.endTime) {
                            this.setState({
                              startTime: '',
                              endTime: ''
                            })
                          }
                          this.setState({timeBox: timeBox})
                        }}
                      />
                    </div>
                    <div className='form-grid__group'>
                      <div className='columns' style={{alignItems: 'center'}}>
                        <div className='column col-4'>
                          {intl.formatMessage(intlMessages.setVisitTime)}
                        </div>
                        <div className='column col-8'>
                          <TimeInput
                            label={intl.formatMessage(commonIntlMessages.startsLabel)}
                            defaultValue={state.startTime}
                            // value={state.startTime}
                            onChange={(value) => {
                              state.timeBox && this.setState({timeBox: null})
                              this.setState({startTime: value})
                            }}
                          />
                          <span>—</span>
                          <TimeInput
                            label={intl.formatMessage(commonIntlMessages.endsLabel)}
                            defaultValue={state.endTime}
                            // value={state.endTime}
                            onChange={(value) => {
                              state.timeBox && this.setState({timeBox: null})
                              this.setState({endTime: value})
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </Template>
                ) : null
              }
              {
                (state.timeBoxesLoading && !state.timeBoxes.length) ? <Spinner /> : null
              }
              {
                (state.timeBoxesLoading && state.timeBoxes.length) ? <OverlaySpinner /> : null
              }
            </div>
          </div>
        </div>
        <Button
          loading={state.postLoading}
          disabled={!state.patient || (!state.timeBox && !(state.startTime && state.endTime))}
        >
          {intl.formatMessage(intlMessages.enrollBtn)}
        </Button>
      </DoctorScheduleForm>
    )
  }
}

const mapStateToProps = ({ reference, queues, patients, user }) => {
  return {
    reference,
    queues,
    patients,
    user
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchTimeBoxes: function (query, queue) {
      return dispatch(fetchTimeBoxes(query, queue))
    },
    fetchPatients: function (query) {
      return dispatch(fetchPatients(query, true))
    },
    fetchQueues: function (query) {
      return dispatch(fetchQueues(query))
    }
  }
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(ScheduleRecord))

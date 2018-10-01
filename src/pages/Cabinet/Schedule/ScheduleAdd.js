import React, { Component } from 'react'
import { connect } from 'react-redux'
import store from '../../../redux/store'
import moment from 'moment'
import classNames from 'classnames'
import { injectIntl, defineMessages } from 'react-intl'
import FeatherIcon from '../../../components/Icons/FeatherIcon'
import Button from '../../../components/Button'
import { DoctorScheduleForm, DoctorScheduleHeader } from '../../../components/DoctorScheduleForm'
import axios from 'axios'
import api from '../../../api'
import { getUtcString } from '../../../util'
import { MaterialInput, Select, DateInput, TimeInput, Checkbox } from '../../../components/Form'
import linkState from 'linkstate'
import { fetchReference } from '../../../redux/reference/actions'
import { fetchQueueDetail } from '../../../redux/queue/actions'
import MediaQuery from '../../../components/MediaQuery'
import Template from '../../../components/Template/index'
import './ScheduleAdd.css'
import OverlaySpinner from '../../../components/Loader/OverlaySpinner'

import commonIntlMessages from '../../../i18n/common-messages'

const intlMessages = defineMessages({
  editScheduleTitle: {
    id: 'schedule.edit.title',
    defaultMessage: 'Изменить расписание'
  },
  addScheduleTitle: {
    id: 'schedule.add.title',
    defaultMessage: 'Добавить расписание'
  },
  labelScheduleName: {
    id: 'label.schedule_name',
    defaultMessage: 'Название расписания'
  },
  labelChooseSpecialty: {
    id: 'label.choose_specialty',
    defaultMessage: 'Выберите специальность'
  },
  labelChooseDoctor: {
    id: 'label.choose_doctor',
    defaultMessage: 'Выберите врача'
  },
  labelSetStartEnd: {
    id: 'label.set_start_end',
    defaultMessage: 'Укажите дату начала и окончания действия расписания'
  },
  labelScheduleStart: {
    id: 'label.schedule_start',
    defaultMessage: 'Начать расписание'
  },
  labelScheduleEnd: {
    id: 'label.schedule_end',
    defaultMessage: 'Закончить расписание'
  },
  labelScheduleWeekdays: {
    id: 'label.schedule_weekdays',
    defaultMessage: 'Дни недели действия расписания'
  },
  labelSetSchedulePeriod: {
    id: 'label.schedule_period',
    defaultMessage: 'Укажите ежедневный промежуток времени'
  },
  labelMinutes: {
    id: 'label.duration_minutes',
    defaultMessage: 'минут'
  },
  selfEnrollAccepted: {
    id: 'label.self_enroll_accepted',
    defaultMessage: 'Самозапись разрешена'
  },
  selfEnrollConfirm: {
    id: 'label.self_enroll_confirm',
    defaultMessage: 'Подтверждение самозаписи'
  },
  selfEnrollBefore: {
    id: 'label.self_enroll_before',
    defaultMessage: 'Самозапись производится не позднее, чем за'
  },
  labelDays: {
    id: 'label.days_before',
    defaultMessage: 'Дня'
  },
  labelHours: {
    id: 'label.hours_before',
    defaultMessage: 'Часа'
  },
  addAdvice: {
    id: 'schedule.add_advice',
    defaultMessage: 'Добавить совет пациенту'
  },
  labelAdvice: {
    id: 'label.advice',
    defaultMessage: 'Совет пациенту'
  }
})

class ScheduleAdd extends Component {
  constructor (props) {
    super(props)
    this.state = {
      weekdays: [ true, true, true, true, true, false, false ],
      title: '',
      specialty: '',
      startTime: '',
      endTime: '',
      timeboxTimeFrom: moment(),
      timeboxTimeTo: moment().add(1, 'days'),
      duration: '',
      wait: '',
      allowPatient: false,
      beforeMinimumHours: 0,
      beforeMinimumDays: 0,
      timeAmount: 'day',
      timeAmountCnt: '',
      advice: '',
      doctor: props.user.entity_type === 'doctor' && props.user.id,
      postLoading: false,
      showAdvice: false
    }

    this.onSubmit = this.onSubmit.bind(this)
    this.renderWeekDays = this.renderWeekDays.bind(this)
  }

  renderWeekDays () {
    return (
      <div className='week-labels'>
        {
          this.state.weekdays.map((x, i) => {
            return (
              <span
                key={`weekday-${i}`}
                className={classNames({'active': this.state.weekdays[i]})}
                onClick={() => {
                  console.log(this.state.weekdays)
                  const stateWeekdays = this.state.weekdays
                  stateWeekdays[i] = !this.state.weekdays[i]
                  this.setState({weekdays: stateWeekdays})
                }}
              >
                { moment().weekday(i).format('dd') }
              </span>
            )
          })
        }
      </div>
    )
  }

  setQueueFields ({timeBoxsCount, timeboxTimeFrom, timeboxTimeTo, beforeMinimumDays, beforeMinimumHours, serviceType, specialty, startTime, endTime, ...fields}) {
    const { user } = this.props
    let timeAmount = 'day'
    let timeAmountCnt = null
    if (beforeMinimumHours) {
      timeAmount = 'hour'
      timeAmountCnt = beforeMinimumHours
    } else {
      timeAmountCnt = beforeMinimumDays
    }
    const timezone = user.timezone.value / 3600
    const startTimeDefault = moment(timeboxTimeFrom).utcOffset(timezone).format('HH:mm')
    const endTimeDefault = moment(timeboxTimeTo).utcOffset(timezone).format('HH:mm')
    timeboxTimeTo = moment(timeboxTimeTo).utcOffset(timezone)
    timeboxTimeFrom = moment(timeboxTimeFrom).utcOffset(timezone)
    const newState = {
      ...fields,
      specialty: specialty.id,
      startTime: startTime.substring(0, 5),
      endTime: endTime.substring(0, 5),
      startTimeDefault,
      endTimeDefault,
      timeAmount,
      timeAmountCnt,
      timeboxTimeTo,
      timeboxTimeFrom,
      doctor: this.props.user.entity_type === 'doctor' && this.props.user.id
    }
    this.setState(Object.assign(this.state, newState))
  }

  componentDidMount () {
    const { reference, fetchReference, match, queues } = this.props
    this.req = axios.all([
      !reference['service-types'].length && fetchReference('service-types'),
      !reference['specialties'].length && fetchReference('specialties')
    ])

    if (match.params.id && (!queues.detail[match.params.id] || queues.detail[match.params.id]['changed'])) {
      this.req = this.props.fetchQueueDetail(match.params.id)
      this.req.then(() => {
        this.setQueueFields(queues.detail[match.params.id])
      })
    } else if (queues.detail[match.params.id]) {
      this.setQueueFields(queues.detail[match.params.id])
    }
  }

  postTimeBoxes (data) {
    const queueId = data.id
    api.getQueueDurations(queueId)
      .then(({data: {data}}) => {
        api.postQueueTimeboxes({
          queue: queueId,
          durations: data
        })
          .then(() => {
            this.setState({ postLoading: false })
            const closeUrl = this.props.closeUrl.split('?')
            this.props.history.push({
              pathname: closeUrl[0] || this.props.closeUrl,
              search: closeUrl[1],
              state: { getQueues: true }
            })
          })
          .catch((err) => {
            console.log(err)
            this.setState({ postLoading: false })
          })
      })
      .catch((err) => {
        console.log(err)
        this.setState({ postLoading: false })
      })
  }

  onSubmit (e) {
    const { postLoading, timeAmount, timeAmountCnt, showAdvice, errors, ...sendData } = this.state
    const { match } = this.props
    e.preventDefault()
    this.setState({ postLoading: true })
    if (timeAmount === 'day') {
      sendData.beforeMinimumDays = timeAmountCnt
      sendData.beforeMinimumHours = 0
    } else {
      sendData.beforeMinimumHours = timeAmountCnt
      sendData.beforeMinimumDays = 0
    }

    sendData.timeboxTimeFrom = moment(sendData.timeboxTimeFrom).utcOffset(this.props.user.timezone.value / 3600).startOf('day').format('YYYY-MM-DDThh:mm:ssZ')
    sendData.timeboxTimeTo = moment(sendData.timeboxTimeTo).utcOffset(this.props.user.timezone.value / 3600).endOf('day').format('YYYY-MM-DDThh:mm:ssZ')
    const {id, ...putData} = sendData

    match.params.id ? (
      // api.clearQueue(id)
      //   .then(() => {
          api.putQueue(putData, id)
            .then(({data: {data}}) => {
              store.dispatch({
                type: 'QUEUE_DETAIL_CHANGE',
                payload: data
              })
              this.setState({ postLoading: false })
              const closeUrl = this.props.closeUrl.split('?')
              this.props.history.push({
                pathname: closeUrl[0] || this.props.closeUrl,
                search: closeUrl[1],
                state: { getQueues: true }
              })
              // this.postTimeBoxes(data)
            })
            .catch((err) => {
              console.log(err)
              this.setState({ postLoading: false })
            })
        // })
    ) : (
      api.postQueue(sendData)
        .then(() => {
          this.setState({ postLoading: false })
          const closeUrl = this.props.closeUrl.split('?')
          this.props.history.push({
            pathname: closeUrl[0] || this.props.closeUrl,
            search: closeUrl[1],
            state: { getQueues: true }
          })
        })
        .catch((err) => {
          console.log(err)
          this.setState({ postLoading: false })
        })
        // .then(({data: {data}}) => {
        //   this.postTimeBoxes(data)
        // }).catch(({ response: { data: { data } } }) => {
        //   this.setState({
        //     postLoading: false,
        //     errors: data.errors
        //   })
        // })
    )
  }

  onChange (e, field) {
    const { state } = this
    const value = field === 'startTime' || field === 'endTime' ? e : e.target.value
    this.setState({[field]: value})
    if (state.errors && state.errors[`queue[${field}]`]) {
      const _errors = Object.assign({}, state.errors)
      delete _errors[`queue[${field}]`]
      this.setState({errors: _errors})
    }
  }

  render () {
    const { state, props } = this
    const { reference, queues, match, user, intl } = props
    const _specialties = user.specialties || user.organization.specialties
    // if (reference['service-types-loading'] || reference['specialties-loading'] || queues.detailLoading) {
    //   return <Spinner />
    // }

    return (
      <DoctorScheduleForm
        onSubmit={this.onSubmit}
      >
        <DoctorScheduleHeader title={`${match.params.id ? intl.formatMessage(intlMessages.editScheduleTitle) : intl.formatMessage(intlMessages.addScheduleTitle)}`} />
        {
          (
            reference['service-types-loading'] ||
           reference['specialties-loading'] ||
           queues.detailLoading
          ) && <OverlaySpinner />
        }
        <div className='form-grid'>
          <div className='form-grid__group'>
            <div className='columns'>
              <div className='column col-12'>
                <MaterialInput
                  label={intl.formatMessage(intlMessages.labelScheduleName)}
                  value={state.title}
                  onChange={e => this.onChange(e, 'title')}
                  error={state.errors && state.errors['queue[title]'] && state.errors['queue[title]'][0]}
                />
              </div>
              <div className='column col-12'>
                <Select
                  material
                  value={state.specialty}
                  error={state.errors && state.errors['queue[specialty]'] && state.errors['queue[specialty]'][0]}
                  onChange={(e) => {
                    this.onChange(e, 'specialty')
                    if (user.entity_type === 'registry') {
                      api.getDoctors({specialties: [e.target.value]})
                        .then(({data: {data}}) => {
                          this.setState({
                            workers: data.items
                          })
                        })
                    }
                  }}
                  label={intl.formatMessage(intlMessages.labelChooseSpecialty)}
                >
                  {
                    _specialties.map((specialty) => {
                      return <option key={`specialty-${specialty.id}`} value={specialty.id}>{ specialty.name }</option>
                    })
                  }
                </Select>
              </div>
              {
                user.entity_type === 'registry' && state.workers && (
                  <div className='column col-12'>
                    <Select
                      material
                      value={state.doctor}
                      onChange={e => this.onChange(e, 'doctor')}
                      error={state.errors && state.errors['queue[doctor]'] && state.errors['queue[doctor]'][0]}
                      label={intl.formatMessage(intlMessages.labelChooseDoctor)}
                    >
                      {
                        state.workers.map((worker) => {
                          return <option key={`worker-${worker.id}`} value={worker.id}>{ worker.lastName + ' ' + worker.firstName }</option>
                        })
                      }
                    </Select>
                  </div>
                )
              }
            </div>
          </div>
          <div className='form-grid__group'>
            <div className='columns'>
              <div className='column col-5'>{intl.formatMessage(intlMessages.labelSetStartEnd)}</div>
              <div className='column col-7 doctor-schedule-form__day-row doctor-schedule-form__day-row--wrap'>
                <DateInput
                  label={intl.formatMessage(intlMessages.labelScheduleStart)}
                  dayPickerProps={{
                    onDayClick: (date, dateProps) => {
                      if (dateProps.disabled) {
                        return
                      }
                      this.setState({
                        timeboxTimeFrom: moment(date).startOf('day').format('YYYY-MM-DDThh:mm:ssZ')
                      })
                      if (moment(date).startOf('day').valueOf() >= moment(state.timeboxTimeTo).startOf('day').valueOf()) {
                        this.setState({
                          timeboxTimeTo: moment(date).add(1, 'days').endOf('day').format('YYYY-MM-DDThh:mm:ssZ')
                        })
                      }
                    },
                    disabledDays: (date) => {
                      return moment(date).startOf('day').isBefore(moment().startOf('day'))
                    }
                  }}
                  onDayChange={(date, dateProps) => {
                    if (dateProps.disabled) {
                      return
                    }
                    this.setState({
                      timeboxTimeFrom: moment(date).startOf('day').format('YYYY-MM-DDThh:mm:ssZ')
                    })
                    if (moment(date).valueOf() >= moment(state.timeboxTimeTo).valueOf()) {
                      this.setState({
                        timeboxTimeTo: moment(date).add(1, 'days').endOf('day').format('YYYY-MM-DDThh:mm:ssZ')
                      })
                    }
                  }}
                  value={moment(state.timeboxTimeFrom).startOf('day').format('DD.MM.YYYY')}
                />
                <MediaQuery rule='(min-width:768px)'>
                  <span>—</span>
                </MediaQuery>
                <DateInput
                  label={intl.formatMessage(intlMessages.labelScheduleEnd)}
                  dayPickerProps={{
                    onDayClick: (date, dateProps) => {
                      if (dateProps.disabled) {
                        this.setState({
                          timeboxTimeTo: moment(state.timeboxTimeFrom).add(1, 'days').endOf('day').format('YYYY-MM-DDThh:mm:ssZ')
                        })
                      } else {
                        this.setState({
                          timeboxTimeTo: moment(date).endOf('day').format('YYYY-MM-DDThh:mm:ssZ')
                        })
                      }
                    },
                    disabledDays: (date) => {
                      return moment(date).startOf('day').isBefore(moment(state.timeboxTimeFrom).add(1, 'days').startOf('day'))
                    }
                  }}
                  onDayChange={(date, dateProps) => {
                    if (dateProps.disabled) {
                      this.setState({
                        timeboxTimeTo: moment(state.timeboxTimeFrom).add(1, 'days').endOf('day').format('YYYY-MM-DDThh:mm:ssZ')
                      })
                    } else {
                      this.setState({
                        timeboxTimeTo: moment(date).endOf('day').format('YYYY-MM-DDThh:mm:ssZ')
                      })
                    }
                  }}
                  value={moment(state.timeboxTimeTo).endOf('day').format('DD.MM.YYYY')}
                />
              </div>
            </div>
            <div className='columns'>
              <div className='column col-5'>{intl.formatMessage(intlMessages.labelScheduleWeekdays)}</div>
              <div className='column col-7'>
                {this.renderWeekDays()}
              </div>
            </div>
            <div className='columns'>
              <div className='column col-5'>{intl.formatMessage(intlMessages.labelSetSchedulePeriod)}</div>
              <div className='column col-7 doctor-schedule-form__day-row'>
                <TimeInput
                  label={intl.formatMessage(commonIntlMessages.startsLabel)}
                  defaultValue={state.startTimeDefault}
                  value={state.startTime}
                  icon={false}
                  onChange={value => this.onChange(value, 'startTime')}
                  error={state.errors && state.errors['queue[startTime]'] && state.errors['queue[startTime]'][0]}
                />
                <span>—</span>
                <TimeInput
                  label={intl.formatMessage(commonIntlMessages.endsLabel)}
                  defaultValue={state.endTimeDefault}
                  value={state.endTime}
                  icon={false}
                  onChange={value => this.onChange(value, 'endTime')}
                  error={state.errors && state.errors['queue[endTime]'] && state.errors['queue[endTime]'][0]}
                />
              </div>
            </div>
            <div className='columns'>
              <div className='column col-5'>{intl.formatMessage(commonIntlMessages.labelScheduleDuration)}</div>
              <div className='column col-7'>
                <MaterialInput
                  width={100}
                  label={intl.formatMessage(intlMessages.labelMinutes)}
                  type='number'
                  value={state.duration}
                  onChange={e => this.onChange(e, 'duration')}
                  error={state.errors && state.errors['queue[duration]'] && state.errors['queue[duration]'][0]}
                />
              </div>
            </div>
            <div className='columns'>
              <div className='column col-5'>{intl.formatMessage(commonIntlMessages.labelTimeoutDuration)}</div>
              <div className='column col-7'>
                <MaterialInput
                  width={100}
                  label={intl.formatMessage(intlMessages.labelMinutes)}
                  type='number'
                  value={state.wait}
                  onChange={e => this.onChange(e, 'wait')}
                  error={state.errors && state.errors['queue[wait]'] && state.errors['queue[wait]'][0]}
                />
              </div>
            </div>
            <div className='columns'>
              <div className='column col-5'>{intl.formatMessage(commonIntlMessages.selfEnrollConditions)}</div>
              <div className='column col-7'>
                <Checkbox
                  checked={state.allowPatient}
                  label={intl.formatMessage(intlMessages.selfEnrollAccepted)}
                  onChange={() => this.setState({allowPatient: !state.allowPatient})}
                />

                {/*<Checkbox label={intl.formatMessage(intlMessages.selfEnrollConfirm)} />*/}
              </div>
            </div>

            <div className='columns'>
              <div className='column col-5'>{ intl.formatMessage(intlMessages.selfEnrollBefore) }</div>
              <div className='column col-7 doctor-schedule-form__day-row'>
                <MaterialInput
                  width={40}
                  style={{marginRight: '0.625rem'}}
                  numeric
                  value={state.timeAmountCnt}
                  onChange={(e) => {
                    this.setState({timeAmountCnt: e.target.value})
                  }}
                  error={state.errors && (state.errors['queue[beforeMinimumDays]'] || state.errors['queue[beforeMinimumHours]'])}
                />
                <Select
                  style={{width: 115}}
                  material
                  value={state.timeAmount}
                  onChange={linkState(this, 'timeAmount')}
                >
                  <option value='day'>{intl.formatMessage(intlMessages.labelDays)}</option>
                  <option value='hour'>{intl.formatMessage(intlMessages.labelHours)}</option>
                </Select>
              </div>
            </div>

            <div className='columns'>
              {
                !state.showAdvice && !match.params.id ? (
                  <div className='column col-12'>
                    <span
                      className='add-param'
                      onClick={() => {
                        this.setState({showAdvice: true})
                      }}
                    >
                      <FeatherIcon icon='plus-circle' size={20} /> {intl.formatMessage(intlMessages.addAdvice)}
                    </span>
                  </div>
                ) : (
                  <Template>
                    <div className='column col-5'>{intl.formatMessage(intlMessages.labelAdvice)}</div>
                    <div className='column col-7'>
                      <MaterialInput
                        label={intl.formatMessage(intlMessages.labelAdvice)}
                        textarea
                        minRows={5}
                        value={this.state.advice}
                        onChange={linkState(this, 'advice')}
                      />
                    </div>
                  </Template>
                )
              }
            </div>
          </div>
        </div>
        <Button
          loading={state.postLoading}
        >
          { match.params.id ? intl.formatMessage(intlMessages.editScheduleTitle) : intl.formatMessage(intlMessages.addScheduleTitle) }
        </Button>
      </DoctorScheduleForm>
    )
  }
}

const mapStateToProps = ({ reference, queues, user }) => {
  return {
    reference,
    queues,
    user
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchReference: function (type) {
      return dispatch(fetchReference(type))
    },
    fetchQueueDetail: function (queue) {
      return dispatch(fetchQueueDetail(queue))
    }
  }
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(ScheduleAdd))

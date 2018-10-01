import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { injectIntl } from 'react-intl'

import moment from 'moment'
import qs from 'qs'
import api from '../../../api'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import { Card, CardBody } from '../../../components/Card'
import Template from '../../../components/Template'
import DetailCard from './EntityViews/DetailCard'
import './DoctorDetail.css'
import { Select, DateInput } from '../../../components/Form'
import Modal from '../../../components/Modal'
import Button from '../../../components/Button'
import FeatherIcon from '../../../components/Icons/FeatherIcon'
import { DoctorScheduleForm, DoctorScheduleTimeRow, DoctorScheduleHeader } from '../../../components/DoctorScheduleForm'
import InfoTabs from './EntityViews/InfoTabs'
import { fetchDoctorDetail } from '../../../redux/doctors/actions'
import { fetchQueues, fetchTimeBoxes } from '../../../redux/queue/actions'

import { Spinner, OverlaySpinner } from '../../../components/Loader'

import commonIntlMessages from '../../../i18n/common-messages'

class DoctorDetail extends Component {
  constructor ({intl}) {
    super()

    this.state = {
      loading: true,
      postLoading: false,
      formRating: null,
      formName: '',
      formComment: '',
      formDay: moment(new Date()).startOf('day').valueOf(),
      formQueueType: '',
      servicesGroups: null,
      serviceTitle: intl.formatMessage(commonIntlMessages.patientsReception),
      serviceType: 'admission',
      date: null,
      timeBoxesLoading: false,
      timeBoxes: []
    }
    this.onSubmit = this.onSubmit.bind(this)
  }

  getQueues (id) {
    let params = {
      filter: {
        author: [
          {
            type: 'eq',
            value: id
          }
        ],
        timeboxTimeTo: [
          {
            type: 'gt',
            value: moment().format('YYYY-MM-DDTHH:mm:ssZ')
          }
        ]
      }
    }
    return this.props.fetchQueues(qs.stringify(params))
  }

  getTimeBoxes (date = this.state.date, queue = this.state.queue && this.state.queue.id) {
    this.setState({timeBoxesLoading: true})

    const params = {
      queue: queue,
      limit: 50,
      filter: {
        startTime: [
          {
            type: 'gt',
            value: moment(date).startOf('day').format()
          },
          {
            type: 'lt',
            value: moment(date).endOf('day').format()
          }
        ]
      }
    }

    this.timeBoxreq = api.getQueueTimeboxes(qs.stringify(params))
      .then(({data: {data}}) => {
        this.setState({
          timeBoxesLoading: false,
          timeBoxes: data.items
        })
      })
    return this.timeBoxreq
  }

  componentDidMount () {
    const {match} = this.props
    this.setState({loading: true})
    this.props.fetchDoctor(match.params.id)
    axios.all([
      this.props.fetchDoctor(match.params.id),
      this.getQueues(match.params.id),
      api.getServiceGroups({doctor: match.params.id})
    ])
      .then(axios.spread((doctor, queues, services) => {
        this.setState({
          servicesGroups: services.data.data.items,
          loading: false
        })
      }))
  }

  onServiceTabClick (e, type) {
    const activeTitle = (e.target.textContent || e.target.innerText)
    this.setState({
      serviceTitle: activeTitle,
      serviceType: type
    })
  }

  onSubmit () {
    const {state, props} = this
    const {user, doctors: {detail}} = props
    this.setState({
      postLoading: true
    })
    api.postScheduleRequest({
      patient: user.id,
      timeBox: state.timeBox.id,
      doctor: detail.id,
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
      .catch(() => {
        this.setState({postLoading: false})
      })
  }

  render () {
    const {state, props} = this
    const {doctors: {detail}, queues, intl} = props
    if (state.loading) {
      return <OverlaySpinner />
    }
    return (
      <Template>
        <DetailCard {...detail} />
        <Card className='card--content doctor-detail-card'>
          <CardBody>
            <InfoTabs {...detail} />
          </CardBody>
        </Card>

        {
          detail.queuesCount ? (
            <Card>
              <CardBody>
                <DoctorScheduleForm
                  className='doctor-detail-card'
                  id='detailSchedule'
                  onSubmit={(e) => {
                    e.preventDefault()
                    this.setState({showConfirmModal: true})
                  }}
                >
                  <DoctorScheduleHeader title={intl.formatMessage(commonIntlMessages.enrollTitle)} />
                  <div className='doctor-schedule-form__options'>
                    <div className='columns'>
                      <div className='column col-8'>
                        <Select
                          material
                          value={state.queue && state.queue.id}
                          onChange={(e) => {
                            const _value = e.target.value
                            api.getQueuesDates({queue: e.target.value})
                              .then(({data: {data}}) => {
                                this.setState({availableDates: data})
                              })
                            this.setState({
                              queue: queues.items && queues.items.filter(queue => queue.id === _value)[0]
                            })
                            // this.getTimeBoxes(state.date, _value)
                          }}
                          id='queuesSelect'
                          label={intl.formatMessage(commonIntlMessages.chooseQueue)}
                        >
                          {
                            queues.items && queues.items.map((queue) => {
                              return <option key={`service-${queue.id}`} value={queue.id}>{queue.title}</option>
                            })
                          }
                        </Select>
                      </div>
                      <div className='column col-4'>
                        <DateInput
                          disabled={!state.queue}
                          label={intl.formatMessage(commonIntlMessages.visitDate)}
                          value={state.date && moment(this.state.date).format('DD.MM.YYYY')}
                          onDayChange={(date) => {
                            this.setState({
                              date: date && date.toDate()
                            })
                            date && this.getTimeBoxes(date.toDate())
                          }}
                          dayPickerProps={{
                            onDayClick: date => {
                              this.setState({date})
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
                      (state.timeBoxesLoading && !state.timeBoxes.length) ? <Spinner/> : null
                    }
                    {
                      (state.timeBoxesLoading && state.timeBoxes.length) ? <OverlaySpinner/> : null
                    }
                  </div>
                </DoctorScheduleForm>
              </CardBody>
            </Card>
          ) : null
        }
        {
          state.servicesGroups.length ? (
            <Template>
              <h3>{intl.formatMessage(commonIntlMessages.paidServicesTitle)}</h3>
              <div className='doctor-detail-service-tabs'>
                <Tabs>
                  <TabList>
                    {
                      state.servicesGroups.map(group => {
                        return (
                          <Tab key={`tab-${group.id}`} className='btn btn--ghost btn--xs'>{group.title}</Tab>
                        )
                      })
                    }
                  </TabList>
                  {
                    state.servicesGroups.map(group => {
                      return (
                        <TabPanel key={`tab-${group.id}`}>
                          <Card className='card--content doctor-detail-card doctor-detail-service-list'>
                            <CardBody>
                              <h2>{group.title}</h2>
                              {
                                group.services.map(service => {
                                  return (
                                    <div key={service.id} className='doctor-detail-service-list__item'>
                                      <span>{service.title}</span>
                                      <span>{service.price} руб.</span>
                                    </div>
                                  )
                                })
                              }
                            </CardBody>
                          </Card>
                        </TabPanel>
                      )
                    })
                  }
                </Tabs>
              </div>
            </Template>
          ) : null
        }

        {
          state.showConfirmModal && <Modal
            onRequestClose={() => {
              this.setState({showConfirmModal: false})
            }}
          >
            <Card>
              <CardBody>
                <h1 dangerouslySetInnerHTML={{
                  __html: intl.formatMessage(commonIntlMessages.confirmReceptionDate, {
                    weekDay: moment(state.date).format('dddd'),
                    date: moment(state.date).format('DD MMMM'),
                    time: moment(state.timeBox.startTime).utcOffset('+00:00').format('HH:mm')
                  })
                }}/>
                <span>
                  {intl.formatMessage(commonIntlMessages.receptionDuration, {duration: state.timeBox.queue.duration})}
                </span>
              </CardBody>
              <CardBody>{intl.formatMessage(commonIntlMessages.labelAddress)}: {detail.region.name}</CardBody>
              <CardBody className='bg-orange'>
                <FeatherIcon icon='alert-circle' size={34} color='#FDAE55' style={{marginRight: 10}}/>
                {state.timeBox.queue.advice}
              </CardBody>
              <CardBody>
                {intl.formatMessage(commonIntlMessages.labelQueue)}: {state.timeBox.queue.title}
              </CardBody>
              <CardBody>
                <Button
                  loading={state.postLoading}
                  disabled={state.postLoading}
                  onClick={this.onSubmit}
                >
                  {intl.formatMessage(commonIntlMessages.confirm)}
                </Button>
              </CardBody>
            </Card>
          </Modal>
        }
      </Template>
    )
  }
}

const mapStateToProps = ({doctors, queues, user}) => {
  return {
    doctors,
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
    },
    fetchDoctor: function (id) {
      return dispatch(fetchDoctorDetail(id))
    }
  }
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(DoctorDetail))

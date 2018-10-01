import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import moment from 'moment'
import qs from 'qs'
import { injectIntl } from 'react-intl'
import api from '../../../api'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import { Card, CardBody } from '../../../components/Card'
import Template from '../../../components/Template'
import DetailCard from './EntityViews/DetailCard'
import Workers from './EntityViews/OrgWorkers'

import InfoTabs from './EntityViews/InfoTabs'
import Modal from '../../../components/Modal'
import Button from '../../../components/Button'
import FeatherIcon from '../../../components/Icons/FeatherIcon'
import { fetchOrgDetail } from '../../../redux/organizations/actions'
import { fetchQueues, fetchTimeBoxes } from '../../../redux/queue/actions'

import { OverlaySpinner } from '../../../components/Loader'

import commonIntlMessages from '../../../i18n/common-messages'

class OrganizationDetail extends Component {
  constructor ({ intl }) {
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
      date: moment(),
      timeBoxesLoading: false,
      timeBoxes: [],
      doctors: null
    }
    this.onSubmit = this.onSubmit.bind(this)
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

  componentDidMount () {
    const { match, location } = this.props
    this.setState({loading: true})
    axios.all([
      this.props.fetchOrganization(match.params.id),
      api.getServiceGroups({organization: match.params.id})
    ])
      .then(axios.spread((org, services) => {
        this.setState({
          servicesGroups: services.data.data.items
        })

        const query = { organizations: [org.data.data.id] }
        if (org.data.data.specialties && org.data.data.specialties.length) {
          query.specialties = [org.data.data.specialties[0]['id']]
        }

        api.getDoctors(query)
          .then(({data: {data}}) => {
            this.setState({
              doctors: data.items,
              loading: false
            })
            if (location.state && location.state.scrollTo) {
              window.scrollTo(0, document.getElementById(location.state.scrollTo).offsetTop - 100)
              this.props.history.replace({ state: null })
            }
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
    const { state, props } = this
    const { user, organizations: { detail } } = props
    this.setState({
      postLoading: true
    })
    api.postScheduleRequest({
      patient: user.id,
      timeBox: state.timeBox.id,
      organization: detail.id,
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
    const { state, props } = this
    const { organizations: { detail }, intl } = props
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
          detail.specialties && detail.specialties.length ? (
            <div id='workers'>
              <h3>{ intl.formatMessage(commonIntlMessages.workersTitle) }</h3>
              <Workers specialties={detail.specialties} orgId={detail.id} initialDoctors={state.doctors} />
            </div>
          ) : null
        }
        {
          state.servicesGroups.length ? (
            <Template>
              <h3>{ intl.formatMessage(commonIntlMessages.paidServicesTitle) }</h3>
              <div className='doctor-detail-service-tabs'>
                <Tabs>
                  <TabList>
                    {
                      state.servicesGroups.map(group => {
                        return (
                          <Tab key={`tab-${group.id}`} className='btn btn--ghost btn--xs'>{ group.title }</Tab>
                        )
                      })
                    }
                  </TabList>
                  {
                    state.servicesGroups.map(group => {
                      return (
                        <TabPanel>
                          <Card className='card--content doctor-detail-card doctor-detail-service-list'>
                            <CardBody>
                              <h2>{ group.title }</h2>
                              {
                                group.services.map(service => {
                                  return (
                                    <div key={service.id} className='doctor-detail-service-list__item'>
                                      <span>{ service.title }</span>
                                      <span>{ service.price } руб.</span>
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
                <h1 dangerouslySetInnerHTML={{ __html: intl.formatMessage(commonIntlMessages.confirmReceptionDate, { weekDay: moment(state.date).format('dddd'), date: moment(state.date).format('DD MMMM'), time: moment(state.timeBox.startTime).utcOffset('+00:00').format('HH:mm') }) }} />
                <span>
                  { intl.formatMessage(commonIntlMessages.receptionDuration, { duration: state.timeBox.queue.duration }) }
                </span>
              </CardBody>
              <CardBody>{ intl.formatMessage(commonIntlMessages.labelAddress) }: { detail.region.name }</CardBody>
              <CardBody className='bg-orange'>
                <FeatherIcon icon='alert-circle' size={34} color='#FDAE55' style={{marginRight: 10}} />
                { state.timeBox.queue.advice }
              </CardBody>
              <CardBody>
                { intl.formatMessage(commonIntlMessages.labelQueue) }: {state.timeBox.queue.title}
              </CardBody>
              <CardBody>
                <Button
                  loading={state.postLoading}
                  disabled={state.postLoading}
                  onClick={this.onSubmit}
                >
                  { intl.formatMessage(commonIntlMessages.confirm) }
                </Button>
              </CardBody>
            </Card>
          </Modal>
        }
      </Template>
    )
  }
}

const mapStateToProps = ({ organizations, queues, user }) => {
  return {
    organizations,
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
    fetchOrganization: function (id) {
      return dispatch(fetchOrgDetail(id))
    }
  }
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(OrganizationDetail))

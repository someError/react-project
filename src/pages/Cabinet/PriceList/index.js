import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import accounting from 'accounting'
import { injectIntl, defineMessages } from 'react-intl'

import Template from '../../../components/Template'
import { fetchReference } from '../../../redux/reference/actions'

import FeatherIcon from '../../../components/Icons/FeatherIcon'
import Button from '../../../components/Button'
import { Card, CardBody } from '../../../components/Card'
import api from '../../../api'
import { CURRENCY_SYMBOLS } from '../../../util'

import { MaterialInput, Select, AddButton } from '../../../components/Form'

import { Spinner, OverlaySpinner } from '../../../components/Loader'
import './styles.css'

import commonIntlMessages from '../../../i18n/common-messages'

const intlMessages = defineMessages({
  labelServiceTitle: {
    id: 'label.service.title',
    defaultMessage: 'Название услуги'
  },
  labelPrice: {
    id: 'label.price',
    defaultMessage: 'Цена'
  },
  labelCurrency: {
    id: 'label.currency',
    defaultMessage: 'Валюта'
  },
  addService: {
    id: 'btn.add_service',
    defaultMessage: 'Добавить услугу'
  },
  removeGroup: {
    id: 'btn.remove_services_group',
    defaultMessage: 'Удалить группу услуг'
  }
})

const SERVICE_SCHEME = {
  title: '',
  price: '',
  currency: {
    id: ''
  },
  position: 10
}

const GROUP_SCHEME = {
  title: '',
  services: [
    SERVICE_SCHEME
  ]
}

class Assistants extends Component {
  constructor () {
    super()
    this.state = {
      loading: true,
      service_group: null,
      serviceGroups: null,
      tabIndex: 0,
      creating: false,
      deletingGroup: false
    }
    this.onSubmit = this.onSubmit.bind(this)
    this.onChange = this.onChange.bind(this)
    this.addService = this.addService.bind(this)
  }

  componentDidMount () {
    let query = null
    if (this.props.user.entity_type === 'administrator') {
      query = { organization: this.props.user.organization.id }
    } else {
      query = { doctor: this.props.user.id }
    }
    api.getServiceGroups(query)
      .then(({data: {data}}) => {
        this.setState({
          service_group: data.items,
          serviceGroups: data.items
        })
        this.props.fetchReference('currencies')
          .then(() => {
            this.setState({loading: false})
          })
      })
  }

  componentWillUpdate (nextProps, nextState) {
    if (nextState.tabIndex !== this.state.tabIndex) {
      this.setState({errors: null})
    }
  }

  onSubmit (e) {
    e.preventDefault()
    const { state } = this
    const { tabIndex } = this.state
    const service_group = JSON.parse(JSON.stringify(state.service_group))
    const serviceGroups = JSON.parse(JSON.stringify(state.serviceGroups))
    const sendData = service_group[tabIndex]

    sendData.services.map(service => {
      service.currency = service.currency.id
    })

    this.setState({postLoading: true})

    if (sendData.id) {
      const id = sendData.id
      delete sendData.id
      api.putServiceGroup(id, {service_group: sendData})
        .then(({data: {data}}) => {
          callback(data)
        })
        .catch(({ response: { data: { data } } }) => getErrors(data.errors))
    } else {
      api.postServiceGroups({service_group: sendData})
        .then(({data: {data}}) => {
          callback(data)
          this.setState({
            creating: false
          })
        })
        .catch(({ response: { data: { data } } }) => getErrors(data.errors))
    }

    const callback = data => {
      serviceGroups[tabIndex] = data
      service_group[tabIndex] = data
      this.setState({
        serviceGroups,
        service_group,
        postLoading: false
      })
    }

    const getErrors = errors => {
      this.setState({
        errors,
        postLoading: false
      })
    }
  }

  onChange (e, field, index, serviceIndex) {
    const service_group = JSON.parse(JSON.stringify(this.state.service_group))
    if (field === 'currency') {
      service_group[index]['services'][serviceIndex][field]['id'] = e.target.value
    } else {
      service_group[index]['services'][serviceIndex][field] = e.target.value
    }

    this.state.errors && this.state.errors[`service_group[services][${serviceIndex}][${field}]`] &&
    this.removeError(`service_group[services][${serviceIndex}][${field}]`)
    this.setState({service_group})
  }

  addService (index) {
    const service_group = JSON.parse(JSON.stringify(this.state.service_group))
    service_group[index]['services'].push(SERVICE_SCHEME)
    this.setState({service_group})
  }

  removeError (key) {
    const errors = JSON.parse(JSON.stringify(this.state.errors))
    delete errors[key]
    this.setState({errors})
  }

  render () {
    const { state, props } = this
    const { intl } = props

    if (state.loading) {
      return (
        <Template>
          <header className='page-header'>
            <h2>{ intl.formatMessage(commonIntlMessages.paidServicesTitle) }</h2>
          </header>
          <Spinner />
        </Template>
      )
    }
    return (
      <Tabs selectedIndex={state.tabIndex} onSelect={index => {
        !state.postLoading && this.setState({tabIndex: index})
      }}>
        <header className='page-header'>
          <h2>{ intl.formatMessage(commonIntlMessages.paidServicesTitle) }</h2>
        </header>
        <TabList className='l-services__btns'>
          {
            !state.creating && (
              <Button
                size='xs'
                ghost
                className='btn-service-add'
                onClick={() => {
                  const service_group = JSON.parse(JSON.stringify(state.service_group))
                  const serviceGroups = JSON.parse(JSON.stringify(state.serviceGroups))
                  service_group.unshift(GROUP_SCHEME)
                  serviceGroups.unshift({ title: intl.formatMessage(commonIntlMessages.labelDraft) })
                  this.setState({
                    service_group,
                    serviceGroups,
                    tabIndex: 0,
                    creating: true
                  })
                }}
              >
                + { intl.formatMessage(intlMessages.addService) }

                {/* сорян, лишний гемор для интернационализации */}
                {/* <MediaQuery rule='(max-width: 767px)'><span>услугу</span></MediaQuery> */}
              </Button>
            )
          }
          {
            state.serviceGroups && state.serviceGroups.length
              ? state.serviceGroups.map((group, i) => {
                return (
                  <Tab
                    key={`group-${i}-title`}
                    className='btn btn--xs btn--ghost'
                  >
                    { group.title }
                  </Tab>
                )
              }) : null
          }
        </TabList>
        {
          state.service_group && state.service_group.length
            ? state.service_group.map((group, i) => {
              return (
                <TabPanel>
                  <Card className='card--gray spinner-wrap'>
                    {
                      state.deletingGroup && <OverlaySpinner />
                    }
                    <CardBody>
                      <div className='form-grid'>
                        <div className='columns'>
                          <div className='column col-12'>
                            <MaterialInput
                              error={state.errors && state.errors['service_group[title]'] && state.errors['service_group[title]'][0]}
                              label='Название группы услуг'
                              value={state.service_group[i].title}
                              onChange={e => {
                                state.errors && state.errors['service_group[title]'] && this.removeError('service_group[title]')
                                const service_group = JSON.parse(JSON.stringify(state.service_group))
                                service_group[i]['title'] = e.target.value
                                this.setState({service_group})
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      <form onSubmit={this.onSubmit} className='price-list-table'>
                        <div className='price-list-table__row'>
                          <div className='price-list-table__th'>{ intl.formatMessage(intlMessages.labelServiceTitle) }</div>
                          <div className='price-list-table__th'>{ intl.formatMessage(intlMessages.labelPrice) }</div>
                          <div className='price-list-table__th'>{ intl.formatMessage(intlMessages.labelCurrency) }</div>
                        </div>
                        {
                          group.services && group.services.map((service, serviceIndex) => {
                            return (
                              <div key={`service-row-${serviceIndex}`} className='price-list-table__row'>
                                <div className='price-list-table__td'>
                                  <MaterialInput
                                    error={state.errors && state.errors[`service_group[services][${serviceIndex}][title]`]
                                    }
                                    label={intl.formatMessage(intlMessages.labelServiceTitle)}
                                    value={service.title}
                                    onChange={e => this.onChange(e, 'title', i, serviceIndex)}
                                  />
                                </div>
                                <div className='price-list-table__td'>
                                  <MaterialInput
                                    error={state.errors && state.errors[`service_group[services][${serviceIndex}][price]`]
                                    }
                                    label={intl.formatMessage(intlMessages.labelPrice)}
                                    value={accounting.formatNumber(service.price, 0, ' ')}
                                    onChange={e => {
                                      this.onChange(e, 'price', i, serviceIndex)
                                    }}
                                  />
                                </div>
                                <div className='price-list-table__td'>
                                  <Select
                                    error={state.errors && state.errors[`service_group[services][${serviceIndex}][currency]`]
                                    }
                                    // label='₽'
                                    label='валюта'
                                    material
                                    value={service.currency.id}
                                    onChange={e => this.onChange(e, 'currency', i, serviceIndex)}
                                  >
                                    {
                                      props.reference.currencies.map((currency) => {
                                        return (
                                          <option value={currency.id}>{ CURRENCY_SYMBOLS[currency.letterCode] }</option>
                                        )
                                      })
                                    }
                                  </Select>
                                </div>
                                <div className='price-list-table__row-delete'>
                                  <div
                                    onClick={() => {
                                      const service_group = JSON.parse(JSON.stringify(state.service_group))
                                      service_group[i]['services'].splice(serviceIndex, 1)
                                      this.setState({service_group})
                                    }}
                                  >
                                    <FeatherIcon icon='x' size={16} color='#9f9f9f' />
                                  </div>
                                </div>
                              </div>
                            )
                          })
                        }
                        <div className='price-list-btns'>
                          <Button
                            size='sm'
                            loading={state.postLoading}
                          >
                            { intl.formatMessage(commonIntlMessages.saveBtn) }
                          </Button>
                          <AddButton
                            onClick={() => this.addService(i)}
                          >
                            { intl.formatMessage(intlMessages.addService) }
                          </AddButton>
                          {
                            group.id && (
                              <span
                                onClick={() => {
                                  this.setState({deletingGroup: true})
                                  api.deleteServiceGroup(group.id)
                                    .then(() => {
                                      const service_group = state.service_group
                                      const serviceGroups = state.serviceGroups

                                      service_group.splice(i, 1)
                                      serviceGroups.splice(i, 1)

                                      this.setState({
                                        service_group,
                                        serviceGroups,
                                        deletingGroup: false
                                      })
                                    })
                                }}
                                className='color-gray price-list-btns__delete'>
                                { intl.formatMessage(intlMessages.removeGroup) }
                              </span>
                            )
                          }
                        </div>
                      </form>
                    </CardBody>
                  </Card>
                </TabPanel>
              )
            }) : null
        }
      </Tabs>
    )
  }
}

const mapStateToProps = ({ user, reference }) => {
  return {
    reference,
    user
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchReference: function (type) {
      return dispatch(fetchReference(type))
    }
  }
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Assistants))

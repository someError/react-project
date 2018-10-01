import React, { Component } from 'react'
import { connect } from 'react-redux'
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl'
import { Card, CardBody } from '../../../../components/Card'
import { MaterialInput, Checkbox, AddButton } from '../../../../components/Form'
import { fetchReference } from '../../../../redux/reference/actions'
import { Spinner } from '../../../../components/Loader'
import Button from '../../../../components/Button'
import Template from '../../../../components/Template'
import api from '../../../../api'
import FeatherIcon from '../../../../components/Icons/FeatherIcon'
import Tooltip from '../../../../components/Tooltip'
import store from '../../../../redux/store'
import { validatePhone } from '../../../../util'
import MediaQuery from '../../../../components/MediaQuery'

import commonIntlMessages from '../../../../i18n/common-messages'

import '../style.css'

const intlMessages = defineMessages({
  capTitle: {
    id: 'cap.title',
    defaultMessage: 'Настройте карту экстренной помощи'
  },
  showAllData: {
    id: 'cap.show_all_data',
    defaultMessage: 'Отображать все данные'
  },
  invalidateCap: {
    id: 'cap.invalidate',
    defaultMessage: 'Аннулировать кэп'
  },
  capTurnOff: {
    id: 'cap.turn_off',
    defaultMessage: 'Отключить кэп'
  },
  capTurnOn: {
    id: 'cap.turn_on',
    defaultMessage: 'Включить кэп'
  },
  capNotify: {
    id: 'cap.notify',
    defaultMessage: 'Уведомлять об использовании КЭП'
  },
  capAddContact: {
    id: 'cap.add_contact',
    defaultMessage: 'Добавить контакт'
  },
  capEditContact: {
    id: 'cap.edit_contact',
    defaultMessage: 'Изменить контакт'
  },
  capDocsList: {
    id: 'cap.docs_list',
    defaultMessage: 'Доступен список врачей, у которых я был на приеме'
  },
  capOrgsList: {
    id: 'cap.orgs_list',
    defaultMessage: 'Доступен список врачей, у которых я был на приеме'
  }
})

const pubicOptions = [
  ['name', commonIntlMessages.firstName],
  // ['name', 'Фамилия'],
  // ['name', 'Отчество'],
  ['birthday', commonIntlMessages.labelBirthDate],
  ['contraindications', commonIntlMessages.labelContraindications],
  ['chronic diseases', commonIntlMessages.labelChronic],
  ['disease', commonIntlMessages.labelDiseases],
  ['taking drugs', commonIntlMessages.labelDrugs],
  ['blood', commonIntlMessages.labelBloodRhesus]
]

class Sos extends Component {
  constructor ({user: { sos }}) {
    super()
    this.state = {
      ...sos,
      sections: sos.sections.map(section => { return section.id }),
      loading: true
    }
    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.addContact = this.addContact.bind(this)
  }

  componentDidMount () {
    const { reference } = this.props
    !reference.sections ? this.props.fetchReference('sections')
      .then(() => this.setState({loading: false}))
      : this.setState({loading: false})
  }

  onChange (e, value) {
    const field = this.state[e.target.name]
    const indexOf = field.indexOf(value)
    if (indexOf + 1) {
      field.splice(indexOf, 1)
    } else {
      field.push(value)
    }
    this.setState({[e.target.name]: field})
  }

  addContact (e) {
    e.preventDefault()
    const { name, phone, description } = this.state
    let contacts = this.state.contacts
    if (!contacts) contacts = []
    if (this.state.contactFormEvent === 'edit') {
      contacts[this.state.contactIndex] = {
        ...contacts[this.state.contactIndex],
        name,
        phone,
        description
      }
    } else {
      contacts.push({
        name,
        phone,
        description
      })
    }
    this.setState({
      contacts,
      name: '',
      phone: '',
      description: '',
      showContactForm: false
    })
  }

  onSubmit (e, status) {
    e.preventDefault()
    let {loading, ...sendData} = this.state
    if (status) {
      this.setState({changeStatusLoading: true})
      sendData = {}
      sendData.status = status
    } else {
      this.setState({postLoading: true})
    }
    api.putEmergenciesCard({card: sendData})
      .then(({data: {data}}) => {
        store.dispatch({
          type: 'SOS_CHANGE_STATUS',
          payload: data
        })
        this.setState({
          status: status || data.status,
          changeStatusLoading: false,
          postLoading: false
        })
      })
  }

  render () {
    const { state, props } = this
    const { reference: { sections }, intl } = props
    if (state.loading) {
      return (
        <div className='sos-header page-header'>
          <h2>{ intl.formatMessage(intlMessages.capTitle) }</h2>
          <Button ghost size='sm'>
            { state.status === 'active' ? intl.formatMessage(intlMessages.capTurnOff) : intl.formatMessage(intlMessages.capTurnOn) }
          </Button>
          <Button
            pink
            size='sm'
          >
            { intl.formatMessage(intlMessages.invalidateCap) }
          </Button>
          <Spinner />
        </div>
      )
    }
    return (
      <Template>
        <div className='sos-header page-header'>
          <h2>{ intl.formatMessage(intlMessages.capTitle) }</h2>
          <Button
            loading={state.changeStatusLoading}
            onClick={(e) => {
              if (state.status === 'active') {
                this.onSubmit(e, 'inactive')
              } else {
                this.onSubmit(e, 'active')
              }
            }}
            ghost
            size='sm'>
            { state.status === 'active' ? intl.formatMessage(intlMessages.capTurnOff) : intl.formatMessage(intlMessages.capTurnOn) }
          </Button>
          <Button
            pink
            size='sm'
            loading={state.cancelLoading}
            onClick={() => {
              this.setState({cancelLoading: true})
              api.cancelEmergenciesCard()
                .then(({data: {data}}) => {
                  store.dispatch({
                    type: 'SOS_CHANGE_STATUS',
                    payload: data
                  })
                  this.setState({cancelLoading: true})
                  props.history.push({pathname: '/cabinet/profile'})
                })
            }}
          >
            { intl.formatMessage(intlMessages.invalidateCap) }
          </Button>
        </div>
        <form id='sos-form' onSubmit={this.onSubmit}>
          <section className='section'>
            <h3 className='section-title'>{ intl.formatMessage(commonIntlMessages.publicDataTitle) }</h3>
            <div className='section-description'>
              <FormattedMessage
                id='cap.choose_data'
                defaultMessage='Выберите данные, которые будут показаны при использовании КЭП.'
              />
            </div>
            <Card className='card--gray'>
              <CardBody>
                <div className='checkbox-row'>
                  <Checkbox
                    size='xl'
                    checked={state.publicAll}
                    onChange={() => {
                      let publicInfos
                      if (!state.publicAll) {
                        publicInfos = pubicOptions.map(option => {
                          return option[0]
                        })
                      } else {
                        publicInfos = []
                      }
                      this.setState({
                        publicInfos,
                        publicAll: !state.publicAll
                      })
                    }}
                    label={intl.formatMessage(intlMessages.showAllData)}
                  />
                </div>
                {
                  pubicOptions.map(option => {
                    return (
                      <div key={`public-${option[0]}`} className='checkbox-row'>
                        <Checkbox
                          size='xl'
                          label={intl.formatMessage(option[1])}
                          name='publicInfos'
                          checked={state.publicInfos.indexOf(option[0]) + 1}
                          disabled={state.publicAll}
                          onChange={e => this.onChange(e, option[0])}
                        />
                      </div>
                    )
                  })
                }
              </CardBody>
            </Card>
          </section>
          <section className='section'>
            <h3 className='section-title'>
              { intl.formatMessage(commonIntlMessages.medicalCardTitle) }
            </h3>
            <div className='section-description'>
              <FormattedMessage
                id='cap.choose_sections'
                defaultMessage='Выберите разделы медицинской карты, которые можно будет просматривать при использовании КЭП.'
              />
            </div>
            <Card className='card--gray'>
              <CardBody>
                {
                  sections.map(section => {
                    return (
                      <div key={`section-${section.id}`} className='checkbox-row'>
                        <Checkbox
                          size='xl'
                          label={section.name}
                          name='sections'
                          checked={state.sections.indexOf(section.id) + 1}
                          disabled={state.sectionsAll}
                          onChange={e => this.onChange(e, section.id)}
                        />
                      </div>
                    )
                  })
                }
              </CardBody>
            </Card>
          </section>

          <section className='section'>
            <h3 className='section-title'>{ intl.formatMessage(commonIntlMessages.menuContacts) }</h3>
            <div className='section-description'>
              <FormattedMessage
                id='cap.add_contacts'
                defaultMessage='Добавьте контакты людей, которые будут отображаться при использовании КЭП.'
              />
            </div>
            {
              state.contacts && state.contacts.length
                ? (
                  <Card>
                    <CardBody>
                      <div className='sos-contacts'>
                        <MediaQuery rule='(min-width: 768px)'>
                          <div className='sos-contacts__row sos-contacts__row--header'>
                            <div className='sos-contacts__td'>{ intl.formatMessage(commonIntlMessages.phone) }</div>
                            <div className='sos-contacts__td' />
                            <div className='sos-contacts__td'>{ intl.formatMessage(commonIntlMessages.firstName) }</div>
                            <div className='sos-contacts__td'>{ intl.formatMessage(commonIntlMessages.labelDescription) }</div>
                          </div>
                        </MediaQuery>
                        {
                          state.contacts.map((contact, i) => {
                            return (
                              <div key={`sos-contact-${i}`} className='sos-contacts__row'>
                                <div className='sos-contacts__td'>{ contact.phone }</div>
                                <MediaQuery rule='(min-width: 768px)'>
                                  <div className='sos-contacts__td'>
                                    <Tooltip text={intl.formatMessage(intlMessages.capNotify)}>
                                      <div>
                                        <FeatherIcon
                                          onClick={() => {
                                            const { contacts } = state
                                            contacts[i].notify = !contacts[i].notify
                                            this.setState({contacts})
                                          }}
                                          icon='bell'
                                          size='18'
                                          color={state.contacts[i].notify ? '#3A76D2' : null}
                                        />
                                      </div>
                                    </Tooltip>
                                  </div>
                                </MediaQuery>
                                <div className='sos-contacts__td'>{ contact.name }</div>
                                <div className='sos-contacts__td'>{ contact.description }</div>
                                <span className='sos-contacts__row-nav'>
                                  <MediaQuery rule='(min-width: 768px)'>
                                    <Tooltip text={intl.formatMessage(intlMessages.capNotify)}>
                                      <div>
                                        <FeatherIcon
                                          onClick={() => {
                                            const { contacts } = state
                                            contacts[i].notify = !contacts[i].notify
                                            this.setState({contacts})
                                          }}
                                          icon='bell'
                                          size='18'
                                          color={state.contacts[i].notify ? '#3A76D2' : null}
                                        />
                                      </div>
                                    </Tooltip>
                                  </MediaQuery>
                                  <FeatherIcon
                                    onClick={() => {
                                      this.setState({
                                        showContactForm: true,
                                        contactFormEvent: 'edit',
                                        contactIndex: i,
                                        name: contact.name,
                                        description: contact.description,
                                        phone: contact.phone
                                      })
                                    }}
                                    icon='edit-2'
                                    size='18'
                                  />
                                  <FeatherIcon
                                    onClick={() => {
                                      const { contacts } = state
                                      contacts.splice(i, 1)
                                      this.setState({contacts})
                                    }}
                                    icon='trash-2'
                                    size='18'
                                  />
                                </span>
                              </div>
                            )
                          })
                        }
                      </div>
                      {
                        !state.showContactForm && (
                          <AddButton
                            onClick={() => this.setState({
                              showContactForm: true,
                              contactFormEvent: 'add'
                            })}
                          >
                            {intl.formatMessage(intlMessages.capAddContact)}
                          </AddButton>
                        )
                      }
                    </CardBody>
                  </Card>
                )
                : null
            }
            {
              !state.showContactForm && (!state.contacts || !state.contacts.length) && <Button
                size='sm'
                onClick={() => this.setState({
                  showContactForm: true,
                  contactFormEvent: 'add'
                })}
              >
                {intl.formatMessage(intlMessages.capAddContact)}
              </Button>
            }
            {
              state.showContactForm && <ContactForm {...state} onChange={(e, field) => this.setState({[field]: e.target.value})} >
                <Button
                  size='sm'
                  onClick={this.addContact}
                  disabled={!state.name || !validatePhone(state.phone)}
                >
                  { state.contactFormEvent === 'add' ? intl.formatMessage(intlMessages.capAddContact) : intl.formatMessage(intlMessages.capEditContact) }
                </Button>
              </ContactForm>
            }
          </section>

          <section className='section'>
            <h3 className='section-title'>
              <FormattedMessage
                id='cap.docs_contacts'
                defaultMessage='Контакты врачей'
              />
            </h3>
            <div className='checkbox-row'>
              <Checkbox
                size='xl'
                label={intl.formatMessage(intlMessages.capDocsList)}
                name='sections'
                checked={state.showDoctorInfo}
                onChange={e => this.setState({showDoctorInfo: !state.showDoctorInfo})}
              />
            </div>
            <div className='checkbox-row'>
              <Checkbox
                size='xl'
                label={intl.formatMessage(intlMessages.capOrgsList)}
                name='sections'
                checked={state.showOrganizationInfo}
                onChange={e => this.setState({showOrganizationInfo: !state.showOrganizationInfo})}
              />
            </div>
          </section>

          <Button
            loading={state.postLoading}
          >
            { intl.formatMessage(commonIntlMessages.saveBtn) }
          </Button>

        </form>
      </Template>
    )
  }
}

const ContactForm = injectIntl((props) => {
  const { intl } = props
  return (
    <Card className='card--gray'>
      <CardBody>
        <div className='form-grid'>
          <div className='columns'>
            <div className='column col-4'>
              <MaterialInput
                phone
                value={props.phone}
                label={intl.formatMessage(commonIntlMessages.phone)}
                onChange={e => props.onChange(e, 'phone')}
              />
            </div>
          </div>
          <div className='columns'>
            <div className='column col-8'>
              <MaterialInput
                value={props.name}
                label={intl.formatMessage(commonIntlMessages.firstName)}
                onChange={e => props.onChange(e, 'name')}
              />
            </div>
          </div>
          <div className='columns'>
            <div className='column col-8'>
              <MaterialInput
                textarea
                minRows={3}
                value={props.description}
                label={intl.formatMessage(commonIntlMessages.labelDescription)}
                onChange={e => props.onChange(e, 'description')}
              />
            </div>
          </div>
          { props.children }
        </div>
      </CardBody>
    </Card>
  )
})

const mapStateToProps = ({ user, reference }) => {
  return {
    user,
    reference
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchReference: function (type) {
      return dispatch(fetchReference(type))
    }
  }
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Sos))

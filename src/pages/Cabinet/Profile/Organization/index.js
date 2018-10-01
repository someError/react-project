import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import moment from 'moment'
import { Card, CardBody } from '../../../../components/Card'
import MultipleAutocomplete from '../../../../components/Form/MultipleAutocomplete'
import { MaterialInput, DateInput, Select, Checkbox } from '../../../../components/Form'
import { fetchReference } from '../../../../redux/reference/actions'
import { Spinner } from '../../../../components/Loader'
import Button from '../../../../components/Button'
import api from '../../../../api'
import { changeUser } from '../../../../redux/user/actions'
import { Files } from '../../../../components/Files'
import AdminProfile from './AdminProfile'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl'

import commonIntlMessages from '../../../../i18n/common-messages'

import Tooltip from '../../../../components/Tooltip'

const intlMessages = defineMessages({
  labelContactPerson: {
    id: 'label.contact_person',
    defaultMessage: 'Контактное лицо'
  },
  labelContactPhone: {
    id: 'label.contact_phone',
    defaultMessage: 'Контактный телефон'
  },
  labelContactEmail: {
    id: 'label.contact_email',
    defaultMessage: 'Контактный email'
  },
  labelPublicPhone: {
    id: 'label.public_phone',
    defaultMessage: 'Публичный телефон'
  },
  labelPublicEmail: {
    id: 'label.public_email',
    defaultMessage: 'Публичный email'
  },
  labelCabinetName: {
    id: 'label.cabinet_name',
    defaultMessage: 'Название кабинета'
  },
  labelLegalName: {
    id: 'label.legal_name',
    defaultMessage: 'Юридическое название'
  },
  orgDescription: {
    id: 'label.org_description',
    defaultMessage: 'Описание организации'
  },
  labelLicenceNumber: {
    id: 'label.licence_number',
    defaultMessage: 'Номер лицензии'
  },
  labelLicenceDate: {
    id: 'label.licence_date',
    defaultMessage: 'Дата лицензии'
  }
})

class OrgProfile extends Component {
  constructor () {
    super()
    this.state = {
      loading: true
    }
    this.onSubmit = this.onSubmit.bind(this)
    this.setToInitial = this.setToInitial.bind(this)
  }

  setToInitial () {
    const { user } = this.props
    const { organization, ...userProps } = user
    this.setState({
      ...userProps,
      ...organization,
      region: organization.region && organization.region.id,
      serviceTypes: organization.serviceTypes && organization.serviceTypes.map(service => { return service.id })
    })
  }

  componentDidMount () {
    const { reference, user } = this.props
    if (user.organization) {
      this.setToInitial()
    }
    this.req = axios.all([
      !reference.specialties.length && this.props.fetchReference('specialties'),
      !reference['service-types'].length && this.props.fetchReference('service-types'),
      !reference.regions.length && this.props.fetchReference('regions')
    ])
    this.req.then(() => {
      this.setState({loading: false})
    })
  }

  onSubmit () {
    const { user } = this.props
    const {id, status, cardAccess, card, cardId, entity_type, sendLoading, experienceInSpecialty,
      failed, loading, requiredFieldsInfo, self, diseases, drugs, physicParameters, ...sendData} = this.state

    sendData.avatar = (sendData.avatar && sendData.avatar.id) || null
    sendData.specialties = sendData.specialties && sendData.specialties.map(specialty => { return specialty.id })
    sendData.licenseFile = sendData.licenseFile && sendData.licenseFile.id

    this.setState({sendLoading: true})

    if (user.organization) {
      api.putOrganization(sendData, id)
        .then(({data: {data}}) => {
          this.setState({sendLoading: false})
          this.props.changeUser({...this.props.user, organization: data})
        })
        .catch(({ response: { data: { data } } }) => {
          this.setState({
            errors: data.errors,
            sendLoading: false
          })
        })
    } else {
      api.createOrganization(sendData)
        .then(({data: {data}}) => {
          this.setState({sendLoading: false})
          this.props.changeUser({...this.props.user, organization: data})
        })
        .catch(({ response: { data: { data } } }) => {
          this.setState({
            errors: data.errors,
            sendLoading: false
          })
        })
    }
  }

  onChange (e, field) {
    const { state } = this
    if (field === 'licenseFile') {
      this.setState({[field]: e})
    } else {
      this.setState({[field]: e.target.value})
    }
    if (state.errors && state.errors[`organization[${field}]`]) {
      const _errors = Object.assign({}, state.errors)
      delete _errors[`organization[${field}]`]
      this.setState({errors: _errors})
    }
  }

  render () {
    const { state, props } = this
    const { reference: { regions }, user, intl } = props
    if (state.loading) {
      return (
        <div>
          <header className='page-header'>
            <h2>{ intl.formatMessage(commonIntlMessages.profileTitle) }</h2>
          </header>
          <Spinner />
        </div>
      )
    }

    return (
      <div className='l-profile'>
        <header className='page-header'>
          <h2>{ intl.formatMessage(commonIntlMessages.profileTitle) }</h2>
          {
            user.status === 'need_required_fields'
              ? <div className='warning-pane'>
                { intl.formatMessage(commonIntlMessages.fillProfile) }
              </div>
              : null
          }

          {
            user.status === 'in_moderation'
              ? <div className='warning-pane'>
                { intl.formatMessage(commonIntlMessages.profileModerating) }
              </div>
              : null
          }
        </header>
        <h3>
          { intl.formatMessage(commonIntlMessages.loginDataTitle) }
        </h3>
        <AdminProfile />
        <h3>
          <FormattedMessage
            id='contacts_title'
            defaultMessage='Контактные данные'
          />
        </h3>
        <Card className='card--gray'>
          <CardBody>
            <div className='form-grid'>
              <div className='form-grid__group'>
                <div className='columns'>
                  <div className='column col-4'>
                    <MaterialInput
                      label={intl.formatMessage(intlMessages.labelContactPerson)}
                      value={state.contactPerson || ''}
                      error={state.errors && state.errors['organization[contactPerson]'] && state.errors['organization[contactPerson]'][0]}
                      onChange={e => this.onChange(e, 'contactPerson')}
                    />
                  </div>
                  <div className='column col-4'>
                    <MaterialInput
                      label={intl.formatMessage(intlMessages.labelContactPhone)}
                      phone
                      value={state.contactPhone || ''}
                      error={state.errors && state.errors['organization[contactPhone]'] && state.errors['organization[contactPhone]'][0]}
                      onChange={e => this.onChange(e, 'contactPhone')}
                    />
                  </div>
                  <div className='column col-4'>
                    <MaterialInput
                      label={intl.formatMessage(intlMessages.labelContactEmail)}
                      value={state.contactEmail || ''}
                      error={state.errors && state.errors['organization[contactEmail]'] && state.errors['organization[contactEmail]'][0]}
                      onChange={e => this.onChange(e, 'contactEmail')}
                    />
                  </div>
                </div>

                <div className='columns'>
                  <div className='column col-4'>
                    <MaterialInput
                      label={intl.formatMessage(intlMessages.labelPublicPhone)}
                      phone
                      value={state.publicPhone || ''}
                      error={state.errors && state.errors['organization[publicPhone]'] && state.errors['organization[publicPhone]'][0]}
                      onChange={e => this.onChange(e, 'publicPhone')}
                    />
                  </div>
                  <div className='column col-4'>
                    <MaterialInput
                      label={intl.formatMessage(intlMessages.labelContactEmail)}
                      value={state.publicEmail || ''}
                      error={state.errors && state.errors['organization[publicEmail]'] && state.errors['organization[publicEmail]'][0]}
                      onChange={e => this.onChange(e, 'publicEmail')}
                    />
                  </div>
                </div>

                <div className='columns'>
                  <div className='column col-4'>
                    <MaterialInput
                      label={intl.formatMessage(intlMessages.labelCabinetName)}
                      value={state.name || ''}
                      error={state.errors && state.errors['organization[name]'] && state.errors['organization[name]'][0]}
                      onChange={e => this.onChange(e, 'name')}
                    />
                  </div>
                  <div className='column col-4'>
                    <MaterialInput
                      label={intl.formatMessage(intlMessages.labelLegalName)}
                      value={state.legalName || ''}
                      error={state.errors && state.errors['organization[legalName]'] && state.errors['organization[legalName]'][0]}
                      onChange={e => this.onChange(e, 'legalName')}
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
        <h3>
          <FormattedMessage
            id='profile.public_org_data'
            defaultMessage='Публичные данные организации'
          />
        </h3>
        <Card className='card--gray'>
          <CardBody>
            <div className='form-grid'>
              <div className='columns'>
                <div className='column col-12'>
                  <MultipleAutocomplete
                    label={intl.formatMessage(commonIntlMessages.specialty)}
                    array={state.specialties || []}
                    reference='specialties'
                    searchField='name'
                    onChange={(resultArr) => {
                      const errors = Object.assign({}, state.errors)
                      delete errors[`organization[specialties]`]
                      this.setState({specialties: resultArr, errors})
                    }}
                    error={state.errors && state.errors['organization[specialties]'] && state.errors['organization[specialties]'][0]}
                  />
                </div>
              </div>
              <div className='form-grid__title'>
                <Tooltip
                  error
                  active={state.errors && state.errors['organization[serviceTypes]']}
                  position='right'
                  text={state.errors && state.errors['organization[serviceTypes]'] && state.errors['organization[serviceTypes]'][0]}
                >
                  <span>{intl.formatMessage(commonIntlMessages.doctorServicesTitle)}</span>
                </Tooltip>
              </div>
              <div className='columns'>
                {
                  props.reference['service-types'].map(service => {
                    const checked = state.serviceTypes && state.serviceTypes.indexOf(service.id) + 1
                    return (
                      <div key={service.id} className='column col-4'>
                        <Checkbox
                          label={service.name}
                          checked={checked}
                          onChange={() => {
                            let serviceTypes = state.serviceTypes ? state.serviceTypes.slice(0) : []
                            const errors = state.errors
                            if (checked) {
                              serviceTypes = serviceTypes.filter(s => s !== service.id)
                            } else {
                              serviceTypes.push(service.id)
                            }
                            this.setState({serviceTypes})
                            if (errors && errors['organization[serviceTypes]']) {
                              delete errors['organization[serviceTypes]']
                              this.setState({errors})
                            }
                          }}
                        />
                      </div>
                    )
                  })
                }
              </div>
              <div className='column col-12'>
                <MaterialInput
                  textarea
                  minRows={4}
                  label={intl.formatMessage(intlMessages.orgDescription)}
                  value={state.description || ''}
                  error={state.errors && state.errors['organization[description]'] && state.errors['organization[description]'][0]}
                  onChange={e => this.onChange(e, 'description')}
                />
              </div>
            </div>
          </CardBody>
        </Card>

        <h3>
          <FormattedMessage
            id='org.licence.title'
            defaultMessage='Лицензия'
          />
        </h3>
        <Card className='card--gray'>
          <CardBody>
            <div className='form-grid'>
              <div className='columns'>
                <div className='column col-4'>
                  <MaterialInput
                    label={intl.formatMessage(intlMessages.labelLicenceNumber)}
                    value={state.licenseNumber || ''}
                    error={state.errors && state.errors['organization[licenseNumber]'] && state.errors['organization[licenseNumber]'][0]}
                    onChange={e => this.onChange(e, 'licenseNumber')}
                  />
                </div>
                <div className='column col-4'>
                  <DateInput
                    label={intl.formatMessage(intlMessages.labelLicenceDate)}
                    error={state.errors && state.errors['organization[licenseDate]'] && state.errors['organization[licenseDate]'][0]}
                    value={state.licenseDate && moment(state.licenseDate).format('DD.MM.YYYY')}
                    dayPickerProps={{
                      onDayClick: (date, dateProps) => {
                        if (dateProps.disabled) {
                          return
                        }
                        this.setState({
                          licenseDate: moment(date).format('YYYY-MM-DDTHH:mm:ssZ')
                        })
                      }
                    }}
                  />
                </div>
              </div>
              <div className='columns'>
                <div className='column col-12'>
                  <Files
                    files={state.licenseFile}
                    error={state.errors && state.errors['organization[licenseFile]'] && state.errors['organization[licenseFile]'][0]}
                    onChange={(file) => this.onChange(file, 'licenseFile')}
                  />
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
        <h3>{ intl.formatMessage(commonIntlMessages.address) }</h3>
        <Card className='card--gray'>
          <CardBody>
            <div className='form-grid'>
              <div className='columns'>
                <div className='column col-12'>
                  <Select
                    material
                    label={intl.formatMessage(commonIntlMessages.labelRegion)}
                    error={state.errors && state.errors['organization[region]'] && state.errors['organization[region]'][0]}
                    onChange={e => this.onChange(e, 'region')}
                    value={state.region || ''}
                  >
                    {
                      regions.map((region) => {
                        return (
                          <option
                            value={region.id}
                            key={region.id}
                          >
                            { region.name }
                          </option>
                        )
                      })
                    }
                  </Select>
                </div>
                <div className='column col-12'>
                  <MaterialInput
                    label={intl.formatMessage(commonIntlMessages.labelCity)}
                    value={state.city || ''}
                    error={state.errors && state.errors['organization[city]'] && state.errors['organization[city]'][0]}
                    onChange={e => this.onChange(e, 'city')}
                  />
                </div>
                <div className='column col-12'>
                  <MaterialInput
                    label={intl.formatMessage(commonIntlMessages.labelAddress)}
                    value={state.address || ''}
                    error={state.errors && state.errors['organization[address]'] && state.errors['organization[address]'][0]}
                    onChange={e => this.onChange(e, 'address')}
                  />
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
        <div className='l-profile__buttons'>
          <Button
            onClick={this.onSubmit}
            loading={state.sendLoading}
          >
            {intl.formatMessage(commonIntlMessages.saveChangesBtn)}
          </Button>
          <Button
            ghost
            onClick={this.setToInitial}
          >
            {intl.formatMessage(commonIntlMessages.cancelChangesBtn)}
          </Button>
        </div>
      </div>
    )
  }
}

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
    },

    changeUser: function (data) {
      return dispatch(changeUser(data))
    }
  }
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(OrgProfile))

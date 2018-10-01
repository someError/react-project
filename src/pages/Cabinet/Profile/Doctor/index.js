import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import linkState from 'linkstate'
import moment from 'moment-timezone'
import FeatherIcon from '../../../../components/Icons/FeatherIcon'
import { Card, CardBody } from '../../../../components/Card'
import MultipleAutocomplete from '../../../../components/Form/MultipleAutocomplete'
import { MaterialInput, DateInput, Select, Checkbox, AddButton } from '../../../../components/Form'
import { fetchReference } from '../../../../redux/reference/actions'
import owasp from '../../../../util/owasp'
import { Spinner, OverlaySpinner } from '../../../../components/Loader'
import Button from '../../../../components/Button'
import Template from '../../../../components/Template'
import api from '../../../../api'
import AvatarUploader from '../../../../components/Avatar/AvatarUploader'
import { changeUser } from '../../../../redux/user/actions'
import { Files } from '../../../../components/Files'
import Tooltip from '../../../../components/Tooltip'
import ConfirmModal from '../ConfirmModal'
import { Tile, TileContent, TileAction } from '../../../../components/Tile'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl'

import commonIntlMessages from '../../../../i18n/common-messages'

import { normalizeLogin, owaspMessages } from '../../../../util'

owasp.config({
  minLength: 6
})

const DIPLOMA_SCHEME = {
  number: '',
  year: '',
  educationalInstitution: '',
  files: [],
  description: ''
}

const intlMessages = defineMessages({
  diplomaNumber: {
    id: 'diploma_number',
    defaultMessage: 'Номер диплома'
  },
  diplomaYear: {
    id: 'diploma_year',
    defaultMessage: 'Год выдачи'
  },
  diplomaInstitution: {
    id: 'diploma_institution',
    defaultMessage: 'Учебное заведение'
  },
  diplomaDescription: {
    id: 'diploma_description',
    defaultMessage: 'Описание'
  }
})

class DoctorProfile extends Component {
  constructor (props) {
    super()
    this.state = {
      loading: true,
      invitesLoading: true,
      organizations: props.user.organizations
    }
    this.onSubmit = this.onSubmit.bind(this)
    this.setToInitial = this.setToInitial.bind(this)
    this.addDiploma = this.addDiploma.bind(this)
  }

  setToInitial () {
    const { user } = this.props
    const { serviceTypes, diplomas, region, organizations, ...userProps } = user
    this.setState({
      files: [],
      serviceTypes: serviceTypes.map(service => { return service.id }),
      diplomas: diplomas.length ? diplomas : [DIPLOMA_SCHEME],
      region: region && region.id,
      ...userProps
    })
  }

  addDiploma () {
    const diplomas = JSON.parse(JSON.stringify(this.state.diplomas))
    diplomas.push(DIPLOMA_SCHEME)
    this.setState({diplomas})
  }

  componentDidMount () {
    const { reference } = this.props
    this.setToInitial()
    this.req = axios.all([
      !reference.specialties.length && this.props.fetchReference('specialties'),
      !reference['service-types'].length && this.props.fetchReference('service-types'),
      !reference.regions.length && this.props.fetchReference('regions')
    ])
    this.req.then(() => {
      this.setState({loading: false})
      api.getInvites()
        .then(({data: { data }}) => {
          this.setState({
            invitesLoading: false,
            invites: data.items
          })
        })
        .catch(() => {
          this.setState({
            invitesLoading: false
          })
        })
    })
  }

  onSubmit () {
    const {file, organizations, status, cardAccess, invitesLoading, invites, card, cardId, entity_type, sendLoading,
      failed, loading, requiredFieldsInfo, self, password, phone, email, newPassword, interfaceLanguage, ...sendData} = this.state
    sendData.specialties = sendData.specialties.map(specialty => { return specialty.id })
    sendData.avatar = sendData.avatar && sendData.avatar.id

    const diplomas = JSON.parse(JSON.stringify(sendData.diplomas))
    diplomas.map((diploma) => {
      if (diploma.files.length) {
        diploma.files = diploma.files.map(file => {
          return file.id
        })
      }
      return (
        diploma
      )
    })
    sendData.diplomas = diplomas

    sendData.user = {}
    if (password) sendData.user.password = password
    if (newPassword && (newPassword.first || newPassword.second)) {
      sendData.user.newPassword = newPassword
    }
    if (email) {
      sendData.user.email = email
    }

    if (phone) {
      sendData.user.phone = normalizeLogin(phone)
      sendData.publicPhone = phone
    }

    this.setState({sendLoading: true})
    api.putUser(sendData, 'doctor')
      .then(({data: {data}}) => {
        this.setState({sendLoading: false})
        this.props.changeUser(data.user)
        if (Object.keys(data.changed_providers).length) {
          this.setState({
            showConfirmModal: true,
            changedProviders: data.changed_providers
          })
        }
      })
      .catch(({ response: { data: { data } } }) => {
        this.setState({
          errors: data.errors,
          sendLoading: false
        })
      })
  }

  onChange (e, field) {
    const { state } = this
    this.setState({[field]: e.target.value})
    if (state.errors && state.errors[`doctor[${field}]`]) {
      const _errors = Object.assign({}, state.errors)
      delete _errors[`doctor[${field}]`]
      this.setState({errors: _errors})
    }
  }

  onDiplomaChange (e, i, field) {
    const { state } = this
    const diplomas = JSON.parse(JSON.stringify(this.state.diplomas))
    if (field === 'files') {
      diplomas[i]['files'] = e
    } else {
      diplomas[i][field] = e.target.value
    }
    if (state.errors && state.errors[`doctor[diplomas][${i}][${field}]`]) {
      const _errors = Object.assign({}, state.errors)
      delete _errors[`doctor[diplomas][${i}][${field}]`]
      this.setState({errors: _errors})
    }
    this.setState({diplomas})
  }

  onDayChange (date) {
    const { state } = this
    if (date) {
      this.setState({
        birthday: moment(date).format('YYYY-MM-DDTHH:mm:ssZ')
      })
    } else {
      this.setState({
        birthday: null
      })
    }
    if (state.errors && state.errors['doctor[birthday]']) {
      const errors = state.errors
      delete errors['doctor[birthday]']
      this.setState({errors})
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

        <h3>{ intl.formatMessage(commonIntlMessages.personalDataTitle) }</h3>
        <Card className='card--gray'>
          <CardBody>
            <div className='form-grid'>
              <div className='form-grid__group'>
                <div className='columns'>
                  <div className='column col-12'>
                    <AvatarUploader
                      initial={(user.lastName || ' ')[0] + (user.firstName || ' ')[0]}
                      src={(state.avatar && state.avatar.url) || (state.file && state.file.url)}
                      file={state.file}
                      onClear={() => {
                        this.setState({
                          file: null,
                          avatar: null
                        })
                      }}
                      onChange={(file) => {
                        if (file) {
                          console.log(file.id)
                          this.setState({
                            file,
                            avatar: file
                          })
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className='form-grid__group'>
                <div className='columns'>
                  <div className='column col-4'>
                    <MaterialInput
                      label={intl.formatMessage(commonIntlMessages.lastName)}
                      value={state.lastName || ''}
                      error={state.errors && state.errors['doctor[lastName]'] && state.errors['doctor[lastName]'][0]}
                      onChange={e => this.onChange(e, 'lastName')}
                    />
                  </div>
                  <div className='column col-4'>
                    <MaterialInput
                      label={intl.formatMessage(commonIntlMessages.firstName)}
                      value={state.firstName || ''}
                      error={state.errors && state.errors['doctor[firstName]'] && state.errors['doctor[firstName]'][0]}
                      onChange={e => this.onChange(e, 'firstName')}
                    />
                  </div>
                  <div className='column col-4'>
                    <MaterialInput
                      label={intl.formatMessage(commonIntlMessages.middleName)}
                      value={state.middleName || ''}
                      onChange={linkState(this, 'middleName')}
                    />
                  </div>
                </div>

                <div className='columns'>
                  <div className='column col-4'>
                    <DateInput
                      label={intl.formatMessage(commonIntlMessages.labelBirthDate)}
                      error={state.errors && state.errors['doctor[birthday]'] && state.errors['doctor[birthday]'][0]}
                      value={state.birthday && moment(state.birthday).format('DD.MM.YYYY')}
                      dayPickerProps={{
                        onDayClick: (date, dateProps) => (date) => this.onDayChange(date)
                      }}
                      onDayChange={(date) => this.onDayChange(date)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        <Template>
          <h3>{ intl.formatMessage(commonIntlMessages.publicDataTitle) }</h3>
          <Card className='card--gray'>
            <CardBody>
              <div className='form-grid'>
                <div className='columns'>
                  <div className='column col-9'>

                    { /* Autocomplete start */ }
                    <MultipleAutocomplete
                      label={intl.formatMessage(commonIntlMessages.specialty)}
                      array={state.specialties}
                      error={state.errors && state.errors['doctor[specialties]'] && state.errors['doctor[specialties]'][0]}
                      reference='specialties'
                      searchField='name'
                      onChange={(resultArr) => {
                        const errors = state.errors
                        this.setState({specialties: resultArr})
                        if (errors && errors['doctor[specialties]']) {
                          delete errors['doctor[specialties]']
                          this.setState({errors})
                        }
                      }}
                    />
                    { /* Autocomplete end */ }
                  </div>
                  <div className='column col-3'>
                    <MaterialInput
                      value={state.experienceInSpecialty || ''}
                      label={intl.formatMessage(commonIntlMessages.labelExperience)}
                      onChange={e => this.onChange(e, 'experienceInSpecialty')}
                    />
                  </div>
                </div>

                <div className='columns'>
                  <div className='column col-12'>
                    <MaterialInput
                      textarea
                      minRows={4}
                      label={intl.formatMessage(commonIntlMessages.doctorSpecialtiesTitle)}
                      value={state.specialization || ''}
                      error={state.errors && state.errors['doctor[specialization]'] && state.errors['doctor[specialization]'][0]}
                      onChange={e => this.onChange(e, 'specialization')}
                    />
                  </div>
                </div>
                <div className='form-grid__title'>
                  <Tooltip
                    error
                    active={state.errors && state.errors['doctor[serviceTypes]']}
                    position='right'
                    text={state.errors && state.errors['doctor[serviceTypes]'] && state.errors['doctor[serviceTypes]'][0]}
                  >
                    <span>{ intl.formatMessage(commonIntlMessages.doctorServicesTitle) }</span>
                  </Tooltip>
                </div>
                <div className='columns'>
                  {
                    props.reference['service-types'].map(service => {
                      const checked = state.serviceTypes.indexOf(service.id) + 1
                      return (
                        <div key={service.id} className='column col-4'>
                          <Checkbox
                            label={service.name}
                            checked={checked}
                            onChange={() => {
                              let serviceTypes = state.serviceTypes.slice(0)
                              const errors = state.errors
                              if (checked) {
                                serviceTypes = serviceTypes.filter(s => s !== service.id)
                              } else {
                                serviceTypes.push(service.id)
                              }
                              this.setState({serviceTypes})
                              if (errors && errors['doctor[serviceTypes]']) {
                                delete errors['doctor[serviceTypes]']
                                this.setState({errors})
                              }
                            }}
                          />
                        </div>
                      )
                    })
                  }
                </div>

                <div className='columns'>
                  <div className='column col-12'>
                    <MaterialInput
                      textarea
                      minRows={6}
                      label={intl.formatMessage(commonIntlMessages.labelAdditionalInfo)}
                      value={state.additionalInformation || ''}
                      error={state.errors && state.errors['doctor[additionalInformation]'] && state.errors['doctor[additionalInformation]'][0]}
                      onChange={e => this.onChange(e, 'additionalInformation')}
                    />
                  </div>
                </div>

              </div>
            </CardBody>
          </Card>
        </Template>

        {((state.invites && state.invites.length) || (state.organizations && state.organizations.length)) ? <h3>{ intl.formatMessage(commonIntlMessages.doctorOrgsTitle) }</h3> : null}

        {
          user.status === 'enabled' && state.invitesLoading && !state.invites
            ? <div style={{minHeight: '6rem', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Spinner /></div>
            : null
        }

        {
          user.status === 'enabled' && state.invites && state.invites.length
            ? (
              <div className='l-profile__orgs'>
                <div className='l-profile__orgs-title'>
                  <FormattedMessage
                    id='attaches_requests.title'
                    defaultMessage='Заявки о прикреплении'
                  />
                </div>
                <div className='spinner-wrap'>
                  { state.invitesLoading && <OverlaySpinner /> }

                  {
                    state.invites.map((invite, i) => {
                      // if (invite.status !== 'request') return
                      return (
                        <Card>
                          <div className='l-profile__orgs-item'>
                            <Tile>
                              <TileContent>
                                { invite.organization.name }
                              </TileContent>
                              <TileAction>
                                <Button
                                  style={{background: '#1bbeb5'}}
                                  onClick={() => {
                                    this.setState({invitesLoading: true})
                                    api.allowInvite(invite.id)
                                      .then(({data: {data}}) => {
                                        const invites = state.invites.splice(i, 1)
                                        const organizations = state.organizations

                                        organizations.push(data.organization)
                                        invites.splice(i, 1)

                                        this.setState({invites, invitesLoading: false, organizations})
                                      })
                                  }}
                                  size='xs'
                                >
                                  { intl.formatMessage(commonIntlMessages.confirm) }
                                </Button>
                                <Button
                                  size='xs'
                                  onClick={() => {
                                    this.setState({invitesLoading: true})
                                    api.declineInvite(invite.id)
                                      .then(() => {
                                        const invites = state.invites
                                        invites.splice(i, 1)
                                        this.setState({invites, invitesLoading: false})
                                      })
                                  }}
                                  ghost
                                >
                                  { intl.formatMessage(commonIntlMessages.decline) }
                                </Button>
                              </TileAction>
                            </Tile>
                          </div>
                        </Card>
                      )
                    })
                  }
                </div>
              </div>
            ) : null
        }

        {
          state.organizations && state.organizations.length
            ? (
              <div className='l-profile__orgs'>
                <div className='l-profile__orgs-title'>
                  <FormattedMessage
                    id='work_at_orgs'
                    defaultMessage='Работаю в медучреждениях'
                  />
                </div>
                <div className='spinner-wrap'>
                  { state.orgActionLoading && <OverlaySpinner /> }

                  {
                    state.organizations.map((organization, i) => {
                      return (
                        <Card>
                          <div className='l-profile__orgs-item'>
                            <Tile>
                              <TileContent>
                                { organization.name }
                              </TileContent>
                              <TileAction>
                                <Button
                                  size='xs'
                                  onClick={() => {
                                    this.setState({orgActionLoading: true})
                                    api.unlinkDoctor(user.id, organization.id)
                                      .then(() => {
                                        const organizations = state.organizations
                                        organizations.splice(i, 1)
                                        this.setState({organizations, orgActionLoading: false})
                                      })
                                  }}
                                  ghost
                                >
                                  <FormattedMessage
                                    id='profile.detach.btn'
                                    defaultMessage='Открепиться'
                                  />
                                </Button>
                              </TileAction>
                            </Tile>
                          </div>
                        </Card>
                      )
                    })
                  }
                </div>
              </div>
            ) : null
        }

        <h3>
          <FormattedMessage
            id='profile.diplomas.title'
            defaultMessage='Дипломы и лицензии'
          />
        </h3>
        <Card className='card--gray'>
          <CardBody>
            <div className='form-grid'>
              {
                state.diplomas.map((diploma, i) => {
                  return (
                    <div key={`${diploma}-${i}`} className='l-diploma'>
                      {
                        state.diplomas.length > 1 && (
                          <FeatherIcon
                            icon='x'
                            className='l-diploma__delete'
                            color='#9F9F9F'
                            onClick={() => {
                              const diplomas = state.diplomas
                              diplomas.splice(i, 1)
                              this.setState({diplomas})
                            }}
                          />
                        )
                      }
                      <div className='columns'>
                        <div className='column col-3'>
                          <MaterialInput
                            label={intl.formatMessage(intlMessages.diplomaNumber)}
                            value={state.diplomas[i].number || ''}
                            error={state.errors &&
                            state.errors[`doctor[diplomas][${i}][number]`] &&
                            state.errors[`doctor[diplomas][${i}][number]`][0]}
                            onChange={(e) => this.onDiplomaChange(e, i, 'number')}
                          />
                        </div>
                        <div className='column col-2'>
                          <MaterialInput
                            label={intl.formatMessage(intlMessages.diplomaYear)}
                            value={state.diplomas[i].year || ''}
                            error={state.errors &&
                            state.errors[`doctor[diplomas][${i}][year]`] &&
                            state.errors[`doctor[diplomas][${i}][year]`][0]}
                            onChange={(e) => this.onDiplomaChange(e, i, 'year')}
                          />
                        </div>
                      </div>
                      <div className='columns'>
                        <div className='column col-12'>
                          <MaterialInput
                            label={intl.formatMessage(intlMessages.diplomaInstitution)}
                            value={state.diplomas[i].educationalInstitution || ''}
                            error={state.errors &&
                            state.errors[`doctor[diplomas][${i}][educationalInstitution]`] &&
                            state.errors[`doctor[diplomas][${i}][educationalInstitution]`][0]}
                            onChange={(e) => this.onDiplomaChange(e, i, 'educationalInstitution')}
                          />
                        </div>
                      </div>
                      <div className='columns'>
                        <div className='column col-12'>
                          <MaterialInput
                            label={intl.formatMessage(intlMessages.diplomaDescription)}
                            value={state.diplomas[i].description || ''}
                            onChange={(e) => this.onDiplomaChange(e, i, 'description')}
                          />
                        </div>
                      </div>
                      <Files
                        multiple
                        error={state.errors &&
                        state.errors[`doctor[diplomas][${i}][files]`] &&
                        state.errors[`doctor[diplomas][${i}][files]`][0]}
                        files={state.diplomas[i].files}
                        onChange={(files) => this.onDiplomaChange(files, i, 'files')}
                      />
                    </div>
                  )
                })
              }
            </div>
            <AddButton
              onClick={this.addDiploma}
            >
              <FormattedMessage
                id='add_diploma'
                defaultMessage='Добавить диплом'
              />
            </AddButton>
          </CardBody>
        </Card>

        <h3>{ intl.formatMessage(commonIntlMessages.labelAddress) }</h3>
        <Card className='card--gray'>
          <CardBody>
            <div className='form-grid'>
              <div className='columns'>
                <div className='column col-12'>
                  <Select
                    material
                    label={intl.formatMessage(commonIntlMessages.labelRegion)}
                    error={state.errors && state.errors['doctor[region]'] && state.errors['doctor[region]'][0]}
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
                    error={state.errors && state.errors['doctor[city]'] && state.errors['doctor[city]'][0]}
                    onChange={e => this.onChange(e, 'city')}
                  />
                </div>
                <div className='column col-12'>
                  <MaterialInput
                    label={intl.formatMessage(commonIntlMessages.labelAddress)}
                    value={state.address || ''}
                    error={state.errors && state.errors['doctor[address]'] && state.errors['doctor[address]'][0]}
                    onChange={e => this.onChange(e, 'address')}
                  />
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        <h3>
          { intl.formatMessage(commonIntlMessages.loginDataTitle) }
        </h3>
        <Card className='card--gray'>
          <CardBody>
            <div className='form-grid'>
              <div className='columns'>
                <div className='column col-4'>
                  <MaterialInput
                    label={intl.formatMessage(commonIntlMessages.phone)}
                    phone
                    value={state.phone || ''}
                    error={state.errors && state.errors[`doctor[user][phone]`] && state.errors[`doctor[user][phone]`][0]}
                    onChange={e => {
                      this.setState({phone: e.target.value})
                      if (state.errors && state.errors[`doctor[user][phone]`]) {
                        const _errors = Object.assign({}, state.errors)
                        delete _errors[`doctor[user][phone]`]
                        this.setState({errors: _errors})
                      }
                    }}
                  />
                </div>
                <div className='column col-8'>
                  <MaterialInput
                    label={intl.formatMessage(commonIntlMessages.email)}
                    value={state.email || ''}
                    error={state.errors && state.errors[`doctor[user][email]`] && state.errors[`doctor[user][email]`][0]}
                    onChange={e => {
                      this.setState({email: e.target.value})
                      if (state.errors && state.errors[`doctor[user][email]`]) {
                        const _errors = Object.assign({}, state.errors)
                        delete _errors[`doctor[user][email]`]
                        this.setState({errors: _errors})
                      }
                    }}
                  />
                </div>
              </div>
              <div className='columns'>
                <div className='column col-7'>
                  <MaterialInput
                    label={intl.formatMessage(commonIntlMessages.labelOldPassword)}
                    error={state.errors && state.errors[`password`]}
                    type='password'
                    value={state.password || ''}
                    onChange={e => {
                      this.setState({password: e.target.value})
                      if (state.errors && state.errors.password) {
                        const _errors = Object.assign({}, state.errors)
                        delete _errors.password
                        this.setState({errors: _errors})
                      }
                    }}
                  />
                </div>
              </div>
              <div className='columns'>
                <div className='column col-7'>
                  <MaterialInput
                    label={intl.formatMessage(commonIntlMessages.labelNewPassword)}
                    type='password'
                    value={(state.newPassword && state.newPassword.first) || ''}
                    error={state.errors && owaspMessages[state.errors.passwordFirst]}
                    onChange={(e) => {
                      const _pass = state.newPassword || {}
                      const _test = owasp.test(e.target.value)
                      const _errors = state.errors || {}

                      _pass.first = e.target.value
                      if (_pass.second) {
                        delete _pass.second
                        _errors.passwordSecond && delete _errors.passwordSecond
                      }
                      if (_test.errors[0]) {
                        _errors.passwordFirst = _test.errors[0]
                      }
                      if (!_test.errors.length || !e.target.value) {
                        _errors.passwordFirst && delete _errors.passwordFirst
                      }
                      this.setState({
                        newPassword: _pass,
                        errors: _errors
                      })
                    }}
                  />
                </div>
                <div className='column col-5' style={{alignSelf: 'center'}}>
                  {
                    state.newPassword && state.newPassword.first.length >= 8 && owasp.test(state.newPassword.first).strong &&
                      <i className='color-green'>{intl.formatMessage(commonIntlMessages.labelSecure)}</i>
                  }
                  {
                    state.newPassword && state.newPassword.first.length < 8 && owasp.test(state.newPassword.first).strong &&
                    <i className='color-yellow'>{intl.formatMessage(commonIntlMessages.labelMedium)}</i>
                  }
                </div>
              </div>
              <div className='columns'>
                <div className='column col-7'>
                  <MaterialInput
                    label={intl.formatMessage(commonIntlMessages.labelRepeatPassword)}
                    type='password'
                    value={(state.newPassword && state.newPassword.second) || ''}
                    error={state.errors && state.errors.passwordSecond}
                    onChange={(e) => {
                      const _pass = state.newPassword || {}
                      _pass.second = e.target.value

                      const _errors = state.errors || {}
                      if (state.newPassword && state.newPassword.first !== state.newPassword.second) {
                        _errors.passwordSecond = intl.formatMessage(commonIntlMessages.wrongRepeatPassword)
                      }
                      if (!state.newPassword.first || state.newPassword.first === state.newPassword.second) {
                        _errors.passwordSecond && delete _errors.passwordSecond
                      }
                      this.setState({
                        newPassword: _pass,
                        errors: _errors
                      })
                    }}
                  />
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
        {/* <h3>Подписки и уведомления</h3> */}
        {/* <Checkbox */}
        {/* onChange={() => this.setState({settingSubscriptionNotification: !state.settingSubscriptionNotification})} */}
        {/* checked={state.settingSubscriptionNotification} */}
        {/* label='Подписаться на рассылки и уведомления' */}
        {/* /> */}
        <div className='l-profile__buttons'>
          <Button
            onClick={this.onSubmit}
            loading={state.sendLoading}
          >
            { intl.formatMessage(commonIntlMessages.saveChangesBtn) }
          </Button>
          <Button
            ghost
            onClick={this.setToInitial}
          >
            { intl.formatMessage(commonIntlMessages.cancelChangesBtn) }
          </Button>
        </div>

        {
          state.showConfirmModal && <ConfirmModal
            onClose={() => this.setState({showConfirmModal: false})}
            changedProviders={state.changedProviders}
          />
        }

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

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(DoctorProfile))

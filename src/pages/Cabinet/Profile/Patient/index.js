import React, { Component } from 'react'
import { connect } from 'react-redux'
import store from '../../../../redux/store'
import axios from 'axios'
import linkState from 'linkstate'
import moment from 'moment-timezone'
import classNames from 'classnames'
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl'
import { Card, CardBody } from '../../../../components/Card'
import { MaterialInput, DateInput, Select, RadioGroup, RadioGroupButton, Checkbox } from '../../../../components/Form'
import MultipleAutocomplete from '../../../../components/Form/MultipleAutocomplete'
import { fetchReference } from '../../../../redux/reference/actions'
import owasp from '../../../../util/owasp'
import { Spinner } from '../../../../components/Loader'
import Button from '../../../../components/Button'
import CapCard from '../../../../components/CapCard'
import Template from '../../../../components/Template'
import api from '../../../../api'
import AvatarUploader from '../../../../components/Avatar/AvatarUploader'
import MediaQuery from '../../../../components/MediaQuery'
import { changeUser } from '../../../../redux/user/actions'
import CapInfo from './EntityViews/CapInfo'
import FeatherIcon from '../../../../components/Icons/FeatherIcon'
import Modal from '../../../../components/Modal'
import ConfirmModal from '../ConfirmModal'
import '../style.css'

import { normalizeLogin, owaspMessages } from '../../../../util'
import NavLink from 'react-router-dom/es/NavLink'

import commonIntlMessages from '../../../../i18n/common-messages'

const intlMessages = defineMessages({
  labelHeight: {
    id: 'label.height',
    defaultMessage: 'Рост'
  },
  labelSex: {
    id: 'label.sex',
    defaultMessage: 'Пол'
  },
  labelMale: {
    id: 'label.sex.male',
    defaultMessage: 'Мужской'
  },
  labelFemale: {
    id: 'label.sex.female',
    defaultMessage: 'Женский'
  },
  labelTimezone: {
    id: 'profile.label.timezone',
    defaultMessage: 'Часовой пояс пребывания'
  },
  capLabelProductionRequest: {
    id: 'cap.label.prod_request',
    defaultMessage: 'Запрос на изготовление'
  },
  capTextProductionRequest: {
    id: 'cap.text.prod_request',
    defaultMessage: 'Запрос отправлен. В ближайшее время вам позвонит оператор и уточнит детали.'
  },
  capLabelInProduction: {
    id: 'cap.label.in_production',
    defaultMessage: 'Изготавливается'
  },
  capTextInProduction: {
    id: 'cap.text.in_production',
    defaultMessage: 'Ваша карта будет сделана приблизительно через 2 недели.'
  },
  capLabelPendingActivate: {
    id: 'cap.label.pending_activate',
    defaultMessage: 'Ожидает активации'
  },
  capTextPendingActivate: {
    id: 'cap.text.pending_activate',
    defaultMessage: '<div>Ваша карта готова. Вы можете забрать ее по адресу: <strong>г. Астана, Сарайшык 11/1 с 9:00 до 21:00. </strong> Если возникнут вопросы, позвоните по телефону: <strong>+7 (495) 432-34-14</strong></div>'
  },
  capLabelActive: {
    id: 'cap.label.active',
    defaultMessage: 'Активна'
  },
  capTextActive: {
    id: 'cap.text.active',
    defaultMessage: 'Ваша карта активирована и ей можно пользоваться.'
  },
  capLabelOff: {
    id: 'cap.label.off',
    defaultMessage: 'Отключена'
  },
  capTextOff: {
    id: 'cap.text.off',
    defaultMessage: 'Ваша карта отключена и недоступна для использования.'
  },
  capLabelUsed: {
    id: 'cap.label.used',
    defaultMessage: 'Использованна'
  },
  capWhatFor: {
    id: 'cap.what_for',
    defaultMessage: 'Если с вами что-то случится, КЭП поможет связаться с вашими родными и близкими.'
  },
  aboutCap: {
    id: 'about_cap',
    defaultMessage: 'Подробнее о КЭП'
  },
  orderCap: {
    id: 'order_cap',
    defaultMessage: 'Заказать кэп'
  },
  configCard: {
    id: 'cap.config',
    defaultMessage: 'Настроить карту'
  },
  capTurnOff: {
    id: 'cap.turn_off',
    defaultMessage: 'Отключить'
  },
  capTurnOn: {
    id: 'cap.turn_on',
    defaultMessage: 'Включить'
  },
  capOrderNew: {
    id: 'cap.order_new',
    defaultMessage: 'Заказать новую кэп'
  }
})

owasp.config({
  minLength: 6
})

class PatientProfile extends Component {
  constructor ({ user: { sos } }) {
    super()
    this.state = {
      loading: true,
      capInfo: sos
    }
    this.onSubmit = this.onSubmit.bind(this)
    this.setToInitial = this.setToInitial.bind(this)
    this.getCap = this.getCap.bind(this)
  }

  setToInitial () {
    const { user } = this.props
    const { blood, timezone, ...userProps } = user
    this.setState({
      ...userProps,
      blood: (blood && blood.id) || '',
      timezone: (timezone && timezone.id) || '',
      physicParameters: this.props.reference.parameters.map((parameter) => {
        const filledParameter = user.physicParameters.filter(p => { return p.parameter.code === parameter.code })

        parameter.normalValueFrom = ''
        parameter.normalValueTo = ''
        if (filledParameter.length) {
          parameter = filledParameter[0]
        }
        return parameter
      })
    })
  }

  componentDidMount () {
    const { reference } = this.props
    this.req = axios.all([
      !reference['bloods'].length && this.props.fetchReference('bloods'),
      !reference['parameters'].length && this.props.fetchReference('parameters'),
      !reference['timezones'].length && this.props.fetchReference('timezones')
    ])
    this.req.then(() => {
      this.setToInitial()
      this.setState({loading: false})
    })
  }

  onSubmit () {
    const {showCapInfo, file, organizations, status, cardAccess, card, cardId, entity_type, sendLoading, capInfoLoading,
      capInfo, failed, loading, requiredFieldsInfo, self, phone, email, region, diseases, newPassword, password, physicParameters, ...sendData} = this.state
    const _physicParameters = JSON.parse(JSON.stringify(physicParameters))

    _physicParameters.map(parameter => {
      parameter.parameter = (parameter.parameter && parameter.parameter.id) || parameter.id
      parameter.unit = (parameter.unit && parameter.unit.id) || (parameter.units && parameter.units[0].id)
    })
    sendData.physicParameters = _physicParameters

    sendData.avatar = (sendData.avatar && sendData.avatar.id) || null
    sendData.drugs = sendData.drugs.length ? sendData.drugs.map(res => {
      return (res.id)
    }) : null

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
    }

    this.setState({sendLoading: true})
    api.putUser(sendData, 'patient')
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
    if (state.errors && state.errors[`patient[${field}]`]) {
      const _errors = Object.assign({}, state.errors)
      delete _errors[`patient[${field}]`]
      this.setState({errors: _errors})
    }
  }

  onParameterChange (i, parameter, value) {
    const { state } = this
    const parameters = JSON.parse(JSON.stringify(this.state.physicParameters))
    parameters[i][parameter] = value
    this.setState({physicParameters: parameters})
    if (state.errors && state.errors[`patient[physicParameters][${i}][${parameter}]`]) {
      const _errors = Object.assign({}, state.errors)
      delete _errors[`patient[physicParameters][${i}][${parameter}]`]
      this.setState({errors: _errors})
    }
  }

  getCap () {
    this.setState({capInfoLoading: true})
    api.postEmergenciesCard()
      .then(({data: {data}}) => {
        this.setState({
          capInfo: data,
          capInfoLoading: false
        })
      })
      .catch(() => {
        this.setState({capInfoLoading: false})
      })
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
    if (state.errors && state.errors['patient[birthday]']) {
      const errors = state.errors
      delete errors['patient[birthday]']
      this.setState({errors})
    }
  }

  render () {
    const { state, props } = this
    const { reference: { bloods, timezones }, user, intl } = props
    if (state.loading) {
      return (
        <div>
          <header className='page-header'>
            <h2>{ intl.formatMessage(commonIntlMessages.profileTitle) }</h2>
            { this.renderCap() }
          </header>
          <Spinner />
        </div>
      )
    }

    // const physicParameters = props.reference.parameters.map((parameter) => {
    //   const filledParameter = user.physicParameters.filter(p => { return p.id === parameter.id })
    //   parameter.normalValueFrom = ''
    //   parameter.normalValueTo = ''
    //   if (filledParameter.length) {
    //     parameter = filledParameter
    //   }
    //   return parameter
    // })
    return (
      <div className='l-profile'>
        <header className='page-header'>
          <h2>{ intl.formatMessage(commonIntlMessages.profileTitle) }</h2>

          {
            user.status !== 'enabled'
              ? <div className='warning-pane'>
                { intl.formatMessage(commonIntlMessages.fillProfile) }
              </div>
              : null
          }

          { this.renderCap() }
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
                      error={state.errors && state.errors['patient[lastName]'] && state.errors['patient[lastName]'][0]}
                      onChange={e => this.onChange(e, 'lastName')}
                    />
                  </div>
                  <div className='column col-4'>
                    <MaterialInput
                      label={intl.formatMessage(commonIntlMessages.firstName)}
                      value={state.firstName || ''}
                      error={state.errors && state.errors['patient[firstName]'] && state.errors['patient[firstName]'][0]}
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
                      error={state.errors && state.errors['patient[birthday]'] && state.errors['patient[birthday]'][0]}
                      value={state.birthday && moment(state.birthday).format('DD.MM.YYYY')}
                      dayPickerProps={{
                        onDayClick: date => this.onDayChange(date)
                      }}
                      onDayChange={date => this.onDayChange(date)}
                    />
                  </div>
                  <div className='column col-6'>
                    <Select
                      material
                      label={intl.formatMessage(commonIntlMessages.labelBloodRhesus)}
                      onChange={e => this.onChange(e, 'blood')}
                      value={state.blood || ''}
                    >
                      {
                        bloods.map((blood) => {
                          return (
                            <option
                              value={blood.id}
                              key={blood.id}
                            >
                              { blood.name }
                            </option>
                          )
                        })
                      }
                    </Select>
                  </div>
                  <div className='column col-2'>
                    <MaterialInput
                      label={intl.formatMessage(intlMessages.labelHeight)}
                      value={state.height || ''}
                      onChange={e => this.onChange(e, 'height')}
                    />
                  </div>
                </div>
                <div className='columns'>
                  <div className='column col-4'>
                    <MaterialInput
                      label={intl.formatMessage(commonIntlMessages.labelIin)}
                      value={state.iin || ''}
                      error={state.errors && state.errors['patient[iin]'] && state.errors['patient[iin]'][0]}
                      onChange={e => this.onChange(e, 'iin')}
                    />
                  </div>
                </div>
                <div className='columns'>
                  <div className='column col-12'>
                    <RadioGroup
                      error={state.errors && state.errors['patient[sex]'] && state.errors['patient[sex]'][0]}
                      name='status'
                      label={intl.formatMessage(intlMessages.labelSex)}
                      onChange={e => this.onChange(e, 'sex')}>
                      <RadioGroupButton value='male' label={intl.formatMessage(intlMessages.labelMale)} checked={state.sex === 'male'} />
                      <RadioGroupButton value='female' label={intl.formatMessage(intlMessages.labelFemale)} checked={state.sex === 'female'} />
                    </RadioGroup>
                  </div>
                </div>
              </div>

              <div className='form-grid__group'>
                <div className='columns'>
                  <div className='column col-12'>
                    <MaterialInput
                      label={intl.formatMessage(commonIntlMessages.labelContraindications)}
                      value={state.contraindications || ''}
                      onChange={e => this.onChange(e, 'contraindications')}
                    />
                  </div>

                  <div className='column col-12'>
                    <MaterialInput
                      label={intl.formatMessage(commonIntlMessages.labelChronic)}
                      value={state.chronicDiseases || ''}
                      onChange={e => this.onChange(e, 'chronicDiseases')}
                    />
                  </div>
                  <div className='column col-12'>
                    <MultipleAutocomplete
                      label={intl.formatMessage(commonIntlMessages.labelDrugs)}
                      array={state.drugs}
                      reference='drugs'
                      searchField='name'
                      onChange={(resultArr) => {
                        this.setState({drugs: resultArr})
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className='form-grid__group'>
                <div className='columns'>
                  <div className='column col-12'>
                    <Select
                      material
                      error={state.errors && state.errors['patient[timezone]'] && state.errors['patient[timezone]'][0]}
                      label={intl.formatMessage(intlMessages.labelTimezone)}
                      onChange={(e) => this.onChange(e, 'timezone')}
                      value={state.timezone || ''}
                    >
                      {
                        timezones.map((timezone) => {
                          return (
                            <option
                              value={timezone.id}
                              key={timezone.id}
                            >
                              { timezone.name }
                            </option>
                          )
                        })
                      }
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
        {
          state.physicParameters && state.physicParameters.length ? (
            <Template>
              <h3>
                <FormattedMessage
                  id='personal_norm.title'
                  defaultMessage='персональные нормы'
                />
              </h3>
              <Card className='card--gray'>
                <CardBody>
                  <div className='form-grid l-profile__parameters'>
                    {state.physicParameters.map((parameter, i) => {
                      return (
                        <div className='columns' key={parameter.id}>
                          <div className='column col-4'>
                            {parameter.name || parameter.parameter.name}
                          </div>
                          <div className='column col-8'>
                            <MaterialInput
                              width={60}
                              error={state.errors && state.errors[`patient[physicParameters][${i}][normalValueFrom]`]}
                              label='min'
                              type='number'
                              value={state.physicParameters[i].normalValueFrom || ''}
                              onChange={(e) => this.onParameterChange(i, 'normalValueFrom', e.target.value)}
                            />
                            <span className='color-gray' style={{margin: '0 0.6215rem'}}>/</span>
                            <MaterialInput
                              width={60}
                              label='max'
                              error={state.errors && state.errors[`patient[physicParameters][${i}][normalValueTo]`]}
                              type='number'
                              value={state.physicParameters[i].normalValueTo || ''}
                              onChange={(e) => this.onParameterChange(i, 'normalValueTo', e.target.value)}
                            />
                            <span className='color-gray l-profile__parameters-unit' style={{marginLeft: '0.6125rem'}}>
                              { (parameter.unit && parameter.unit.name) || (parameter.units && parameter.units[0].name) }
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardBody>
              </Card>
            </Template>
          ) : null
        }

        <h3>{ intl.formatMessage(commonIntlMessages.loginDataTitle) }</h3>
        <Card className='card--gray'>
          <CardBody>
            <div className='form-grid'>
              <div className='columns'>
                <div className='column col-4'>
                  <MaterialInput
                    label={intl.formatMessage(commonIntlMessages.phone)}
                    phone
                    value={state.phone || ''}
                    onChange={e => {
                      this.setState({phone: e.target.value})
                      if (state.errors && state.errors[`patient[user][phone]`]) {
                        const _errors = Object.assign({}, state.errors)
                        delete _errors[`patient[user][phone]`]
                        this.setState({errors: _errors})
                      }
                    }}
                    error={state.errors && state.errors[`patient[user][phone]`] && state.errors[`patient[user][phone]`][0]}
                  />
                </div>
                <div className='column col-8'>
                  <MaterialInput
                    label={intl.formatMessage(commonIntlMessages.email)}
                    value={state.email || ''}
                    onChange={e => {
                      this.setState({email: e.target.value})
                      if (state.errors && state.errors[`patient[user][email]`]) {
                        const _errors = Object.assign({}, state.errors)
                        delete _errors[`patient[user][email]`]
                        this.setState({errors: _errors})
                      }
                    }}
                    error={state.errors && state.errors[`patient[user][email]`] && state.errors[`patient[user][email]`][0]}
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
                <MediaQuery rule='(min-width: 768px)'>
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
                </MediaQuery>
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
        <h3>{intl.formatMessage(commonIntlMessages.subscriptionsTitle)}</h3>
        <Checkbox
          onChange={() => this.setState({settingSubscriptionNotification: !state.settingSubscriptionNotification})}
          checked={state.settingSubscriptionNotification}
          label={intl.formatMessage(commonIntlMessages.labelSubscribe)}
        />
        <div className='l-profile__buttons'>
          <Button
            onClick={this.onSubmit}
            loading={state.sendLoading}
            disabled={state.errors && Object.keys(state.errors).length}
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

        {
          state.showConfirmModal && <ConfirmModal
            onClose={() => this.setState({showConfirmModal: false})}
            changedProviders={state.changedProviders}
          />
        }

        {
          state.showCapInfo && <Modal
            onRequestClose={() => {
              this.setState({showCapInfo: false})
            }}
          >
            <Card className='card--content'>
              <CardBody>
                <CapInfo
                  onSubmit={() => {
                    this.getCap()
                    this.setState({showCapInfo: false})
                  }}
                  lastName={user.lastName}
                  firstName={user.firstName}
                />
              </CardBody>
            </Card>
          </Modal>
        }

      </div>
    )
  }

  renderCap () {
    const { user, intl } = this.props

    if (user.status !== 'enabled') {
      return null
    }

    const CAP_TEMPLATE = {
      'request for production': {
        label: intl.formatMessage(intlMessages.capLabelProductionRequest),
        text: intl.formatMessage(intlMessages.capTextProductionRequest)
      },
      'produce': {
        label: intl.formatMessage(intlMessages.capLabelInProduction),
        text: intl.formatMessage(intlMessages.capTextInProduction)
      },
      'pending activation': {
        className: 'bg-green',
        label: intl.formatMessage(intlMessages.capLabelPendingActivate),
        text: intl.formatMessage(intlMessages.capTextPendingActivate)
      },
      'active': {
        className: 'bg-green',
        label: intl.formatMessage(intlMessages.capLabelActive),
        text: intl.formatMessage(intlMessages.capTextActive)
      },
      'inactive': {
        className: 'bg-red',
        label: intl.formatMessage(intlMessages.capLabelOff),
        text: intl.formatMessage(intlMessages.capTextOff)
      },
      'used': {
        className: 'bg-red',
        label: intl.formatMessage(intlMessages.capLabelUsed)
      }
    }

    const { capInfo } = this.state
    let InfoTemplate = <Template>
      <p>
        { intl.formatMessage(intlMessages.capWhatFor) }
      </p>
      <div className='l-profile-cap__btns'>
        <a
          href='#'
          onClick={e => {
            e.preventDefault()
            this.setState({showCapInfo: true})
          }}
        >
          { intl.formatMessage(intlMessages.aboutCap) }
        </a>
        <Button
          size={'sm'}
          onClick={this.getCap}
        >
          { intl.formatMessage(intlMessages.orderCap) }
        </Button>
      </div>
    </Template>

    if (capInfo && capInfo.status !== 'canceled') {
      InfoTemplate = <Template>
        <div className='l-profile-cap__status'>
          <span className={classNames('l-profile-cap__status-label', CAP_TEMPLATE[capInfo.status] && CAP_TEMPLATE[capInfo.status].className)}>
            {CAP_TEMPLATE[capInfo.status] && CAP_TEMPLATE[capInfo.status].label}
          </span>
        </div>
        <p dangerouslySetInnerHTML={{ __html: CAP_TEMPLATE[capInfo.status] && CAP_TEMPLATE[capInfo.status].text }} />
        {
          (capInfo.status === 'active' || capInfo.status === 'inactive') ? (
            <Template>
              <NavLink to='/cabinet/sos' className='l-profile-cap__action'>
                <FeatherIcon icon='settings' size={18} />
                { intl.formatMessage(intlMessages.configCard) }
              </NavLink>
              <span
                className='l-profile-cap__action'
                onClick={() => {
                  if (this.state.changeStatusLoading) return
                  const status = capInfo.status === 'active' ? 'inactive' : 'active'
                  this.setState({changeStatusLoading: true})
                  api.putEmergenciesCard({ card: { status } })
                    .then(({data: {data}}) => {
                      store.dispatch({
                        type: 'SOS_CHANGE_STATUS',
                        payload: data
                      })
                      this.setState({
                        changeStatusLoading: false,
                        capInfo: data
                      })
                    })
                }}
              >
                <FeatherIcon icon='power' size={18} />
                { capInfo.status === 'active' ? intl.formatMessage(intlMessages.capTurnOff) : intl.formatMessage(intlMessages.capTurnOn) }
              </span>
            </Template>
          ) : null
        }

        {
          capInfo.status === 'pending activation' && (
            <div className='l-profile-cap__btns'>
              <Button
                size='sm'
                onClick={() => {
                  api.activateEmergenciesCard()
                    .then(({data: {data}}) => {
                      store.dispatch({
                        type: 'SOS_CHANGE_STATUS',
                        payload: data
                      })
                      this.setState({capInfo: data})
                    })
                }}
              >
                Активировать
              </Button>
            </div>
          )
        }

        {
          capInfo.status === 'used' && (
            <Template>
              <p>
                { capInfo.usedTime && moment(capInfo.usedTime).format('DD MMMM YYYY') } <br />
                { capInfo.ipAddress && 'IP адрес: ' + capInfo.ipAddress }<br />
                { capInfo.lon && capInfo.lat && <a target='_blank' href={`https://www.google.com/maps?ll=${capInfo.lat},${capInfo.lon}&q=${capInfo.lat},${capInfo.lon}`}>{ capInfo.lon + ', ' + capInfo.lat }</a> }
                <br />
                { capInfo.activatedUser && <strong>
                  <NavLink style={{textDecoration: 'none'}} to={`/cabinet/doctors/${capInfo.activatedUser.id}`}>
                    { capInfo.activatedUser.lastName } { capInfo.activatedUser.firstName } { capInfo.activatedUser.middleName }
                  </NavLink>
                </strong>
                }
              </p>
              <div className='l-profile-cap__btns'>
                <Button
                  size={'sm'}
                  onClick={this.getCap}
                >
                  { intl.formatMessage(intlMessages.capOrderNew) }
                </Button>
              </div>
            </Template>
          )
        }
      </Template>
    }

    return (
      <div className='l-profile-cap'>
        <CapCard name={`${user.lastName} ${user.firstName}`} />
        <div className='l-profile-cap__info'>
          {
            this.state.capInfoLoading ? (
              <Spinner />
            ) : (
              InfoTemplate
            )
          }
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

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(PatientProfile))

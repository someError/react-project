import React, { Component } from 'react'
import { connect } from 'react-redux'
import owasp from '../../../../util/owasp'
import { normalizeLogin, owaspMessages } from '../../../../util'
import Template from '../../../../components/Template'
import MediaQuery from '../../../../components/MediaQuery'
import { Card, CardBody } from '../../../../components/Card'
import { MaterialInput } from '../../../../components/Form'
import Button from '../../../../components/Button'
import api from '../../../../api'
import { changeUser } from '../../../../redux/user/actions'
import { injectIntl } from 'react-intl'

import commonIntlMessages from '../../../../i18n/common-messages'

owasp.config({
  minLength: 6
})

class AdminProfile extends Component {
  constructor () {
    super()
    this.state = {}

    this.onSubmit = this.onSubmit.bind(this)
    this.setToInitial = this.setToInitial.bind(this)
  }

  setToInitial () {
    const { user } = this.props
    const { firstName, lastName, middleName, phone, email, status } = user
    this.setState({
      firstName,
      lastName,
      middleName,
      phone,
      email,
      status
    })
  }

  componentDidMount () {
    this.setToInitial()
  }

  onSubmit () {
    const { loading, sendLoading, password, newPassword, email, phone, status, ...sendData } = this.state
    sendData.user = { email, phone }
    if (password) sendData.user.password = password
    if (newPassword && (newPassword.first || newPassword.second)) {
      sendData.user.newPassword = newPassword
    }

    if (phone) {
      sendData.user.phone = normalizeLogin(phone)
    }

    this.setState({sendLoading: true})

    api.putUser(sendData, 'administrator')
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
    if (field === 'licenseFile') {
      this.setState({[field]: e})
    } else {
      this.setState({[field]: e.target.value})
    }
    if (state.errors && state.errors[`administrator[${field}]`]) {
      const _errors = Object.assign({}, state.errors)
      delete _errors[`administrator[${field}]`]
      this.setState({errors: _errors})
    }
  }

  render () {
    const { state } = this

    const { intl } = this.props

    return (
      <Template>
        <Card className='card--gray'>
          <CardBody>
            <div className='form-grid'>
              <div className='form-grid__group'>
                <div className='columns'>
                  <div className='column col-4'>
                    <MaterialInput
                      label={intl.formatMessage(commonIntlMessages.lastName)}
                      value={state.lastName || ''}
                      error={state.errors && state.errors['administrator[lastName]'] && state.errors['administrator[lastName]'][0]}
                      onChange={e => this.onChange(e, 'lastName')}
                    />
                  </div>
                  <div className='column col-4'>
                    <MaterialInput
                      label={intl.formatMessage(commonIntlMessages.firstName)}
                      value={state.firstName || ''}
                      error={state.errors && state.errors['administrator[firstName]'] && state.errors['administrator[firstName]'][0]}
                      onChange={e => this.onChange(e, 'firstName')}
                    />
                  </div>
                  <div className='column col-4'>
                    <MaterialInput
                      label={intl.formatMessage(commonIntlMessages.middleName)}
                      value={state.middleName || ''}
                      error={state.errors && state.errors['administrator[middleName]'] && state.errors['administrator[middleName]'][0]}
                      onChange={e => this.onChange(e, 'middleName')}
                    />
                  </div>
                </div>

                <div className='columns'>
                  <div className='column col-4'>
                    <MaterialInput
                      label={intl.formatMessage(commonIntlMessages.phone)}
                      phone
                      value={state.phone || ''}
                      onChange={e => this.onChange(e, 'phone')}
                    />
                  </div>
                  <div className='column col-8'>
                    <MaterialInput
                      label={intl.formatMessage(commonIntlMessages.email)}
                      value={state.email || ''}
                      onChange={e => this.onChange(e, 'email')}
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
            </div>
          </CardBody>
        </Card>

        <div className='l-profile__buttons'>
          <Button
            onClick={this.onSubmit}
            loading={state.sendLoading}
            size='sm'
            disabled={state.status === 'in_moderation'}
          >
            { intl.formatMessage(commonIntlMessages.saveChangesBtn) }
          </Button>
          <Button
            ghost
            onClick={this.setToInitial}
            size='sm'
            disabled={state.status === 'in_moderation'}
          >
            { intl.formatMessage(commonIntlMessages.cancelChangesBtn) }
          </Button>
        </div>
      </Template>
    )
  }
}

const mapStateToProps = ({ user }) => {
  return {
    user
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    changeUser: function (data) {
      return dispatch(changeUser(data))
    }
  }
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(AdminProfile))

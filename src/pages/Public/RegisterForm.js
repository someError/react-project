import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import linkState from 'linkstate'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import owasp from '../../util/owasp'

import { RadioButton } from '../../components/Form'
import Button from '../../components/Button/index'
import api from '../../api'
import MaterialInput from '../../components/Form/MaterialInput'
import ErrorMessage from '../../components/Form/ErrorMessage'

import { normalizeLogin, owaspMessages } from '../../util'
import Template from '../../components/Template'
import { receiveUser } from '../../redux/user/actions'

owasp.config({
  minLength: 6,
  minOptionalTestsToPass: 1
})

class RegisterForm extends PureComponent {
  constructor (props) {
    super()

    this.state = {
      type: (props.location.state && props.location.state.type) || 'patient',
      login: '',
      password: '',
      passwordRepeat: '',
      loading: false,
      errors: {},
      confirm: true,
      userId: '',
      code: ''
    }

    this.submit = this.submit.bind(this)
    this.confirm = this.confirm.bind(this)
  }

  submit (e) {
    e.preventDefault()

    if (!this.state.userId) {
      this.register()
    } else {
      this.confirm()
    }
  }

  register () {
    const { login, password, type } = this.state

    this.req = api.register(normalizeLogin(login), password, type)

    this.setState({
      loading: true,
      errors: {}
    })

    this.req
      .then(({ data: { data } }) => {
        this.setState({
          userId: data.user,
          loading: false
        })
      })
      .catch(({ response: { data: { data } } }) => {
        this.setState({
          errors: data.errors,
          loading: false
        })
      })
  }

  confirm () {
    this.setState({
      loading: true
    })

    this.req = api.confirm(this.state.userId, this.state.code, 'registration')

    this.req
      .then(({ data }) => {
        if (data.success) {
          api.auth(this.state.login, this.state.password)
            .then(({ data: { data } }) => {
              api.storeToken(data.token)

              this.props.dispatch(receiveUser({}))
              this.props.history.push('/cabinet')
            })
        }
      })
      .catch(({ response: { data: { data } } }) => {
        this.setState({
          errors: data.errors,
          loading: false
        })
      })
  }

  canRegister () {
    return !!this.state.login && owasp.test(this.state.password).errors.length < 1 && this.state.password === this.state.passwordRepeat
  }

  render () {
    const { state } = this
    const { location } = this.props

    return <form onSubmit={this.submit}>
      { location.state && location.state.registerErrorMessage && <div>{ location.state.registerErrorMessage }</div> }
      <div className='form-grid'>
        <div className='columns'>
          <div className='column col-12'>
            <MaterialInput
              label='Номер телефона или e-mail'
              autoFocus
              onChange={linkState(this, 'login')}
              value={state.login}
            />
            { state.errors.login && <ErrorMessage>{ state.errors.login }</ErrorMessage>}
          </div>

          <div className='column col-12'>
            <MaterialInput
              label='Придумайте пароль'
              type='password'
              error={!!state.errors.password}
              hint={state.errors.password}
              onChange={(e) => {
                const { value } = e.target
                const res = owasp.test(value)

                this.setState((state) => {
                  return {
                    ...state,
                    password: value,
                    errors: {
                      ...state.errors,
                      password: value && res.errors.length > 0 ? owaspMessages[res.errors[0]] || res.errors[0] : null
                    }
                  }
                })
              }}
              value={state.password}
            />
            { state.errors.password && <ErrorMessage>{ state.errors.password }</ErrorMessage>}
          </div>

          <div className='column col-12'>
            <MaterialInput
              label='Повторите пароль'
              type='password'
              onChange={(e) => {
                const { value } = e.target

                this.setState((state) => {
                  return {
                    ...state,
                    passwordRepeat: value,
                    errors: {
                      ...state.errors,
                      passwordRepeat: value !== state.password ? 'Пароли не совпадают' : null
                    }
                  }
                })
              }}
              value={state.passwordRepeat}
            />
            { state.errors.passwordRepeat && <ErrorMessage>{ state.errors.passwordRepeat }</ErrorMessage>}
          </div>

          <div className='column col-12'>
            Вы:
            <ul className='options-list'>
              <li>
                <RadioButton
                  value='patient'
                  label='Пациент'
                  checked={state.type === 'patient'}
                  onChange={(e) => {
                    this.setState({
                      type: e.target.value
                    })
                  }}
                />
              </li>
              <li>
                <RadioButton
                  value='doctor'
                  label='Врач'
                  checked={state.type === 'doctor'}
                  onChange={(e) => {
                    this.setState({
                      type: e.target.value
                    })
                  }}
                />
              </li>
              <li>
                <RadioButton
                  value='administrator'
                  label='Медучреждение'
                  checked={state.type === 'administrator'}
                  onChange={(e) => {
                    this.setState({
                      type: e.target.value
                    })
                  }}
                />
              </li>
            </ul>
          </div>
        </div>

        <div className='form-grid'>
          <div className='columns'>
            {
              this.state.userId
                ? <div className='column col-4'>
                  <MaterialInput
                    label='Код'
                    error={!!(state.errors && state.errors.code)}
                    value={state.code}
                    onChange={linkState(this, 'code')}
                  />
                  <ErrorMessage>{ state.errors && state.errors.code }</ErrorMessage>
                </div>
                : null
            }

            <div className='column col-8'>
              {
                !this.state.userId
                  ? <Template>
                    <Button
                      loading={state.loading}
                      disabled={state.loading || !this.canRegister()}
                    >
                      Зарегистрироваться
                    </Button>{' '}
                    <Link to='#login'>Авторизация</Link>
                  </Template>
                  : <Button
                    loading={state.loading}
                    disabled={state.loading || !this.state.code}
                  >
                    Подтвердить
                  </Button>
              }
            </div>
          </div>
        </div>
      </div>
    </form>
  }
}

export default connect()(withRouter(RegisterForm))

import React, { PureComponent } from 'react'
import linkState from 'linkstate'

import { FormGroup, RadioButton, Input } from '../../components/Form'
import Button from '../../components/Button/index'
import api from '../../api'

class Register extends PureComponent {
  constructor () {
    super()

    this.state = {
      type: 'patient',
      login: '',
      password: '',
      loading: false,
      errors: {},
      confirm: true,
      userId: ''
    }

    this.submit = this.submit.bind(this)
    this.confirm = this.confirm.bind(this)
  }

  submit (e) {
    e.preventDefault()

    const { login, password, type } = this.state

    this.req = api.register(login, password, type)

    this.setState({
      errors: {}
    })

    this.req
      .then(({ data: { data } }) => {
        this.setState({
          userId: data.user
        })
      })
      .catch(({ response: { data: { data } } }) => {
        this.setState({
          errors: data.errors
        })
      })
  }

  confirm (e) {
    e.preventDefault()

    this.setState({
      loading: true
    })

    this.req = api.confirm(this.state.userId, this.state.code, 'registration')

    this.req
      .then(({ data }) => {
        if (data.success) {
          this.props.history.push('/cabinet')
        }
      })
  }

  render () {
    const { state } = this
    const { location } = this.props

    if (state.userId) {
      return <form>
        <FormGroup
          label='Код подтверждения'
        >
          <Input
            value={state.code}
            onChange={linkState(this, 'code')}
          />
        </FormGroup>

        <Button primary>Отправить</Button>
      </form>
    }

    return <form onSubmit={this.submit}>
      { location.state && location.state.registerErrorMessage && <div>{ location.state.registerErrorMessage }</div> }
      <FormGroup
        label='Зарегистрироваться как'
      >
        <RadioButton
          value='patient'
          label='пациент'
          checked={state.type === 'patient'}
          onChange={linkState(this, 'type')}
        />
        <RadioButton
          value='doctor'
          label='врач'
          checked={state.type === 'doctor'}
          onChange={linkState(this, 'type')}
        />
      </FormGroup>

      <FormGroup
        label='Телефон'
        error={!!state.errors.login}
        hint={state.errors.login}
      >
        <Input
          autoFocus
          onChange={linkState(this, 'login')}
          value={state.login}
          size='lg'
        />
      </FormGroup>

      <FormGroup
        label='Пароль'
        error={!!state.errors.password}
        hint={state.errors.password}
        defaultHint='не менее 6-ти символов'
      >
        <Input
          type={'password'}
          onChange={linkState(this, 'password')}
          value={state.password}
          size='lg'
        />
      </FormGroup>

      <Button primary loading={state.loading} disabled={state.loading || (!state.password || !state.login)}>Зарегистрироваться</Button>
    </form>
  }
}

export default Register

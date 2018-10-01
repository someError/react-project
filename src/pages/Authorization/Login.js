import React, { PureComponent } from 'react'
import { MaterialInput } from '../../components/Form'
import Button from '../../components/Button'

import linkState from 'linkstate'
import api from '../../api'

class Login extends PureComponent {
  constructor () {
    super()

    this.state = {
      login: '',
      password: '',
      loading: false,
      error: ''
    }

    this.submit = this.submit.bind(this)
  }

  submit (e) {
    e.preventDefault()

    this.setState({
      loading: true,
      error: ''
    })

    this.req = api.auth(this.state.login, this.state.password)

    this.req
      .then(({ data: { data } }) => {
        api.storeToken(data.token)

        this.props.history.push('/cabinet')
      })
      .catch(({ response: { data: { data } } }) => {
        this.setState({
          loading: false,
          error: data.message
        })
      })
  }

  componentWillUnmount () {
    if (this.req) {
      this.req.cancel()
    }
  }

  render () {
    const { location } = this.props
    const { state } = this

    return <form onSubmit={this.submit}>
      {
        location.state && location.state.registerMessage
          ? <div>{ location.state.registerMessage }</div>
          : null
      }
      <div className='form-grid'>
        <div className='columns'>
          <div className='column col-12'>
            <MaterialInput
              label='Логин'
              autoFocus
              onChange={linkState(this, 'login')}
              value={state.login}
              size='lg'
            />
          </div>

          <div className='column col-12'>
            <MaterialInput
              label='Пароль'
              onChange={linkState(this, 'password')}
              value={state.password}
              type='password'
              size='lg'
            />
          </div>
        </div>
      </div>
      <Button size='sm' loading={state.loading} disabled={state.loading || (!state.password || !state.login)}>Войти</Button>
    </form>
  }
}

export default Login

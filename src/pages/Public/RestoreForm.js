import React, { PureComponent } from 'react'
import linkState from 'linkstate'
import { Link } from 'react-router-dom'

import Button from '../../components/Button'
import api from '../../api'
import MaterialInput from '../../components/Form/MaterialInput'
import ErrorMessage from '../../components/Form/ErrorMessage'
import { normalizeLogin } from '../../util'

class RestoreForm extends PureComponent {
  constructor () {
    super()

    this.state = {
      login: '',
      loading: false,
      error: '',
      success: ''
    }

    this.submit = this.submit.bind(this)
  }

  submit (e) {
    e.preventDefault()

    this.setState({
      loading: true,
      error: ''
    })

    this.req = api.resetPassword(normalizeLogin(this.state.login))

    this.req
      .then(({ data }) => {
        if (data.success) {
          this.setState({
            loading: false,
            success: data.data.message
          })
        }
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
    const { state } = this

    return <form onSubmit={this.submit}>
      <div className='form-grid'>
        <div className='columns'>
          <div className='column col-12'>
            <MaterialInput
              autoFocus
              label='Логин'
              error={!!state.error}
              onChange={linkState(this, 'login')}
              value={state.login}
            />
            { state.error && <ErrorMessage>{ this.state.error }</ErrorMessage> }
            { state.success && <div><br /><div className='color-green'>{ state.success }.<br /><Link to={{ hash: '#login', state: { login: state.login } }}>Авторизоваться с новым паролем</Link></div></div> }
          </div>
        </div>
      </div>

      <Button loading={state.loading} disabled={state.loading || (!state.login)}>Восстановить пароль</Button>
    </form>
  }
}

export default RestoreForm

import React, { PureComponent } from 'react'
import linkState from 'linkstate'

import { FormGroup, Input } from '../../components/Form'
import Button from '../../components/Button/index'
import api from '../../api'

class Reset extends PureComponent {
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

    this.req = api.resetPassword(this.state.login)

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
      <FormGroup
        label='Логин'
        error={!!state.error}
        hint={state.error || state.success}
      >
        <Input
          autoFocus
          success={!!state.success}
          onChange={linkState(this, 'login')}
          value={state.login}
          size='lg'
        />
      </FormGroup>

      <Button primary loading={state.loading} disabled={state.loading || (!state.login)}>Восстановить пароль</Button>
    </form>
  }
}

export default Reset

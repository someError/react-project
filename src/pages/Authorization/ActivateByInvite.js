import React, { Component } from 'react'

import { OverlaySpinner } from '../../components/Loader'

import api from '../../api'

class ActivateByInvite extends Component {
  constructor () {
    super()

    this.state = {
      loading: true
    }
  }

  componentDidMount () {
    const { match, history } = this.props
    const { params } = match

    this.req = api.registerByInvite(params.userId, params.token)

    this.req
      .then(({ data: { data } }) => {
        history.replace(`/public#login`, {
          registerMessage: 'Вы успешно зарегистрированы. Пароль выслан на e-mail.'
        })
      })
      .catch(() => {
        history.replace(`/public#registration`, {
          registerErrorMessage: 'Произошла ошибка'
        })
      })
  }

  render () {
    return this.state.loading && <OverlaySpinner />
  }
}

export default ActivateByInvite

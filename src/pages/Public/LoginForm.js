import React, { PureComponent } from 'react'
import { withRouter } from 'react-router'
import { MaterialInput } from '../../components/Form'
import Button from '../../components/Button'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { injectIntl, FormattedHTMLMessage } from 'react-intl'

import linkState from 'linkstate'
import api from '../../api'
import ErrorMessage from '../../components/Form/ErrorMessage'
import { Tile, TileContent, TileAction } from '../../components/Tile'
import { receiveUser } from '../../redux/user/actions'
import { normalizeLogin } from '../../util'

import commonIntlMessages from '../../i18n/common-messages'

class LoginForm extends PureComponent {
  constructor (props) {
    super()

    this.state = {
      login: (props.location.state && props.location.state.login) || '',
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

    this.req = api.auth(normalizeLogin(this.state.login), this.state.password)

    this.req
      .then(({ data: { data } }) => {
        api.storeToken(data.token)

        // почти костыль
        this.props.dispatch(receiveUser({}))

        this.props.history.push(((this.props.location.state || {}).ref) || '/cabinet')
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
    const { location, intl } = this.props
    const { state } = this

    const locationState = location.state || {}

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
              label={intl.formatMessage(commonIntlMessages.labelPhoneOrEmail)}
              autoFocus={!locationState.login}
              onChange={linkState(this, 'login')}
              value={state.login}
              error={!!this.state.error}
            />
          </div>

          <div className='column col-12'>
            <Tile centered>
              <TileContent>
                <MaterialInput
                  label={intl.formatMessage(commonIntlMessages.labelPassword)}
                  autoFocus={!!locationState.login}
                  onChange={linkState(this, 'password')}
                  value={state.password}
                  type='password'
                  error={!!this.state.error}
                />
                { this.state.error && <ErrorMessage>{ this.state.error }</ErrorMessage> }
              </TileContent>
              <TileAction>
                <Link to='#restore'>
                  <FormattedHTMLMessage
                    id='forgot_password_link'
                    defaultMessage='Забыли<br />пароль?'
                  />
                </Link>
              </TileAction>
            </Tile>
          </div>
        </div>
      </div>

      <Button
        loading={state.loading}
        disabled={state.loading || (!state.password || !state.login)}
      >
        {intl.formatMessage(commonIntlMessages.signIn)}
      </Button>{' '}
      <Link to='#registration'>{intl.formatMessage(commonIntlMessages.registrationTitle)}</Link>
    </form>
  }
}

export default injectIntl(connect()(withRouter(LoginForm)))

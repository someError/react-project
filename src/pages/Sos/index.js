import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { fetchUser } from '../../redux/user/actions'
import Main from './Main'
import Medical from './Medical'
import api from '../../api'
import logo from '../../images/sos-logo.svg'
import { OverlaySpinner } from '../../components/Loader'
import store from 'store'

class Sos extends Component {
  constructor () {
    super()
    this.state = {
      loading: true,
      cabinetToken: null
    }
  }

  auth (data) {
    api.authByToken(data)
      .then(({data: { data }}) => {
        if (!store.get('cabToken')) {
          store.set('cabToken', store.get('token'))
        }

        api.storeToken(data['x-token'])
        this.setState({loading: false})
      })
      .catch(() => {
        this.props.history.push({ pathname: '/public' })
      })
  }

  componentDidMount () {
    const { match: { params: { token } } } = this.props
    if (token) {
      const getPosition = options => {
        return new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, options)
        })
      }
      getPosition()
        .then((position) => {
          const lat = position.coords.latitude
          const lon = position.coords.longitude
          if (!this.props.user.id) {
            this.props.fetchUser()
              .then(({data: {data}}) => {
                const query = {token, lon, lat}
                if (data.entity_type === 'doctor') {
                  query.activatedUser = data.id
                }
                this.auth(query)
              })
              .catch(() => {
                this.auth({token, lon, lat})
              })
          } else {
            this.auth({token, lon, lat})
          }
        })
        .catch(() => {
          if (!this.props.user.id) {
            this.props.fetchUser()
              .then(({data: {data}}) => {
                const query = {token}
                if (data.entity_type === 'doctor') {
                  query.activatedUser = data.id
                }
                this.auth(query)
              })
              .catch(() => {
                this.auth({token})
              })
          } else {
            this.auth({token})
          }
        })
    }
  }

  render () {
    const { state, props } = this
    const { match } = props

    if (state.loading) {
      return <OverlaySpinner />
    }

    return <div className='l-sos'>
      <Link to='/public'><img src={logo} className='l-sos__logo' /></Link>
      <div className='l-sos__content'>
        <Route exact path={`${match.url}`} component={Main} />
        <Route path={`${match.url}/medical`} component={Medical} />
      </div>
    </div>
  }
}

const mapDispatchToProp = (dispatch) => {
  return {
    fetchUser () {
      return dispatch(fetchUser())
    }
  }
}

export default connect(({user}) => ({user}), mapDispatchToProp)(Sos)

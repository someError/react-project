import React, { Component } from 'react'
import { Route, NavLink, Link } from 'react-router-dom'
import store from 'store'
import api from '../../api'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
import MainPage from './MainPage'
import PolicyPage from './PolicyPage'
import FeatherIcon from '../../components/Icons/FeatherIcon'
import Auth from '../Authorization'
import Modal, { ModalBody, ModalHeader } from '../../components/Modal'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import RestoreForm from './RestoreForm'
import Template from '../../components/Template'
import UserIdentity from '../../components/Avatar/UserIdentity'
import { OverlaySpinner } from '../../components/Loader'
import { fetchUser } from '../../redux/user/actions'

import commonIntlMessages from '../../i18n/common-messages'

const getModalsState = (hash) => {
  return {
    showLoginModal: hash === '#login',
    showRegistrationModal: hash === '#registration',
    showRestoreModal: hash === '#restore'
  }
}

class Public extends Component {
  constructor (props) {
    super()

    this.state = {
      ...getModalsState(props.location.hash),
      showMobileMenu: false
    }
  }

  componentDidUpdate (prevProps) {
    // TODO: возможно как-то подругому надо
    /* eslint react/no-did-update-set-state: off */
    if (prevProps.location !== this.props.location) {
      this.setState({
        showMobileMenu: false
      })
    }

    if (prevProps.location.hash !== this.props.location.hash) {
      this.setState({
        ...getModalsState(this.props.location.hash)
      })
    }

    if (this.state.showMobileMenu) {
      document.body.classList.add('portal-opened')
    } else {
      document.body.classList.remove('portal-opened')
    }
  }

  componentDidMount () {
    if (store.get('cabToken')) {
      api.storeToken(store.get('cabToken'))
      store.set('cabToken', null)
    }

    if (!this.props.user.id) {
      this.props.fetchUser()
    }
  }

  render () {
    const { match, location, user, intl } = this.props

    if (user.loading) {
      return <OverlaySpinner />
    }

    return <div>
      <div
        onClick={() => {
          this.setState({
            showMobileMenu: false
          })
        }}
        className={`mobile-menu${this.state.showMobileMenu ? ' mobile-menu--visible' : ''}`}
      >
        <div
          onClick={(e) => {
            e.stopPropagation()
          }}
          className='mobile-menu__wrapper'>
          <div className='mobile-menu__wave' />
          <ul className='mobile-menu__list'>
            <li className='mobile-menu__list-item'><Link to='/public#forPatients'>{ intl.formatMessage(commonIntlMessages.menuPatients) }</Link></li>
            <li className='mobile-menu__list-item'><Link to='/public#card'>{ intl.formatMessage(commonIntlMessages.menuCard) }</Link></li>
            <li className='mobile-menu__list-item'><Link to='/public#forDoctors'>{ intl.formatMessage(commonIntlMessages.menuDoctors) }</Link></li>
            <li className='mobile-menu__list-item'><Link to='/public#contacts'>{ intl.formatMessage(commonIntlMessages.menuContacts) }</Link></li>
            <li className='mobile-menu__list-item'><Link to='/public/policy'>{ intl.formatMessage(commonIntlMessages.menuPolicy) }</Link></li>
          </ul>
        </div>
      </div>
      <header className={`header${location.pathname.replace(/\/$/, '') !== '/public' ? ' header--inner' : ''}`}>
        <div className='container container-flex'>
          <div className='header-hamb'>
            <span onClick={() => {
              this.setState({
                showMobileMenu: !this.state.showMobileMenu
              })
            }}><FeatherIcon icon={!this.state.showMobileMenu ? 'hamb' : 'x'} size={27} /></span>
          </div>
          <Link to='/' className='header-logo'>
            <img src={require('../../images/logo.svg')} alt='PHR' />
          </Link>
          <ul className='header-nav'>
            <li className='header-nav__item'><Link to='/public#forPatients'>{ intl.formatMessage(commonIntlMessages.menuPatients) }</Link></li>
            <li className='header-nav__item'><Link to='/public#card'>{ intl.formatMessage(commonIntlMessages.menuCard) }</Link></li>
            <li className='header-nav__item'><Link to='/public#forDoctors'>{ intl.formatMessage(commonIntlMessages.menuDoctors) }</Link></li>
            <li className='header-nav__item'><Link to='/public#contacts'>{ intl.formatMessage(commonIntlMessages.menuContacts) }</Link></li>
            <li className='header-nav__item'><NavLink to='/public/policy'>{ intl.formatMessage(commonIntlMessages.menuPolicy) }</NavLink></li>
          </ul>

          <div className='header-auth'>
            {
              !(this.props.user && this.props.user.id)
                ? <Template>
                  <Link
                    to='#login'
                    className='header-auth__link'
                  >
                    { intl.formatMessage(commonIntlMessages.signIn) }
                  </Link>
                  <Link className='header-auth__logo' to='#login'>
                    <FeatherIcon icon='login' size={25} />
                  </Link>
                </Template>
                : <UserIdentity
                  className='header-auth__user'
                  user={this.props.user}
                  size='sm'
                  avatarPosition='right'
                  url='/cabinet'
                />
            }
          </div>
        </div>
      </header>

      <Route exact path={`${match.url}/`} component={MainPage} />
      <Route exact path={`${match.url}/policy`} component={PolicyPage} />
      <Route path={`${match.url}/auth`} component={Auth} />

      <footer className='footer'>
        <div className='footer-wrapper'>
          <div className='container container-flex'>
            <ul className='footer-nav'>
              <li className='footer-nav__item'><Link to='/public#forPatients'>{ intl.formatMessage(commonIntlMessages.menuPatients) }</Link></li>
              {/* <li className='header-nav__item'><a href='#forPartners'>Партнёры</a></li> */}
              <li className='footer-nav__item'><Link to='/public#card'>{ intl.formatMessage(commonIntlMessages.menuCard) }</Link></li>
              <li className='footer-nav__item'><Link to='/public#contacts'>{ intl.formatMessage(commonIntlMessages.menuContacts) }</Link></li>
              <li className='footer-nav__item'><Link to='/public#forDoctors'>{ intl.formatMessage(commonIntlMessages.menuDoctors) }</Link></li>
              <li className='footer-nav__item'><Link to='/public/policy'>{ intl.formatMessage(commonIntlMessages.menuPolicy) }</Link></li>
            </ul>
            <div className='footer-contacts'>
              <div className='footer-contacts__item'>{ intl.formatMessage(commonIntlMessages.address) }</div>

              <div className='footer-contacts__item footer-contacts__item--float-left footer-contacts__item--modified'>
                <a href='mailto:phr@hdg.kz'>phr@hdg.kz</a>
              </div>
              <div className='footer-contacts__item footer-contacts__item--float-right'>
                <a className='footer-contacts__item-phone' href='tel:+77172249320'>+7 (717-2) 24-9320</a>
              </div>
            </div>
            <div className='footer-logo'>
              <a href='/'><img src={require('../../images/static/footer-logo.svg')} alt='' /></a>
            </div>
          </div>
        </div>
      </footer>

      {
        !(this.props.user && this.props.user.id) && this.state.showLoginModal
          ? <Modal
            containerClassName='auth-modal'
            onRequestClose={() => {
              this.props.history.push({
                hash: ''
              })
            }}
          >
            <ModalHeader><h2>{ intl.formatMessage(commonIntlMessages.authorizationTitle) }</h2></ModalHeader>
            <ModalBody>
              <LoginForm />
            </ModalBody>
          </Modal>
          : null
      }

      {
        this.state.showRegistrationModal
          ? <Modal
            containerClassName='auth-modal'
            onRequestClose={() => {
              this.props.history.push({
                hash: ''
              })
            }}
          >
            <ModalHeader><h2>{ intl.formatMessage(commonIntlMessages.registrationTitle) }</h2></ModalHeader>
            <ModalBody>
              <RegisterForm />
            </ModalBody>
          </Modal>
          : null
      }

      {
        this.state.showRestoreModal
          ? <Modal
            containerClassName='auth-modal'
            onRequestClose={() => {
              this.props.history.push({
                hash: ''
              })
            }}
          >
            <ModalHeader><h2>{ intl.formatMessage(commonIntlMessages.restorePassword) }</h2></ModalHeader>
            <ModalBody>
              <RestoreForm />
            </ModalBody>
          </Modal>
          : null
      }
    </div>
  }
}

const mapDispatchToProp = (dispatch) => {
  return {
    fetchUser () {
      dispatch(fetchUser())
    }
  }
}

export default injectIntl(connect(({user}) => ({user}), mapDispatchToProp)(Public))

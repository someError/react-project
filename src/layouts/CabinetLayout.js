import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import throttle from 'lodash/throttle'
import { injectIntl } from 'react-intl'

import { NavLink, Link, withRouter, Route } from 'react-router-dom'

import logo from '../images/logo.svg'

import FeatherIcon from '../components/Icons/FeatherIcon'
import UserIdentity from '../components/Avatar/UserIdentity'

import MediaQuery from '../components/MediaQuery'
import ForRoles from '../components/ForRoles'

import './CabinetLayout.css'
import './MainMenu.css'
import './Filters.css'

import Filters from '../pages/Cabinet/Cards/Filters'
import { Card } from '../components/Card'
import Drawer from '../components/Drawer'
import Template from '../components/Template'
import { showAddModal, showCreateCardModal } from '../redux/modals/actions'

import EventsFilters from '../pages/Cabinet/Events/Filters'
import PatientsFilters from '../pages/Cabinet/Patients/Filters'
import QueuesFilters from '../pages/Cabinet/Schedule/Filters'
import Button from '../components/Button/index'
import DoctorRequestsFilter from '../pages/Cabinet/Records/DoctorRequestsFilter'
import PatientRequestsFilter from '../pages/Cabinet/Records/PatientRequestsFilter'
import DoctorsFilters from '../pages/Cabinet/Doctors/ListFilters'
import DoctorDetailActions from '../pages/Cabinet/Doctors/DetailActions'
import OrgsFilters from '../pages/Cabinet/Organizations/ListFilters'
import OrgDetailActions from '../pages/Cabinet/Organizations/DetailActions'
import Search from './Search'
import Notifications from '../components/Notifications'
import Firebase from '../components/Notifications/Firebase'

import commonIntlMessages from '../i18n/common-messages'
import menuIntlMessages from './menuIntlMessages'

const PAGES_WITHOUT_FILTERS = ['/cabinet/profile', '/cabinet/records', '/cabinet/price-list', '/cabinet/assistants', '/cabinet/desktop']

const MainMenu = injectIntl(({ user, showAddModal, showCreateCardModal, intl }) => {
  return <div className='main-menu'>
    <div className='main-menu-section'>
      <div className='main-menu-section__title'>{ intl.formatMessage(menuIntlMessages.menuProfile) }</div>
      <UserIdentity
        user={user}
      />

      <ul className='main-menu__list'>
        <li>
          {/* <NavLink to='/cabinet/log'> */}
          {/* <FeatherIcon icon={'clipboard'} size={19} /> Журнал действий */}
          {/* </NavLink> */}
        </li>
        <Template if={user.entity_type === 'patient' && user.sos && (user.sos.status === 'active' || user.sos.status === 'inactive')}>
          <li>
            <NavLink to='/cabinet/sos'>
              <FeatherIcon icon={'activity'} size={19} /> { intl.formatMessage(menuIntlMessages.menuCap) }
            </NavLink>
          </li>
        </Template>
        <Template if={user.entity_type === 'doctor'}>
          <li>
            <NavLink to='/cabinet/assistants'>
              <FeatherIcon icon={'activity'} size={19} /> { intl.formatMessage(menuIntlMessages.menuAssistants) }
            </NavLink>
          </li>
        </Template>
        <Template if={user.entity_type === 'doctor' || user.entity_type === 'administrator'}>
          <li>
            <NavLink to='/cabinet/price-list'>
              <FeatherIcon icon={'activity'} size={19} /> { intl.formatMessage(menuIntlMessages.menuPriceList) }
            </NavLink>
          </li>
          {
            user.entity_type === 'administrator' && (
              <li>
                <NavLink exact to={`/cabinet/workers`}>
                  <FeatherIcon icon={'message-square'} size={19} /> { intl.formatMessage(menuIntlMessages.menuCoworkers) }
                </NavLink>
              </li>
            )
          }
        </Template>
        <li>
          <NavLink to='/cabinet/logout'>
            <FeatherIcon icon={'log-out'} size={19} /> { intl.formatMessage(menuIntlMessages.menuLogout) }
          </NavLink>
        </li>
      </ul>
    </div>

    {
      user.entity_type === 'assistant' && (
        <Template>
          <div className='main-menu-section__title'>{ intl.formatMessage(menuIntlMessages.menuPatients) }</div>
          <ul className='main-menu__list'>
            <li>
              <NavLink exact to={`/cabinet/patients`}>
                <FeatherIcon icon={'message-square'} size={19} /> { intl.formatMessage(menuIntlMessages.menuPatients) }
              </NavLink>
            </li>
          </ul>
        </Template>
      )
    }

    {
      user.entity_type === 'doctor' || user.entity_type === 'registry'
        ? <Template>
          <div className='main-menu-section__title'>{ intl.formatMessage(menuIntlMessages.menuPatients) }</div>

          <div className='main-menu__buttons'>
            <Button onClick={() => { showCreateCardModal() }} size='xs'>{ intl.formatMessage(menuIntlMessages.menuAddCardBtn) }</Button>
          </div>

          <ul className='main-menu__list'>
            {/* <li> */}
            {/* <NavLink exact to={`/cabinet/wat`}> */}
            {/* <FeatherIcon icon={'check-circle'} size={19} /> Подписать черновики */}
            {/* </NavLink> */}
            {/* </li> */}
            <li>
              <NavLink exact to={`/cabinet/patients`}>
                <FeatherIcon icon={'message-square'} size={19} /> { intl.formatMessage(menuIntlMessages.menuPatients) }
              </NavLink>
            </li>
            <li>
              <NavLink exact to={`/cabinet/records`}>
                <FeatherIcon icon={'clock'} size={19} /> { intl.formatMessage(menuIntlMessages.menuReceptions) }
              </NavLink>
            </li>
            <li>
              <NavLink exact to={`/cabinet/schedule`}>
                <FeatherIcon icon={'clock'} size={19} /> { intl.formatMessage(menuIntlMessages.menuSchedule) }
              </NavLink>
            </li>
          </ul>
        </Template>
        : null
    }

    {
      user.entity_type === 'patient'
        ? <div className='main-menu-section'>
          <div className='main-menu-section__title'>{ intl.formatMessage(menuIntlMessages.menuMedicalCard) }</div>
          <ul className='main-menu__list'>
            <li>
              <NavLink exact to={`/cabinet/cards/${user.cardId}/records`}>
                <FeatherIcon icon={'server'} size={19} /> { intl.formatMessage(menuIntlMessages.menuCardStream) }
              </NavLink>
            </li>
            <li>
              <span onClick={() => {
                showAddModal(user.cardId, 0, user.id, user.physicParameters)
              }}>
                <FeatherIcon icon={'plus-circle'} size={19} /> { intl.formatMessage(menuIntlMessages.menuAddRecord) }
              </span>
            </li>
            <li>
              <NavLink to={`/cabinet/cards/${user.cardId}/access`}>
                <FeatherIcon icon={'users'} size={19} /> { intl.formatMessage(menuIntlMessages.menuCardAccess) }
              </NavLink>
            </li>
            {/* <li> */}
            {/* <NavLink to={`/cabinet/cards/${user.cardId}/records/download`}> */}
            {/* <FeatherIcon icon={'download'} size={19} /> Скачать карту */}
            {/* </NavLink> */}
            {/* </li> */}
            <li>
              <NavLink to='/cabinet/monitoring'>
                <FeatherIcon icon={'eye'} size={19} /> { intl.formatMessage(menuIntlMessages.menuMonitoring) }
              </NavLink>
            </li>
          </ul>
        </div>
        : null
    }

    {
      user.entity_type === 'patient'
        ? <div className='main-menu-section'>
          <div className='main-menu-section__title'>{ intl.formatMessage(menuIntlMessages.menuEventsAndCalendar) }</div>
          <ul className='main-menu__list'>
            <li>
              <NavLink exact to={`/cabinet/events/calendar`}>
                <FeatherIcon icon={'calendar'} size={19} /> { intl.formatMessage(menuIntlMessages.menuCalendar) }
              </NavLink>
            </li>
            <li>
              <NavLink exact to={`/cabinet/events/list`}>
                <FeatherIcon icon={'check-square'} size={19} /> { intl.formatMessage(menuIntlMessages.menuEvents) }
              </NavLink>
            </li>
            <li>
              <NavLink exact to={`/cabinet/events/taskslists`}>
                <FeatherIcon icon={'align-left'} size={19} /> { intl.formatMessage(menuIntlMessages.menuTasksLists) }
              </NavLink>
            </li>
            <li>
              <NavLink exact to={`/cabinet/events/taskslines`}>
                <FeatherIcon icon={'copy'} size={19} /> { intl.formatMessage(menuIntlMessages.menuTasksLines) }
              </NavLink>
            </li>
          </ul>
        </div>
        : null
    }

    {
      user.entity_type === 'patient'
        ? <div className='main-menu-section'>
          <div className='main-menu-section__title'>{ intl.formatMessage(menuIntlMessages.menuDoctorsAndOrgs) }</div>
          <ul className='main-menu__list'>
            <li>
              <NavLink to={`/cabinet/doctors`}>
                <FeatherIcon icon={'server'} size={19} /> { intl.formatMessage(menuIntlMessages.menuDoctors) }
              </NavLink>
            </li>
            <li>
              <NavLink to={`/cabinet/organizations`}>
                <FeatherIcon icon={'users'} size={19} /> { intl.formatMessage(menuIntlMessages.menuOrgs) }
              </NavLink>
            </li>
            <li>
              <NavLink to={`/cabinet/records`}>
                <FeatherIcon icon={'users'} size={19} /> { intl.formatMessage(menuIntlMessages.menuReceptions) }
              </NavLink>
            </li>
          </ul>
        </div>
        : null
    }

    <div className='main-menu-section main-menu-section--bottom'>
      <div className='main-menu__list__divider' />
      <ul className='main-menu__list'>
        <li>
          {/* <LangSwitcher className='cabinet-menu-lang' /> */}
          {/* <a onClick={() => { switchLocale('ru') }} className={`cabinet-menu-lang ${intl.locale === 'ru' ? 'active' : ''}`}>RU</a> */}
          {/* <a onClick={() => { switchLocale('en') }} className={`cabinet-menu-lang ${intl.locale === 'en' ? 'active' : ''}`}>EN</a> */}
          {/* <a onClick={() => { switchLocale('kk') }} className={`cabinet-menu-lang ${intl.locale === 'kk' ? 'active' : ''}`}>KZ</a> */}
        </li>
        <li>
          <Link to={`/public`}>{ intl.formatMessage(menuIntlMessages.menuAboutProject) }</Link>
        </li>
        <li>
          <Link to={`/public#contacts`}>{ intl.formatMessage(menuIntlMessages.menuContacts) }</Link>
        </li>
        <li>
          <Link to={`/public/policy`}>{ intl.formatMessage(menuIntlMessages.menuPolicy) }</Link>
        </li>
      </ul>
    </div>
  </div>
})

const MainFilters = injectIntl(({ sections, specialties, user, intl, ...props }) => {
  return (
    <Template>
      <Route
        path='/cabinet/cards/:cardId/records'
        render={(props) => {
          return <Card>
            <div className='filter-header'>
              { intl.formatMessage(commonIntlMessages.recordsFilter) }
            </div>
            <Filters sections={sections} {...props} />
          </Card>
        }}
      />

      <Route
        path='/cabinet/patients/:patientId/:cardId/records'
        render={(props) => {
          return <Card>
            <div className='filter-header'>
              { intl.formatMessage(commonIntlMessages.recordsFilter) }
            </div>
            <Filters sections={sections} {...props} />
          </Card>
        }}
      />

      <ForRoles allow={['doctor']}>
        <Route
          exact
          path='/cabinet/patients'
          render={(props) => {
            return <Card>
              <div className='filter-header'>
                { intl.formatMessage(commonIntlMessages.filterPatients) }
              </div>
              <PatientsFilters {...props} />
            </Card>
          }}
        />
      </ForRoles>

      <Route
        path={user.entity_type === 'patient' ? '/cabinet/events/list' : '/cabinet/patients/:patientId/events'}
        render={(props) => {
          return <Card>
            <div className='filter-header'>
              { intl.formatMessage(commonIntlMessages.filterEvents) }
            </div>
            <EventsFilters {...props} />
          </Card>
        }}
      />

      <Route
        path='/cabinet/schedule'
        render={(props) => {
          return <QueuesFilters {...props} />
        }}
      />

      <ForRoles allow={['doctor, registry']}>
        <Route
          path='/cabinet/records'
          render={(props) => {
            return <Card>
              <div className='filter-header'>
                { intl.formatMessage(commonIntlMessages.filterPatients) }
              </div>
              <DoctorRequestsFilter specialties={specialties} {...props} />
            </Card>
          }}
        />
      </ForRoles>

      <ForRoles allow={['patient']}>
        <Route
          path='/cabinet/records'
          render={(props) => {
            return <Card>
              <div className='filter-header'>
                { intl.formatMessage(commonIntlMessages.filterDoctors) }
              </div>
              <PatientRequestsFilter {...props} />
            </Card>
          }}
        />
      </ForRoles>

      <Route
        exact
        path='/cabinet/doctors'
        render={(props) => {
          return <Card>
            <div className='filter-header'>
              { intl.formatMessage(commonIntlMessages.filterDoctors) }
            </div>
            <DoctorsFilters specialties={specialties} {...props} />
          </Card>
        }}
      />

      <Route
        path='/cabinet/doctors/:id'
        render={(props) => {
          return <Card className='filter-buttons'>
            <DoctorDetailActions {...props} />
          </Card>
        }}
      />

      <Route
        exact
        path='/cabinet/organizations'
        render={(props) => {
          return <Card>
            <div className='filter-header'>
              { intl.formatMessage(commonIntlMessages.filterOrgs) }
            </div>
            <OrgsFilters specialties={specialties} {...props} />
          </Card>
        }}
      />

      <Route
        path='/cabinet/organizations/:id'
        render={(props) => {
          return <Card className='filter-buttons'>
            <OrgDetailActions {...props} />
          </Card>
        }}
      />
    </Template>
  )
})

class CabinetLayout extends PureComponent {
  constructor () {
    super()

    this.state = {
      menuExpanded: false,
      smallerHeader: false,
      mobileMenuOpen: false
    }

    this.scrollListener = throttle(this.scrollListener, 50).bind(this)
  }

  showMobileMenu () {
    this.setState({
      mobileMenuOpen: true
    })
  }

  hideMobileMenu () {
    this.setState({
      mobileMenuOpen: false
    })
  }

  scrollListener (e) {
    if (window.scrollY > 0) {
      this.setState({
        smallerHeader: true
      })
    } else {
      this.setState({
        smallerHeader: false
      })
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.location.pathname !== nextProps.location.pathname && this.state.mobileMenuOpen) {
      this.setState({mobileMenuOpen: false})
    }
  }

  componentDidMount () {
    window.addEventListener('scroll', this.scrollListener)
  }

  componentWillUnmount () {
    window.removeEventListener('scroll', this.scrollListener)
  }

  render () {
    const { props, state } = this
    const { user, children, sections, showAddModal, showCreateCardModal, specialties } = props

    return <div className='layout'>
      <div className='site-header--stub' />

      <header className={`site-header ${state.smallerHeader ? 'site-header--smaller' : ''}`}>
        <div className='main-col-layout'>
          <MediaQuery rule='(min-width: 1024px)'>
            <div className='main-col-layout__left site-header__logo'>
              <NavLink to='/cabinet'><img src={logo} alt='PHR' /></NavLink>
            </div>
          </MediaQuery>
          <MediaQuery
            rule='(max-width: 1023px)'
            onChange={() => {
              this.hideMobileMenu()
            }}
          >
            <div onClick={() => { this.showMobileMenu() }} className='mobile-menu-btn'>
              <FeatherIcon icon='menu' size={32} />
            </div>

            <Drawer
              onCloseRequest={() => { this.hideMobileMenu() }}
              isOpen={this.state.mobileMenuOpen}
              className='mobile-menu-drawer'
            >
              <header className={`site-header`}>
                <div className='main-col-layout'>
                  <div className='main-col-layout__left site-header__logo'>
                    <img src={logo} alt='PHR' />
                  </div>
                </div>
              </header>
              <div style={{ padding: '1.25rem' }}>
                <MainMenu
                  user={user}
                  showAddModal={() => {
                    showAddModal()
                    if (state.mobileMenuOpen) this.setState({mobileMenuOpen: false})
                  }}
                  showCreateCardModal={() => {
                    showCreateCardModal()
                    if (state.mobileMenuOpen) this.setState({mobileMenuOpen: false})
                  }}
                />
              </div>
            </Drawer>
          </MediaQuery>

          <div className='main-col-layout__main site-header__search'>
            <Search />
          </div>
          <div className='main-col-layout__right'>
            <div className='header-profile'>

              <div className='header-notifications'>
                <Notifications />
              </div>

              <MediaQuery rule='(min-width: 1221px)'>
                <UserIdentity
                  user={user}
                  size='sm'
                  avatarPosition='right'
                />
              </MediaQuery>
            </div>
          </div>
        </div>
      </header>

      <div className='layout__content'>
        <div className='main-col-layout'>
          <MediaQuery rule='(min-width: 1024px)'>
            <div className='main-col-layout__left'>
              {/* <Sticky offset={80}> */}
              <MainMenu user={user} showAddModal={showAddModal} showCreateCardModal={showCreateCardModal} />
              {/* </Sticky> */}
            </div>
          </MediaQuery>
          <div className='main-col-layout__main'>
            <Firebase />
            { children }
          </div>
          {
            console.log(props.location)
          }
          {
            // props.location.pathname !== '/events/calendar' &&
            !/events\/calendar/.test(props.location.pathname) &&
            !/monitoring/.test(props.location.pathname)
              ? (
                <Template>
                  <MediaQuery rule='(min-width: 1221px)'>
                    <div className='main-col-layout__right layout__content__right'>
                      <MainFilters {...props} user={user} sections={sections} specialties={specialties} />
                    </div>
                  </MediaQuery>
                  {
                    !(PAGES_WITHOUT_FILTERS.indexOf(props.location.pathname) + 1) &&
                    !/access$/.test(props.location.pathname) &&
                    !/taskslists/.test(props.location.pathname)
                      ? (
                        <MediaQuery rule='(max-width: 1220px)'>
                          <Drawer
                            right
                            onCloseRequest={() => this.setState({showFilters: false})}
                            isOpen={this.state.showFilters}
                            className='mobile-menu-drawer'
                          >
                            <MainFilters {...props} user={user} sections={sections} specialties={specialties} />
                          </Drawer>
                          <div
                            onClick={() => this.setState({showFilters: true})}
                            className='filter-btn'>
                            <FeatherIcon icon='sliders' size='22' />
                          </div>
                        </MediaQuery>
                      )
                      : null
                  }
                </Template>
              )
              : null
          }
        </div>
      </div>
    </div>
  }
}

const mapStateToProps = ({ user, reference }) => {
  return {
    user,
    sections: reference.sections || [],
    specialties: reference.specialties || []
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    showAddModal: function (...args) {
      dispatch(showAddModal(...args))
    },

    showCreateCardModal: function () {
      dispatch(showCreateCardModal())
    }
  }
}

export default injectIntl(withRouter(connect(mapStateToProps, mapDispatchToProps)(CabinetLayout)))

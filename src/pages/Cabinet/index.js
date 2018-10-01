import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Route, Redirect, Switch } from 'react-router-dom'

import store from 'store'

import CabinetLayout from '../../layouts/CabinetLayout'
import { OverlaySpinner } from '../../components/Loader'

import Desktop from './Desktop'

import { fetchUser, invalidateUser, fetchSosCard } from '../../redux/user/actions'

import api from '../../api'
import { fetchReference } from '../../redux/reference/actions'
import Cards from './Cards'
import Add from './Add'
import Patients from './Patients'
import Doctors from './Doctors'
import Organizations from './Organizations'
import Schedule from './Schedule'
import DoctorRecords from './Records/Doctor'
import PatientRecords from './Records/Patient'
import { PatientProfile, DoctorProfile, OrganizationProfile } from './Profile'
import Sos from './Profile/Patient/Sos'
import Assistants from './Assistants'
import OrgWorkers from './OrgWorkers'
import Template from '../../components/Template'
import PriceList from './PriceList'
import Events from './Events'
import Modal from '../../components/Modal'
import { hideAddModal, hideCreateCardModal } from '../../redux/modals/actions'
import CreateCard from './Patients/Form/CreateCard'
import Monitoring from './Monitoring'
import PatientParamsProvider from '../../components/PatientProvider/PatientParamsProvider'

class Cabinet extends Component {
  constructor (props) {
    super()

    this.prevLocation = props.location
  }

  componentDidMount () {
    if (store.get('cabToken')) {
      api.storeToken(store.get('cabToken'))
      store.set('cabToken', null)
    }

    this.req = this.props.fetchUser()
    this.req.then(({ data: { data } }) => {
      if (data.entity_type === 'patient') this.props.fetchSosCard()
    })

    this.props.fetchSections()
    this.props.fetchParameters()
    this.props.fetchSpecialties()

    // this.props.history.listen((...args) => { console.log('listen', args) })
  }

  componentWillUpdate (nextProps) {
    const { location } = this.props
    // set previousLocation if props.location is not modal
    if (
      nextProps.history.action !== 'POP' &&
      (!location.state || !location.state.modal)
    ) {
      this.previousLocation = this.props.location
    }
  }

  componentWillUnmount () {
    if (this.req) {
      this.req.cancel()
    }
  }

  render () {
    const { user, match, location, isAddModalVisible, hideAddModal } = this.props

    if (!user.loading && user.failed) {
      return <Redirect to={{ pathname: '/public', hash: 'login', state: { ref: location.pathname } }} />
    }

    if ((user.loading || !user.id) || (user.entity_type === 'patient' && user.sosLoading)) {
      return <OverlaySpinner />
    }

    if (
      user.status !== 'enabled' &&
      location.pathname !== '/cabinet/profile' &&
      location.pathname !== '/cabinet/logout'
    ) {
      return <Redirect to='/cabinet/profile' />
    }

    if (location.pathname === `/cabinet`) {
      // пациента перенаправляем на рабочий стол
      if (
        user.entity_type === 'patient' &&
        location.pathname !== '/cabinet/desktop'
      ) {
        return <Redirect to='/cabinet/desktop' />
      }

      if (
        (user.entity_type === 'doctor' || user.entity_type === 'assistant') &&
        location.pathname !== '/cabinet/patients'
      ) {
        return <Redirect to='/cabinet/patients' />
      }

      if (
        (user.entity_type === 'registry') &&
        location.pathname !== '/cabinet/schedule'
      ) {
        return <Redirect to='/cabinet/schedule' />
      }

      if (user.entity_type === 'administrator' && location.pathname !== '/cabinet/workers') {
        return <Redirect to='/cabinet/workers' />
      }
    }

    const isModal = location.state && location.state.modal

    return <CabinetLayout>
      <PatientParamsProvider patientParams={user.physicParameters}>
        <Switch location={isModal ? this.prevLocation : location}>
          <Route exact path={`${match.url}/desktop`} component={Desktop} />
          <Route path={`${match.url}/cards`} component={Cards} />
          <Route path={`${match.url}/events`} component={Events} />
        </Switch>
      </PatientParamsProvider>

      <Switch location={isModal ? this.prevLocation : location}>
        {/* <Route exact path={`${match.url}/desktop`} component={Desktop} /> */}
        {/* <Route path={`${match.url}/cards`} component={Cards} /> */}
        {/* <Route path={`${match.url}/events`} component={Events} /> */}
        {
          user.entity_type === 'patient' && (
            <Template>
              <Route path={`${match.url}/profile`} component={PatientProfile} />
              { user.sos && (user.sos.status === 'active' || user.sos.status === 'inactive') && <Route path={`${match.url}/sos`} component={Sos} /> }
              <Route path={`${match.url}/organizations`} component={Organizations} />
              <Route path={`${match.url}/doctors`} component={Doctors} />
              <Route
                path={`${match.url}/monitoring`}
                component={Monitoring}
              />
              <Route path={`${match.url}/records`} component={PatientRecords} />
            </Template>
          )
        }

        {
          user.entity_type === 'assistant'
            ? <Template>
              <Route path={`${match.url}/profile`} render={() => <Redirect to='/cabinet/patients' />} />
              <Route path={`${match.url}/patients`} component={Patients} />
            </Template>
            : null
        }

        {
          (user.entity_type === 'doctor' || user.entity_type === 'registry' || user.entity_type === 'administrator') && (
            <Template>
              <Route path={`${match.url}/patients`} component={Patients} />
              <Route path={`${match.url}/schedule`} component={Schedule} />
              <Route path={`${match.url}/records`} component={DoctorRecords} />
              <Route path={`${match.url}/price-list`} component={PriceList} />
              {
                user.entity_type === 'doctor' && (
                  <Template>
                    <Route path={`${match.url}/profile`} component={DoctorProfile} />
                    <Route path={`${match.url}/assistants`} component={Assistants} />
                  </Template>
                )
              }
              {
                user.entity_type === 'administrator' && (
                  <Template>
                    <Route path={`${match.url}/profile`} component={OrganizationProfile} />
                    <Route path={`${match.url}/workers`} component={OrgWorkers} />
                  </Template>
                )
              }
            </Template>
          )
        }
      </Switch>

      <Route
        path={`${match.url}/logout`}
        render={() => {
          api.resetAuth()
          this.props.invalidateUser()

          return <Redirect to='/' />
        }}
      />

      { isAddModalVisible && <Modal onRequestClose={() => { hideAddModal() }}><Add tabIndex={1} /></Modal> }

      <Template if={user.entity_type === 'doctor' || user.entity_type === 'registry'}>
        {
          this.props.isCreateCardModalVisible &&
          <CreateCard
            onSuccess={
              (data) => {
                this.props.hideCreateCardModal()
                this.props.history.replace({ pathname: '/cabinet/patients', search: `added=${data.id}` })
              }
            }
            onRequestClose={() => {
              this.props.hideCreateCardModal()
            }}
          />
        }
      </Template>
    </CabinetLayout>
  }
}

const mapStateToProps = ({ user, modals }) => {
  return {
    user,
    isAddModalVisible: modals.isAddModalVisible,
    isCreateCardModalVisible: modals.isCreateCardModalVisible
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchUser: function () {
      return dispatch(fetchUser())
    },

    fetchSosCard: function () {
      return dispatch(fetchSosCard())
    },

    fetchSections: function (query = {}) {
      return dispatch(fetchReference('sections', query))
    },

    fetchParameters: function (query = {}) {
      return dispatch(fetchReference('parameters', query))
    },

    fetchSpecialties: function (query = {}) {
      return dispatch(fetchReference('specialties', query))
    },

    hideAddModal: function () {
      return dispatch(hideAddModal())
    },

    hideCreateCardModal: function () {
      return dispatch(hideCreateCardModal())
    },

    invalidateUser: function () {
      return dispatch(invalidateUser())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Cabinet)

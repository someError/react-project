import React from 'react'
import { Route } from 'react-router-dom'

import Template from '../../../components/Template'

import DoctorsList from './DoctorsList'
import DoctorDetail from './DoctorDetail'

const Doctors = ({ match }) => {
  return <Template>
    <Route exact path={`${match.url}`} component={DoctorsList} />
    <Route exact path={`${match.url}/:id`} component={DoctorDetail} />
  </Template>
}

export default Doctors

import React from 'react'
import { Route } from 'react-router-dom'

import PatientsList from './PatientsList'
import Patient from './Patient'

const Patients = ({ match }) => {
  return <div>
    <Route exact path={`${match.url}`} component={PatientsList} />
    <Route path={`${match.url}/:patientId`} component={Patient} />
  </div>
}

export default Patients

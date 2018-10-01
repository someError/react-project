import React from 'react'
import { Route } from 'react-router-dom'

import OrganizationsList from './OrganizationsList'
import OrganizationDetail from './OrganizationDetail'

const Organizations = ({ match }) => {
  return <div>
    <Route exact path={`${match.url}`} component={OrganizationsList} />
    <Route exact path={`${match.url}/:id`} component={OrganizationDetail} />
  </div>
}

export default Organizations

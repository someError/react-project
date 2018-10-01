import React from 'react'
import { Route, withRouter } from 'react-router-dom'

const AliasRoute = ({ location, alias, ...props }) => {
  location = alias ? { pathname: alias } : location
  return <Route {...props} location={location} />
}

export default withRouter(AliasRoute)

import React from 'react'
import { connect } from 'react-redux'
import Template from '../Template'
import includes from 'lodash/includes'

const ForRoles = ({ allow, disallow, user, children }) => {
  let render = true

  if (disallow && disallow.length) {
    render = !includes(disallow, user.entity_type)
  } else if (allow && allow.length) {
    render = includes(allow, user.entity_type)
  }

  return <Template if={render}>
    { children }
  </Template>
}

ForRoles.defaultProps = {
  // allow: [],
  // disallow: []
}

export default connect(({ user }) => ({ user }))(ForRoles)

import React from 'react'
import { Link, NavLink, withRouter } from 'react-router-dom'
import isPlainObject from 'lodash/isPlainObject'
// import PropTypes from 'prop-types'

const ModalLink = ({ to, match, history, location, staticContext, navLink, ...props }) => {
  let Component = navLink ? NavLink : Link

  let modalTo = {
    state: {
      modal: true,
      fromUrl: history.createHref(location)
    }
  }

  if (location.state && location.state.modal) {
    modalTo.state = {
      modal: location.state.modal
    }
  } else if (isPlainObject(to)) {
    modalTo.state = {
      ...modalTo.state,
      ...to.state
    }

    modalTo = {
      ...to,
      ...modalTo
    }
  } else {
    modalTo.pathname = to
  }

  return <Component to={modalTo} {...props} />
}

ModalLink.propTypes = Link.propTypes

export default withRouter(ModalLink)

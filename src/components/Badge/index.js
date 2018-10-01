import React, { Children } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

import './Badge.css'

const Badge = ({ children, value, inline, ...props }) => {
  const child = Children.only(children)

  const newProps = {
    ...props,
    className: classNames(child.props.className, 'badge', { 'badge--inline': inline })
  }

  if (typeof value !== 'undefined' || value !== null) {
    newProps['data-badge'] = value
  }

  return React.cloneElement(child, newProps)
}

Badge.propTypes = {
  children: PropTypes.node,
  value: PropTypes.any,
  inline: PropTypes.bool
}

Badge.defaultProps = {
  inline: false
}

export default Badge

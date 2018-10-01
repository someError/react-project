import React, { Children } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import './Tooltip.css'

const Tooltip = ({ text, position, children, error, active }) => {
  const child = Children.only(children || <div />)

  const clsName = classNames('tooltip', `tooltip-${position}`, {active}, {'tooltip--error': error}, child.props.className)

  return React.cloneElement(child, { 'data-tooltip': text, className: clsName })
}

Tooltip.defaultProps = {
  position: 'top'
}

Tooltip.propTypes = {
  text: PropTypes.string.isRequired,
  position: PropTypes.string
}

export default Tooltip

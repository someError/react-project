import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import './SwitchBase.css'

const SwitchBase = ({ className, checkClassName, checkChildren, checked, type, ...props }) => {
  const clsName = classNames('switch', className)

  return <span className={clsName}><input type={type} checked={checked} /><span className={checkClassName} children={checkChildren} /></span>
}

SwitchBase.propTypes = {
  type: PropTypes.oneOf(['radio', 'checkbox'])
}

export default SwitchBase

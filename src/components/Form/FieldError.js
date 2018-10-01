import React from 'react'
import classNames from 'classnames'

import './FieldError.css'

const FieldError = ({ children, className, ...props }) => {
  const clsName = classNames('field-error', className)

  return <div className={clsName} {...props}>{ children }</div>
}

export default FieldError

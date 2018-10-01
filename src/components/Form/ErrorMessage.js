import React from 'react'
import classNames from 'classnames'

import './ErrorMessage.css'

const ErrorMessage = ({ children, className, ...props }) => {
  return children
    ? <div className={classNames('error-message', className)}>{ children }</div>
    : null
}

export default ErrorMessage

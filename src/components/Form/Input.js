import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const Input = ({className, textarea, size, success, ...props}) => {
  const clsName = classNames(className, 'form-input', { [`input-${size}`]: !!size, 'is-success': success })

  return textarea
    ? <textarea className={clsName} {...props} />
    : <input className={clsName} {...props} />
}

Input.defaultProps = {
  type: 'text',
  success: false
}

Input.propTypes = {
  textarea: PropTypes.bool,
  type: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'lg']),
  success: PropTypes.bool
}

export default Input

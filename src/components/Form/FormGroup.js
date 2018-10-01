import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Label from './Label'

const FormGroup = ({ label, defaultHint, hint, className, error, children }) => {
  const clsName = classNames('form-group', className, { 'has-error': error })

  return <div className={clsName}>
    <Label>{ label }</Label>
    { children }
    <div className='form-input-hint'>{ hint || defaultHint }</div>
  </div>
}

FormGroup.propTypes = {
  error: PropTypes.bool,
  defaultHint: PropTypes.node,
  hint: PropTypes.node,
  label: PropTypes.node
}

export default FormGroup

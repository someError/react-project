import React from 'react'
import classNames from 'classnames'

const Label = ({className, ...props}) => {
  const clsName = classNames('form-label', className)

  return <label className={clsName} {...props} />
}

export default Label

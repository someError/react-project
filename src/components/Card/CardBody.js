import React from 'react'
import classNames from 'classnames'

import './CardBody.css'

const CardBody = ({ className, ...props }) => {
  const clsName = classNames('card-body', className)
  return <div className={clsName} {...props} />
}

export default CardBody

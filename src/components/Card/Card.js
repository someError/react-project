import React from 'react'
import classNames from 'classnames'

import './Card.css'

const Card = ({ className, ...props }) => {
  const clsName = classNames('card', className)

  return <div className={clsName} {...props} />
}

export default Card

import React from 'react'
import classNames from 'classnames'

import './CardHeader.css'

const CardHeader = ({ className, ...props }) => {
  const clsName = classNames('card-header', className)

  return <div className={clsName} {...props} />
}

CardHeader.displayName = 'CardHeader'

export default CardHeader

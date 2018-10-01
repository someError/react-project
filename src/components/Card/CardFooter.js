import React from 'react'
import classNames from 'classnames'

import './CardFooter.css'

const CardFooter = ({ className, ...props }) => {
  const clsName = classNames('card-footer', className)

  return <div className={clsName} {...props} />
}

export default CardFooter

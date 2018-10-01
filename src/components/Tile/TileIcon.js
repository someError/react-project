import React from 'react'
import classNames from 'classnames'

const TileIcon = ({ children, className, ...props }) => {
  const clsName = classNames('tile-icon', className)

  return <div className={clsName} {...props}>{ children }</div>
}

export default TileIcon

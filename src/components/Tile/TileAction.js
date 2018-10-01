import React from 'react'
import classNames from 'classnames'

const TileAction = ({ children, className, ...props }) => {
  const clsName = classNames('tile-action', className)

  return <div className={clsName} {...props}>{ children }</div>
}

export default TileAction

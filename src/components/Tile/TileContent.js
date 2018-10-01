import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const TileContent = ({ children, className, ...props }) => {
  const clsName = classNames('tile-content', className)

  return <div className={clsName} {...props}>{ children }</div>
}

TileContent.propTypes = {
  children: PropTypes.node
}

export default TileContent

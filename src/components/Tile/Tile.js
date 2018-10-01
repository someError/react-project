import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

import './Tile.css'

const Tile = ({ centered, inline, children, className, ...props }) => {
  const clsName = classNames('tile', className, { 'tile-centered': centered, 'tile-inline': inline })

  return <div {...props} className={clsName}>
    { children }
  </div>
}

Tile.propTypes = {
  centered: PropTypes.bool,
  inline: PropTypes.bool,
  className: PropTypes.string
}

Tile.defaultProps = {
  centered: false,
  inline: false
}

export default Tile

import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import './Table.css'

const Table = ({ className, hover, stripped, ...props }) => {
  const clsName = classNames('table', className, { 'table-hover': hover, 'table-striped': stripped })

  return <table className={clsName} {...props} />
}

Table.propTypes = {
  hover: PropTypes.bool,
  stripped: PropTypes.bool,
  className: PropTypes.string
}

Table.defaultProps = {
  hover: false,
  stripped: false
}

export default Table

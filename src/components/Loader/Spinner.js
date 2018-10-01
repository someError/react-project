import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import './Spinner.css'

const Spinner = ({ size, className }) => {
  const clsName = classNames('loading', className, { [`loading-${size}`]: !!size })

  return <div className={clsName} />
}

Spinner.propTypes = {
  size: PropTypes.oneOf(['lg', 'sm'])
}

Spinner.defaultProps = {
  size: 'lg'
}

export default Spinner

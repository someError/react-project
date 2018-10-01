import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import memoize from 'memoizejs'

import FeatherIcon from '../Icons/FeatherIcon'

import './SwitchBase.css'
import './Checkbox.css'

const getIconSize = memoize((size) => {
  switch (size) {
    case 'sm':
      return 20
    case 'xl':
      return 35
    default:
      return 28
  }
})

const Checkbox = ({ label, size, ...props }) => {
  return <label className={classNames('checkbox-component', { [`checkbox-component--${size}`]: size, 'checkbox-component--disabled': props.disabled })}>
    <span className='switch checkbox'>
      <input
        {...props}
        type='checkbox'
      />
      <span className='switch-view'>
        <span className='switch-check'><FeatherIcon color='#3A76D2' size={getIconSize(size)} icon={'check'} /></span>
      </span>
    </span>
    <span>{ label }</span>
  </label>
}

Checkbox.propTypes = {
  label: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'xl']),
  disabled: PropTypes.bool
}

export default Checkbox

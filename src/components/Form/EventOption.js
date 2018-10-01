import React from 'react'

import './EventOption.css'
import FeatherIcon from '../Icons/FeatherIcon'

const EventOption = ({ label, icon, ...props }) => {
  return <span className='event-option'>
    <input type='checkbox' {...props} />
    <span className='event-option-view'>
      <FeatherIcon icon={icon} />
      { label }
    </span>
  </span>
}

export default EventOption

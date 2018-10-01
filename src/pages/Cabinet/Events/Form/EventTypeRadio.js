import React from 'react'
import FeatherIcon from '../../../../components/Icons/FeatherIcon'
import classNames from 'classnames'

import './EventTypeRadio'
import Template from '../../../../components/Template'

import './EventTypeRadio.css'

const EventTypeRadio = ({ icon, label, checked, ...props }) => {
  return <label className='event-type-radio'>
    <input type='radio' checked={checked} {...props} />
    <span className={classNames('btn btn--sm', { 'btn--ghost': !checked })}>
      { !!icon && <Template><FeatherIcon size={18} icon={icon} />{' '}</Template> }
      { label }
    </span>
  </label>
}

export default EventTypeRadio

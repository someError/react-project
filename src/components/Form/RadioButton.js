import React from 'react'

import './SwitchBase.css'
import './RadioButton.css'

const RadioButton = ({ label, name, checked, ...props }) => {
  return <label className='radio-button'>
    <span className='switch radio'>
      <input
        checked={checked}
        name={name}
        type='radio'
        {...props}
      />
      <span className='switch-view'>
        <span className='switch-check' />
      </span>
    </span> <span>{ label }</span>
  </label>
}

export default RadioButton

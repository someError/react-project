import React from 'react'
import FeatherIcon from '../Icons/FeatherIcon'

import './AddButton.css'

const AddButton = ({ children, ...props }) => {
  return <span className='add-param' {...props}>
    <FeatherIcon icon='plus-circle' size={20} /> { children }
  </span>
}

export default AddButton

import React from 'react'
import classNames from 'classnames'

import FeatherIcon from '../../../../components/Icons/FeatherIcon'

import './SectionAddButton.css'
import Template from '../../../../components/Template/index'

const SectionAddButton = ({ icon, children, className, ...props }) => {
  return <button type='button' className={classNames('section-add-btn', className)} {...props}>
    { icon && <Template><FeatherIcon size={18} icon={icon} />{' '}</Template> }
    <span className='section-add-btn__title'>{ children }</span>
  </button>
}

export default SectionAddButton

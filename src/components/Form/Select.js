import React, { Children } from 'react'
import classNames from 'classnames'

import './MaterialInput.css'
import './Select.css'

import FeatherIcon from '../Icons/FeatherIcon'

// FIXME: как-то объединить с MaterialInput, а то дублей много как-то

const Select = ({ className, material, children, label, error, pad, ...props }) => {
  const hasLabel = !!label
  let clsName = classNames('form-select', { 'material-input': material, error: error, 'has-label': hasLabel, 'h-pad': pad }, className)
  let hasSelected = false

  const childrenArray = Children.toArray(children)

  if (hasLabel) {
    for (let childIndex = 0; childIndex < childrenArray.length; childIndex++) {
      if (childrenArray[childIndex].props.value === props.value) {
        hasSelected = true
        break
      }
    }

    clsName = classNames(clsName, {active: hasSelected})
  } else {
    hasSelected = true
  }

  return <span className={clsName}>
    { label && <label>{ label }</label> }
    <span className='form-select-wrap' style={{width: (props.style && props.style.width) || '100%'}} >
      <select {...props}>
        {/* { label && !props.value ? <option /> : null } */}
        { !hasSelected ? <option /> : null }
        { children }
      </select> <FeatherIcon icon={'chevron-down'} size={16} />
      { error && typeof error === 'string' && <i className='material-input__error'>{error}</i> }
    </span>
  </span>
}

export default Select

import React, { Children } from 'react'
import PropTypes from 'prop-types'

import './RadioGroup.css'

const RadioGroupButton = ({ label, ...props }) => {
  return <label className='radio-group__item'>
    <input type='radio' {...props} />
    <span className='radio-group__item-view'>{ label }</span>
  </label>
}

export { RadioGroupButton }

const RadioGroup = ({ onChange, label, children, error }) => {
  return <span className='radio-group-wrap'>
    <div>
      <span className='radio-group-label'>{ label }</span>
      <div className='radio-group'>
        { Children.map(children, (child) => React.cloneElement(child, { onChange })) }
      </div>
    </div>
    { error && typeof error === 'string' && <i className='material-input__error'>{ error }</i> }
  </span>
}

RadioGroup.defaultProps = {
  variants: []
}

RadioGroup.PropTypes = {
  variants: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    checked: PropTypes.bool
  })),
  name: PropTypes.string.isRequired
}

export default RadioGroup

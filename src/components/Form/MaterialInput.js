import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Textarea from 'react-textarea-autosize'
import InputMask from 'react-input-mask'

import './MaterialInput.css'
import { noop } from '../../util'
import FeatherIcon from '../Icons/FeatherIcon'
// import FieldError from './FieldError'

class MaterialInput extends PureComponent {
  constructor (props) {
    super()

    this.state = {
      hasValue: !!props.defaultValue || !!props.value
    }
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      hasValue: !!nextProps.defaultValue || !!nextProps.value
    })
  }

  focus () {
    this.input.focus()
  }

  render () {
    const { hasValue } = this.state
    const {
      value,
      label,
      className,
      onChange,
      error,
      disabled,
      inputClassName,
      textarea,
      phone,
      pad,
      icon,
      iconColor,
      width,
      style,
      size,
      ...props
    } = this.props

    const clsName = classNames('material-input', className, { active: hasValue, error: error, disabled, 'has-label': !!label, [`material-input--${size}`]: !!size })

    const wrapStyle = {
      ...style,
      width
    }

    const inputProps = {
      ref: (input) => { this.input = input },
      onChange: (e) => {
        if (props.numeric && e.target.value && !/^\d+$/.test(e.target.value)) return
        this.setState({ hasValue: !!e.target.value })
        onChange(e)
      },
      className: inputClassName,
      disabled: disabled,
      value: value,
      ...props
    }

    let inputTemplate = <input {...inputProps} />
    if (textarea) {
      inputTemplate = <Textarea {...inputProps} />
    } else if (phone) {
      if (inputProps.value && inputProps.value.length === 11 && inputProps.value[0] === '8') {
        inputProps.value = inputProps.value.slice(1)
      }
      inputTemplate = <InputMask mask='+7 (999) 999-99-99' {...inputProps} />
    }

    return <div className={clsName} style={wrapStyle}>
      <label>{ label }</label>
      { inputTemplate }
      {
        icon
          ? <span className='material-input__icon'><FeatherIcon color={iconColor || '#3A76D2'} icon={icon} size={20} /></span>
          : null
      }
      { error && typeof error === 'string' && <i className='material-input__error'>{ error }</i> }
    </div>
  }
}

MaterialInput.defaultProps = {
  onChange: noop,
  error: false,
  pad: false,
  width: null
}

MaterialInput.propTypes = {
  onChange: PropTypes.func,
  error: PropTypes.bool,
  pad: PropTypes.bool,
  size: PropTypes.oneOf(['lg'])
}

export default MaterialInput

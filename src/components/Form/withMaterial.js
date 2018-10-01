import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Textarea from 'react-textarea-autosize'

import './MaterialInput.css'
import { noop } from '../../util'
// import FieldError from './FieldError'

const withMaterial = (Component) => {
  class MaterialInput extends PureComponent {
    constructor (props) {
      super()

      this.state = {
        hasValue: !!props.value
      }
    }

    componentWillReceiveProps (nextProps) {
      this.setState({
        hasValue: !!nextProps.value
      })
    }

    focus () {
      this.input.focus()
    }

    render () {
      const {hasValue} = this.state
      const {
        value,
        label,
        className,
        onChange,
        error,
        disabled,
        inputClassName,
        textarea,
        pad,
        ...props
      } = this.props

      const clsName = classNames('material-input', className, {
        active: hasValue,
        error: error,
        disabled,
        'has-label': !!label,
        'h-pad': pad
      })

      const inputProps = {
        ref: (input) => { this.input = input },
        onChange: (e) => {
          this.setState({hasValue: !!e.target.value})
          onChange(e)
        },
        className: inputClassName,
        disabled: disabled,
        value: value,
        ...props
      }

      return <div className={clsName}>
        <label>{label}</label>
        {
          !textarea
            ? <input {...inputProps} />
            : <Textarea {...inputProps} />
        }
      </div>
    }
  }

  MaterialInput.defaultProps = {
    onChange: noop,
    error: false,
    pad: false
  }

  MaterialInput.propTypes = {
    onChange: PropTypes.func,
    error: PropTypes.bool,
    pad: PropTypes.bool
  }
}

export default withMaterial

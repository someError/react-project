import React, { Component } from 'react'
import classNames from 'classnames'
import DayPickerInput from 'react-day-picker/DayPickerInput'
import MomentLocaleUtils from 'react-day-picker/moment'

import MaterialInput from './MaterialInput'

import 'react-day-picker/lib/style.css'
import './DateInput.css'

class InputWithCalendarIcon extends Component {
  focus () {
    this.input.focus()
  }

  render () {
    const { props } = this
    return <MaterialInput ref={input => { this.input = input }} icon='calendar' {...props} />
  }
}

const DateInput = ({ className, error, dayPickerProps, ...props }) => {
  return (
    <div className='day-picker-wrap' style={{position: 'relative'}}>
      <DayPickerInput
        className={classNames('form-input', className, {'error': error})}
        format={'DD.MM.YYYY'}
        component={InputWithCalendarIcon}
        dayPickerProps={{
          ...dayPickerProps,
          locale: 'ru',
          localeUtils: MomentLocaleUtils
        }}
        {...props}
      />
      { error && typeof error === 'string' && <i className='material-input__error'>{ error }</i> }
    </div>
  )
}

export default DateInput

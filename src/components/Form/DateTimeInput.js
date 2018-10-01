import React from 'react'
import DateInput from './DateInput'
import moment from 'moment'

import { noop } from '../../util'

import './DateTimeInput.css'
import TimeInput from './TimeInput'

const DateTimeInput = ({ value, dateFormat, timeFormat, onChange, dayPickerProps, disableTime, hideLabels }) => {
  const momentValue = moment(value, [dateFormat, timeFormat].join(' '))

  return <div className='date-time-input'>
    <div style={{ maxWidth: '140px' }}>
      <DateInput
        label={!hideLabels && 'Дата'}
        onDayChange={(selectedDate) => {
          onChange(moment(selectedDate).hour(momentValue.hour()).minute(momentValue.minute()).toDate())
        }}
        value={momentValue.format(dateFormat)}
        format={dateFormat}
        dayPickerProps={dayPickerProps}
      />
    </div>
    <div>
      <TimeInput
        label={!hideLabels ? 'Время' : ''}
        onChange={(value) => {
          // const { value } = e.target
          const newDate = moment(momentValue)

          const timeMoment = moment(value, timeFormat)

          if (timeMoment.isValid()) {
            newDate.hour(timeMoment.hour()).minute(timeMoment.minute())
          }

          onChange(newDate.toDate())
        }}
        disabled={disableTime}
        defaultValue={momentValue.format(timeFormat)}
      />
    </div>
  </div>
}

DateTimeInput.defaultProps = {
  dateFormat: 'DD.MM.YYYY',
  timeFormat: 'HH:mm',
  onChange: noop,
  disableTime: false
}

export default DateTimeInput

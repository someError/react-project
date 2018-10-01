import React, { Component } from 'react'
import DayPicker from 'react-day-picker'
import MomentLocaleUtils from 'react-day-picker/moment'
import { Card } from '../Card'
import './style.css'

class Calendar extends Component {
  componentDidUpdate (nextProps) {
    const prevActiveRow = document.getElementsByClassName('DayPicker-Week--active')
    if (prevActiveRow[0]) {
      prevActiveRow[0].classList.remove('DayPicker-Week--active')
    }
    const activeDay = document.getElementsByClassName('DayPicker-Day--selected')
    console.log(activeDay)
    activeDay[0] && activeDay[0].parentNode.classList.add('DayPicker-Week--active')
  }

  render () {
    const { props } = this
    return (
      <Card className='c-calendar'>
        <DayPicker
          locale='ru'
          localeUtils={MomentLocaleUtils}
          {...props} />
      </Card>
    )
  }
}

Calendar.propTypes = {
}

Calendar.defaultProps = {
}

export default Calendar

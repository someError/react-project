import React from 'react'
import { connect } from 'react-redux'
import Button from '../Button'
import moment from 'moment-timezone'
import { injectIntl, defineMessages } from 'react-intl'
import './DoctorScheduleTimeRow.css'
import { breakTime } from '../../util'
import Template from '../Template'
import classNames from 'classnames'

const intlMessages = defineMessages({
  afternoon: {
    id: 'schedule.label.noon',
    defaultMessage: 'День'
  },
  morning: {
    id: 'schedule.label.morning',
    defaultMessage: 'Утро'
  },
  evening: {
    id: 'schedule.label.evening',
    defaultMessage: 'Вечер'
  }
})

const DoctorScheduleTimeRow = (props) => {
  const { user: { timezone }, queue } = props
  const _timezone = timezone.value / 3600
  let beforeHours = 0
  if (queue) beforeHours = queue.beforeMinimumHours || queue.beforeMinimumDays * 24
  const _nowTime = moment.tz(moment().add(beforeHours, 'hours').format('YYYY-MM-DDTHH:mm'), timezone.name)

  const timeBoxes = JSON.parse(JSON.stringify(props.timeBoxes))
  timeBoxes.sort((a, b) => {
    return moment(a.startTime).valueOf() - moment(b.startTime).valueOf()
  })
  timeBoxes.map((timeBox, i) => {
    timeBox.recordKey = i
  })
  const sortedDates = breakTime(timeBoxes)
  const { intl } = props
  return (
    <Template>
      {
        sortedDates && Object.keys(sortedDates).map((key, i) => {
          if (!sortedDates[key].length) return
          return (
            <div key={key + i} className='doctor-schedule-time'>
              <div className='doctor-schedule-time__label'>
                { intl.formatMessage(intlMessages[key])}
              </div>
              <div className='doctor-schedule-time__btn-grid'>
                {
                  sortedDates[key].map((time, i) => {
                    const _startTime = moment(time.startTime).utcOffset(_timezone).valueOf()

                    return (
                      <Button
                        key={`timeBox-${i}-${time.id}`}
                        disabled={time.status !== 'free' || _startTime < _nowTime.valueOf()}
                        className={classNames({'btn--ghost': time.id !== props.activeBox})}
                        size='xs'
                        // data-time={time}
                        onClick={(e) => {
                          e.preventDefault()
                          props.onClick(time)
                        }}
                      >
                        { moment(time.startTime).utcOffset(timezone.value / 3600).format('HH:mm') }
                      </Button>
                    )
                  })
                }
              </div>
            </div>
          )
        })
      }
    </Template>
  )
}

const mapStateToProps = ({ user }) => {
  return {
    user
  }
}

export default injectIntl(connect(mapStateToProps)(DoctorScheduleTimeRow))

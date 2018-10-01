import React from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { injectIntl, defineMessages } from 'react-intl'
import FeatherIcon from '../../../components/Icons/FeatherIcon'
import { Checkbox } from '../../../components/Form'
import './ScheduleAdd.css'

import commonIntlMessages from '../../../i18n/common-messages'

const intlMessages = defineMessages({
  scheduleSettingsTitle: {
    id: 'schedule.details.settings_title',
    defaultMessage: 'Настройки расписания'
  },
  scheduleStartEnd: {
    id: 'schedule.details.start_end',
    defaultMessage: 'Дата начала и окончания расписания'
  },
  scheduleDailyStart: {
    id: 'schedule.details.daily_start',
    defaultMessage: 'Ежедневное время начала очереди'
  },
  scheduleDailyEnd: {
    id: 'schedule.details.daily_end',
    defaultMessage: 'Ежедневное время окончания очереди'
  },
  minutesDuration: {
    id: 'schedule.minutes_duration',
    defaultMessage: '{duration} {duration, plural, one {минута} few {минуты} other {минут}}'
  },
  hoursDuration: {
    id: 'schedule.hours_duration',
    defaultMessage: '{duration} {duration, plural, one {час} few {часа} other {часов}}'
  },
  daysDuration: {
    id: 'schedule.days_duration',
    defaultMessage: '{duration} {duration, plural, one {день} few {дня} other {дней}}'
  },
  labelSelfEnroll: {
    id: 'schedule.details.self_enroll',
    defaultMessage: 'Самозапись'
  },
  labelSelfEnrollAllowed: {
    id: 'schedule.details.self_enroll_allowed',
    defaultMessage: 'Разрешена'
  },
  labelSelfEnrollBefore: {
    id: 'schedule.details.self_enroll_before',
    defaultMessage: 'Самозапись производится не позднее'
  },
  labelSelfEnrollBeforeDays: {
    id: 'schedule.details.self_enroll_before_days',
    defaultMessage: 'чем за {duration, plural, one {день} few {дня} other {дней}}'
  },
  labelSelfEnrollBeforeHours: {
    id: 'schedule.details.self_enroll_before_hours',
    defaultMessage: 'чем за {duration, plural, one {час} few {часа} other {часов}}'
  },
  labelScheduleDetailsAdvice: {
    id: 'schedule.details.advice',
    defaultMessage: 'Совет пациенту для визита'
  }
})

const ScheduleDetail = (props) => {
  const { intl } = props
  const timeTypeLabel = props.beforeMinimumDays ? 'days' : 'hours'
  const _startTime = Number(props.startTime.substring(0, 2)) +
    new Date().getTimezoneOffset() / 60 + ':' + props.startTime.substring(3, 5)
  const _endTime = Number(props.endTime.substring(0, 2)) +
    new Date().getTimezoneOffset() / 60 + ':' + props.endTime.substring(3, 5)
  return (
    <div className='l-schedule-detail'>
      <h1>{ props.title }</h1>
      <div className='l-schedule-detail__links'>
        <Link to={`/cabinet/schedule/edit/${props.id}`}><FeatherIcon icon='edit-2' color='#3A76D2' size={12} />{ intl.formatMessage(commonIntlMessages.editButton) }</Link>
        <span onClick={props.deleteQueue}><FeatherIcon icon='x' color='#FD5577' size={12} />{ intl.formatMessage(commonIntlMessages.remove) }</span>
      </div>
      <div className='form-grid'>
        <div className='columns'>
          <div className='column col-6 fw-bold'>{ intl.formatMessage(intlMessages.scheduleSettingsTitle) }</div>
        </div>
        <div className='columns'>
          <div className='column col-6 color-gray'>{ intl.formatMessage(commonIntlMessages.labelSpecialty) }</div>
          <div className='column col-6'>{ props.specialty.name }</div>
        </div>
        {/* <div className='columns'> */}
        {/* <div className='column col-6 color-gray'>Вид обслуживания</div> */}
        {/* <div className='column col-6'>{ props.serviceType.name }</div> */}
        {/* </div> */}
        <div className='columns'>
          <div className='column col-6 color-gray'>{ intl.formatMessage(intlMessages.scheduleStartEnd) }</div>
          <div className='column col-6'>{ intl.formatMessage(commonIntlMessages.prepositionFrom) } {moment(props.timeboxTimeFrom).format('DD.MM.YYYY')} { intl.formatMessage(commonIntlMessages.prepositionUntil) } {moment(props.timeboxTimeTo).format('DD.MM.YYYY')}</div>
        </div>
        <div className='columns'>
          <div className='column col-6 color-gray'>{ intl.formatMessage(intlMessages.scheduleDailyStart) }</div>
          <div className='column col-6'>{moment(props.timeboxTimeFrom).utcOffset(props.timezone).format('HH:mm')}</div>
        </div>
        <div className='columns'>
          <div className='column col-6 color-gray'>{ intl.formatMessage(intlMessages.scheduleDailyEnd) }</div>
          <div className='column col-6'>{moment(props.timeboxTimeTo).utcOffset(props.timezone).format('HH:mm')}</div>
        </div>
        <div className='columns'>
          <div className='column col-6 color-gray'>{intl.formatMessage(commonIntlMessages.labelScheduleDuration)}</div>
          <div className='column col-6'>{ intl.formatMessage(intlMessages.minutesDuration, { duration: props.duration }) }</div>
        </div>
        <div className='columns'>
          <div className='column col-6 color-gray'>{intl.formatMessage(commonIntlMessages.labelTimeoutDuration)}</div>
          <div className='column col-6'>{ intl.formatMessage(intlMessages.minutesDuration, { duration: props.wait }) }</div>
        </div>
      </div>
      <div className='form-grid'>
        <div className='columns'>
          <div className='column col-6 fw-bold'>{intl.formatMessage(commonIntlMessages.selfEnrollConditions)}</div>
        </div>
        <div className='columns'>
          <div className='column col-6 color-gray'>{ intl.formatMessage(intlMessages.labelSelfEnroll) }</div>
          <div className='column col-6'>
            <Checkbox
              checked={props.allowPatient}
              disabled
              label={intl.formatMessage(intlMessages.labelSelfEnrollAllowed)}
            />
          </div>
        </div>
        <div className='columns'>
          <div className='column col-6 color-gray'>{ intl.formatMessage(intlMessages.labelSelfEnrollBefore) }</div>
          <div className='column col-6'>
            {
              timeTypeLabel === 'days'
                ? intl.formatMessage(intlMessages.labelSelfEnrollBeforeDays, { duration: props.beforeMinimumDays })
                : intl.formatMessage(intlMessages.labelSelfEnrollBeforeHours, { duration: props.beforeMinimumHours })
            }
          </div>
        </div>
        <div className='columns'>
          <div className='column col-6 color-gray'>{ intl.formatMessage(intlMessages.labelScheduleDetailsAdvice) }</div>
          <div className='column col-6'>{ props.advice }</div>
        </div>
      </div>
    </div>
  )
}

export default injectIntl(ScheduleDetail)

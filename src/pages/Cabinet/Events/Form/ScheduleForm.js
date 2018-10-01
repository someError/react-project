import React, { Component } from 'react'
import moment from 'moment'
import linkState from 'linkstate'
import cloneDeep from 'lodash/cloneDeep'
import isEqual from 'lodash/isEqual'
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl'

import { DateInput, MaterialInput, Checkbox, Select, CheckGroup, CheckGroupButton } from '../../../../components/Form'

import { noop } from '../../../../util'
import DateTimeInput from '../../../../components/Form/DateTimeInput'

import './ScheduleForm.css'
import MonthDaysSelect from '../../../../components/Form/MonthDaysSelect'
import Template from '../../../../components/Template/index'
import AddButton from '../../../../components/Form/AddButton'

const intlMessages = defineMessages({
  hours: {
    id: 'event.repeat.hours',
    defaultMessage: `{count, plural, 
    one {час}
    few {часа}
    other {часов}
    }`
  },
  days: {
    id: 'event.repeat.days',
    defaultMessage: `{count, plural, 
    one {день}
    few {дня}
    other {дней}
    }`
  },
  weeks: {
    id: 'event.repeat.weeks',
    defaultMessage: `{count, plural, 
    one {неделю}
    few {недели}
    other {недель}
    }`
  },
  months: {
    id: 'event.repeat.months',
    defaultMessage: `{count, plural, 
    one {месяц}
    few {месяца}
    other {месяцев}
    }`
  },
  years: {
    id: 'event.repeat.years',
    defaultMessage: `{count, plural, 
    one {год}
    few {года}
    other {лет}
    }`
  },
  repeat: {
    id: 'event.label.repeat',
    defaultMessage: 'Повторять'
  },
  allDay: {
    id: 'event.label.allDay',
    defaultMessage: 'Весь день'
  },
  repeatEvent: {
    id: 'event.label.repeat_event',
    defaultMessage: 'Повторять дело'
  },
  withInterval: {
    id: 'event.label.with_interval',
    defaultMessage: 'с интервалом'
  },
  labelCustomInterval: {
    id: 'event.label.custom_interval',
    defaultMessage: 'Произвольно'
  },
  labelPrepositionOn: {
    id: 'event.label.preposition.on',
    description: 'предлог "по" в контексте "повторять по средам"',
    defaultMessage: 'по'
  },
  weekdayMon: {
    id: 'event.label.weekday.mon',
    description: 'день недели понедельник',
    defaultMessage: 'пн'
  },
  weekdayTue: {
    id: 'event.label.weekday.tue',
    description: 'день недели вторник',
    defaultMessage: 'пн'
  },
  weekdayWed: {
    id: 'event.label.weekday.wed',
    description: 'день недели среда',
    defaultMessage: 'ср'
  },
  weekdayThu: {
    id: 'event.label.weekday.thu',
    description: 'день недели четверг',
    defaultMessage: 'чт'
  },
  weekdayFri: {
    id: 'event.label.weekday.fri',
    description: 'день недели пятница',
    defaultMessage: 'пт'
  },
  weekdaySat: {
    id: 'event.label.weekday.sat',
    description: 'день недели суббота',
    defaultMessage: 'сб'
  },
  weekdaySun: {
    id: 'event.label.weekday.sun',
    description: 'день недели воскресенье',
    defaultMessage: 'вс'
  }
})

const calculateDatesByWeek = (weekDays, startDate) => {
  return weekDays.map((day) => {
    const d = moment(startDate).day(day)
    if (d.isBefore(startDate)) {
      d.day(7 + day)
    }

    return d.toDate()
  })
}

class ScheduleForm extends Component {
  constructor () {
    super()

    const startDate = moment().add(4, 'hour').startOf('hour').toDate()

    this.state = {
      startDate: startDate,
      endDate: startDate,
      disableEventTime: false,
      repeatable: false,
      schedule: {
        dates: []
      }
    }
  }

  componentWillUpdate (nextProps, nextState) {
    const { startDate, endDate } = nextState

    if (this.state.repeatable !== nextState.repeatable && !nextState.repeatable) {
      this.setState({
        schedule: {
          dates: []
        }
      })
    }

    if (nextState.startDate !== this.state.startDate) {

    }

    if (moment(endDate).isBefore(startDate)) {
      this.setState({
        endDate: startDate
      })
    }
  }

  componentDidUpdate (prevProps, nextState) {
    if (!isEqual(this.state, nextState)) {
      this.props.onChange(this.state)
    }
  }

  componentDidMount () {
    this.props.onChange(this.state)
  }

  render () {
    const { intl } = this.props

    return <div>
      <div className='schedule-date-block'>
        <div>
          <span>
            <DateTimeInput
              onChange={(date) => {
                this.setState({ startDate: moment(date).toDate() })
              }}
              value={moment(this.state.startDate).format('DD.MM.YYYY HH:mm')}
              disableTime={this.state.disableEventTime}
            />
          </span>{' '}
          {
            this.state.repeatable
              ? (
                <Template>
                  —{' '}
                  <span>
                    <DateTimeInput
                      onChange={(date) => {
                        this.setState({endDate: moment(date).toDate()})
                      }}
                      disableTime={this.state.disableEventTime}
                      value={moment(this.state.endDate).format('DD.MM.YYYY HH:mm')}
                    />
                  </span>{' '}
                </Template>
              )
              : null
          }

        </div>
        <div>
          <Checkbox
            size='sm'
            checked={this.state.disableEventTime}
            onClick={(e) => { this.setState({ disableEventTime: !this.state.disableEventTime }) }}
            label={intl.formatMessage(intlMessages.allDay)}
          /><br />
          <Checkbox
            size='sm'
            checked={this.state.repeatable}
            onClick={(e) => { this.setState({ repeatable: !this.state.repeatable }) }}
            label={intl.formatMessage(intlMessages.repeat)}
          />
        </div>
      </div>

      {
        this.state.repeatable
          ? (
            <Period
              startDate={this.state.startDate}
              endDate={this.state.endDate}
              onChange={(data) => {
                this.setState({
                  schedule: data
                })
              }}
            />
          )
          : null
      }

    </div>
  }
}

ScheduleForm.defaultProps = {
  onChange: noop
}

export default injectIntl(ScheduleForm)

const Period = injectIntl(class PeriodComp extends Component {
  constructor (props) {
    super()

    this.state = {
      type: 'day',
      repeat: 1,
      dates: [props.startDate]
    }

    // this.handleWeekDayChange = this.handleWeekDayChange.bind(this)
    this.handleDates = this.handleDates.bind(this)
  }

  // componentDidMount () {
  //   console.log(this.props)
  // }

  handleDates (dates) {
    this.setState({
      dates
    })
  }

  componentDidUpdate (prevProps, prevState) {
    if (!isEqual(this.state, prevState)) {
      this.props.onChange(this.state)
    }
  }

  componentWillUpdate (nextProps, nextState) {
    const { state } = this
    if (nextState.type !== state.type) {
      this.setState(() => {
        return {
          repeat: nextState.type === 'custom' ? '' : (nextState.repeat || 1),
          dates: [this.props.startDate]
        }
      })
    }
  }

  componentDidMount () {
    this.props.onChange(this.state)
  }

  render () {
    const { startDate, intl } = this.props
    const { type } = this.state

    // const endDateMoment = moment(endDate)

    return <div className='schedule-form_repeat-block'>
      <div className='schedule-form_repeat-block__grid'>
        <div>
          { intl.formatMessage(intlMessages.repeatEvent) } { type !== 'custom' ? intl.formatMessage(intlMessages.withInterval) : null }:{' '}

          {
            type !== 'custom'
              ? (
                <MaterialInput
                  width='50px'
                  value={this.state.repeat}
                  onBlur={() => {
                    if (!this.state.repeat) {
                      this.setState({
                        repeat: 1
                      })
                    }
                  }}
                  onChange={linkState(this, 'repeat')}
                />
              )
              : null
          }
          {' '}

          <Select
            material
            onChange={linkState(this, 'type')}
            value={type}
            className='color-blue'
          >
            {/* <option value='hour'>{ intl.formatMessage(intlMessages.hours, { count: this.state.repeat }) }</option> */}
            <option value='day'>{ intl.formatMessage(intlMessages.days, { count: this.state.repeat }) }</option>
            <option value='week'>{ intl.formatMessage(intlMessages.weeks, { count: this.state.repeat }) }</option>
            <option value='month'>{ intl.formatMessage(intlMessages.months, { count: this.state.repeat }) }</option>
            <option value='year'>{ intl.formatMessage(intlMessages.years, { count: this.state.repeat }) }</option>
            <option value='custom'>{ intl.formatMessage(intlMessages.labelCustomInterval) }</option>
          </Select>{' '}

          {
            type === 'month'
              ? (
                <MonthDaysSelect
                  selected={this.state.dates.map((date) => moment(date).date())}
                  onChange={(days) => {
                    const dates = days.map((d) => {
                      const date = moment(startDate)
                      const lastMonthDate = moment(date).endOf('month').date()

                      if (lastMonthDate < d) {
                        date.add(1, 'month').startOf('month')
                      }

                      date.date(d)
                      date.startOf('hour')

                      if (date.isBefore(startDate, 'days')) {
                        date.add(1, 'month')
                      }

                      return date.toDate()
                    })

                    this.setState({
                      dates
                    })
                  }}
                />
              )
              : null
          }
        </div>
      </div>
      <div>
        {
          type === 'week'
            ? (
              <span>
                { intl.formatMessage(intlMessages.labelPrepositionOn) }{' '}
                <CheckGroup
                  valueOnEmpty={moment(startDate).day()}
                  onChange={(days) => {
                    this.setState({ dates: calculateDatesByWeek(days, startDate) })
                  }}
                >
                  <CheckGroupButton value={1}>{ intl.formatMessage(intlMessages.weekdayMon) }</CheckGroupButton>
                  <CheckGroupButton value={2}>{ intl.formatMessage(intlMessages.weekdayTue) }</CheckGroupButton>
                  <CheckGroupButton value={3}>{ intl.formatMessage(intlMessages.weekdayWed) }</CheckGroupButton>
                  <CheckGroupButton value={4}>{ intl.formatMessage(intlMessages.weekdayThu) }</CheckGroupButton>
                  <CheckGroupButton value={5}>{ intl.formatMessage(intlMessages.weekdayFri) }</CheckGroupButton>
                  <CheckGroupButton value={6}>{ intl.formatMessage(intlMessages.weekdaySat) }</CheckGroupButton>
                  <CheckGroupButton value={7}>{ intl.formatMessage(intlMessages.weekdaySun) }</CheckGroupButton>
                </CheckGroup>
              </span>
            )
            : null
        }

        {
          type === 'year'
            ? <MonthDates startDate={this.props.startDate} onChange={this.handleDates} />
            : null
        }

        {
          type === 'custom'
            ? <CustomDates key='custom-dates' dates={this.state.dates} onChange={this.handleDates} />
            : null
        }
      </div>
    </div>
  }
})

class MonthDates extends Component {
  constructor (props) {
    super()

    this.state = {
      dates: [props.startDate]
    }

    this.handleDayChange = this.handleDayChange.bind(this)
  }

  addDate () {
    const dates = cloneDeep(this.state.dates)

    dates.push(new Date())

    this.setState({
      dates
    })
  }

  componentDidUpdate (prevProps, prevState) {
    if (!isEqual(prevState.dates, this.state.dates)) {
      this.props.onChange(this.state.dates)
    }
  }

  handleDayChange (selectedDay, i) {
    const d = moment(selectedDay)
    if (d.isBefore(this.props.startDate)) {
      d.add(1, 'year')
    }

    const dates = cloneDeep(this.state.dates)

    dates[i] = d.toDate()

    this.setState({
      dates
    })
  }

  render () {
    return <div className='additional-dates'>
      {
        this.state.dates.map((date, i) => {
          return <div key={date.toString() + i}>
            <DateInput
              value={moment(date).format('DD MMMM')}
              format={'DD MMMM'}
              dayPickerProps={{
                enableOutsideDays: false,
                fromMonth: moment().month(0).toDate(),
                toMonth: moment().month(11).toDate(),
                captionElement: ({ date, localeUtils, onChange }) => <div className='DayPicker-Caption'>{ moment(date).format('MMMM') }</div>,
                weekdayElement: () => <span dangerouslySetInnerHTML={{__html: '&nbsp;'}} />
              }}
              onDayChange={(date) => { this.handleDayChange(date, i) }}
            />
          </div>
        })
      }

      <div>
        <AddButton onClick={() => { this.addDate() }}>добавить дату</AddButton>
      </div>
    </div>
  }
}

class CustomDates extends Component {
  constructor (props) {
    super()

    this.state = {
      dates: props.dates || []
    }
  }

  addDate () {
    const dates = [].concat(this.state.dates, [new Date()])

    this.setState({
      dates
    })
  }

  componentDidUpdate (prevProps, prevState) {
    if (!isEqual(prevState.dates, this.state.dates)) {
      this.props.onChange(this.state.dates)
    }
  }

  handleDayChange (selectedDay, i) {
    const d = moment(selectedDay)
    if (d.isBefore(this.props.startDate)) {
      d.add(1, 'year')
    }

    const dates = cloneDeep(this.state.dates)

    dates[i] = d.toDate()

    this.setState({
      dates
    })
  }

  render () {
    return <div className='additional-dates'>
      {
        this.state.dates.map((date, i) => {
          return <div key={`${date.toString()}=${i}`}>
            <DateTimeInput
              value={moment(date).format('DD.MM.YYYY HH:mm')}
              onChange={(date) => { this.handleDayChange(date, i) }}
            />
          </div>
        })
      }
      <div>
        <AddButton onClick={() => { this.addDate() }}><FormattedMessage id='event.add_datetime' defaultMessage='Добавить дату и время' /></AddButton>
      </div>
    </div>
  }
}

CustomDates.defaultProps = {
  dates: [],
  onChange: noop
}

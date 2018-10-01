import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import classNames from 'classnames'
import DayPicker from 'react-day-picker'
import MomentLocaleUtils from 'react-day-picker/moment'
import qs from 'qs'
import { Link } from 'react-router-dom'
import cloneDeep from 'lodash/cloneDeep'
import { injectIntl, defineMessages } from 'react-intl'

import Card from '../../../components/Card/Card'

import './Calendar.css'

import api from '../../../api'
import { parseSearchString, mergeFilters, capitalize } from '../../../util'
import { Spinner } from '../../../components/Loader'
import { Tile } from '../../../components/Tile'
import TileContent from '../../../components/Tile/TileContent'
import TileAction from '../../../components/Tile/TileAction'
import FeatherIcon from '../../../components/Icons/FeatherIcon'
import Button from '../../../components/Button/index'
import CalendarEventPopover from '../../../components/CalendarEventPopover'
import Template from '../../../components/Template'
import MediaQuery from '../../../components/MediaQuery'
import { showAddModal } from '../../../redux/modals/actions'

import commonIntlMessages from '../../../i18n/common-messages'

const intlMessages = defineMessages({
  legendMedications: {
    id: 'calendar.legend.medications',
    defaultMessage: 'Приём лекарств'
  },
  legendReception: {
    id: 'calendar.legend.reception',
    defaultMessage: 'Запись на приём'
  },
  legendParams: {
    id: 'calendar.legend.params',
    defaultMessage: 'Измерение показателей'
  },
  legendCustom: {
    id: 'calendar.legend.custom',
    defaultMessage: 'Свои дела'
  },
  calendarTitle: {
    id: 'calendar.page_title',
    defaultMessage: 'Календарь событий'
  }
})

const getMonthFilter = (month) => {
  const monthMoment = month ? moment.utc(month, 'YYYY-MM') : moment.utc()

  return {
    startTime: [
      {
        value: monthMoment.clone().startOf('month').format(),
        type: 'gt'
      },
      {
        value: monthMoment.clone().endOf('month').format(),
        type: 'lt'
      }
    ]
  }
}

class EventsCalendar extends Component {
  constructor () {
    super()

    this.state = {
      items: {},
      loading: true,
      disablePopovers: false,
      mobileEvents: null,
      useXsButtons: false
    }

    this.renderDay = this.renderDay.bind(this)
  }

  getEventsByDay (day) {
    return this.state.items[moment.utc(day).format('YYYY-MM-DD')]
  }

  renderDay (day) {
    const date = day.getDate()
    const events = this.getEventsByDay(day)

    return <div className='events-calendar__cell'>
      <div className='events-calendar__day'>{ date }</div>
      <div className='events-calendar__events'>
        {
          (events || []).map((event) => {
            const markClassName = classNames('event-color-mark event-color-code event-color-code--bg', {
              'event-color-code--medications': !!event.eventGroup.medicalSection && event.eventGroup.medicalSection.recordDrug,
              'event-color-code--measurements': !!event.eventGroup.medicalSection && event.eventGroup.medicalSection.recordPersonalDiary
            })

            return <Template key={event.id}>
              <CalendarEventPopover
                onRemoved={() => { this.removeEvent(event.startTime, event.id) }}
                disabled={this.state.disablePopovers}
                event={event}
              >
                <div className='calendar-cell-event'><span className={markClassName} />{ moment(event.startTime).format('HH:mm') }</div>
              </CalendarEventPopover><br />
            </Template>
          })
        }
      </div>
    </div>
  }

  itemsToDateHash (items = []) {
    return items.reduce((res, event) => {
      const key = moment(event.startTime).format('YYYY-MM-DD')
      if (!res[key]) {
        res[key] = []
      }

      res[key].push(event)

      return res
    }, {})
  }

  removeEvent (date, id) {
    const hash = moment(date).format('YYYY-MM-DD')
    const items = cloneDeep(this.state.items)

    items[hash] = items[hash].filter((d) => {
      return d.id !== id
    })

    this.setState({
      items
    })
  }

  getMonthEvents (month) {
    this.setState({
      loading: true,
      mobileEvents: null
    })

    this.req = api.getEvents(qs.stringify({
      filter: mergeFilters({}, getMonthFilter(month)),
      limit: 500,
      patient: this.props.patientId
    }))

    this.req
      .then(({ data: { data } }) => {
        this.setState({
          items: this.itemsToDateHash(data.items),
          loading: false
        })
      })
  }

  getMonthParam () {
    return parseSearchString(this.props.location.search).month
  }

  componentDidMount () {
    this.getMonthEvents(this.getMonthParam())
  }

  componentDidUpdate (prevProps) {
    if (prevProps.location !== this.props.location) {
      this.getMonthEvents(this.getMonthParam())
    }
  }

  componentWillUnmount () {
    if (this.req) {
      this.req.cancel()
    }
  }

  render () {
    const { history, location, patientId, user, intl } = this.props
    const month = moment(parseSearchString(location.search).month || new Date()).toDate()

    const prevMoment = moment(month).subtract(1, 'month')
    const nextMoment = moment(month).add(1, 'month')

    const legend = <div className='events-calendar-legend'>
      <span>
        <span className='event-color-mark event-color-legend event-color-code--bg event-color-code--medications' />{ intl.formatMessage(intlMessages.legendMedications) }
      </span>
      <span>
        <span className='event-color-mark event-color-legend event-color-code--bg event-color-code--schedule' />{ intl.formatMessage(intlMessages.legendReception) }
      </span>
      <span>
        <span className='event-color-mark event-color-legend event-color-code--bg event-color-code--measurements' />{ intl.formatMessage(intlMessages.legendParams) }
      </span>
      <span>
        <span className='event-color-mark event-color-legend event-color-code--bg event-color-code' />{ intl.formatMessage(intlMessages.legendCustom) }
      </span>
    </div>

    return <div>
      <MediaQuery
        rule='(max-width: 655px)'
        onChange={(matches) => {
          this.setState({
            disablePopovers: matches,
            useXsButtons: matches,
            mobileEvents: null,
            isMobile: !matches
          })
        }}
      />

      <div className='page-header'>
        <h1>{ intl.formatMessage(intlMessages.calendarTitle) } <span className='calendar-add-buttons'><Button onClick={() => { this.props.showAddModal(patientId) }} fill={this.state.useXsButtons} size={this.state.useXsButtons ? 'xs' : 'sm'}>{ intl.formatMessage(commonIntlMessages.addEventBtn) }</Button> <Button to={`/cabinet${user.entity_type === 'doctor' ? '/patients/5df40457-418c-4877-92e6-f3bd873de8b3' : ''}/events/taskslines`} fill={this.state.useXsButtons} size={this.state.useXsButtons ? 'xs' : 'sm'} ghost>{ intl.formatMessage(commonIntlMessages.tasksLinesAdd) }</Button></span></h1>
      </div>

      <div className='events-calendar-header'>
        <Tile
          centered
        >
          <TileContent>
            <div className='events-calendar-nav'>
              <span>
                <Link to={{search: `month=${prevMoment.format('YYYY-MM')}`}}><FeatherIcon size={30} icon='arrow-left' />{capitalize(prevMoment.format('MMMM'))}</Link>{' '}
              </span>{' '}
              <span>
                <span className='events-calendar-nav__current'>{capitalize(moment(month).format('MMMM'))}</span>
              </span>{' '}
              <span>
                <Link to={{search: `month=${nextMoment.format('YYYY-MM')}`}}>{capitalize(nextMoment.format('MMMM'))}<FeatherIcon size={30} icon='arrow-right' /></Link>
              </span>
            </div>
          </TileContent>
          <TileAction>
            <MediaQuery rule='(min-width: 1221px)'>{ legend }</MediaQuery>
          </TileAction>
        </Tile>
      </div>

      {
        this.state.loading
          ? <Spinner />
          : <Template>
            <Card>
              <DayPicker
                locale='ru'
                localeUtils={MomentLocaleUtils}
                month={month}
                modifiers={{
                  past: { before: new Date() }
                }}
                enableOutsideDays={false}
                className='events-calendar'
                renderDay={this.renderDay}
                onMonthChange={(date) => {
                  history.push({
                    path: location.path,
                    search: `month=${moment.utc(date).format('YYYY-MM')}`
                  })
                }}
                navbarElement={() => null}
                captionElement={() => null}
                selectedDays={this.state.mobileEvents ? moment.utc(this.state.mobileEvents[0].startTime).startOf('day').toDate() : null}
                onDayClick={(day) => {
                  if (this.state.isMobile) {
                    return
                  }

                  const dayEvents = this.getEventsByDay(day)

                  if (dayEvents) {
                    this.setState({
                      mobileEvents: dayEvents
                    })
                  }
                }}
              />
              <MediaQuery rule='(max-width: 655px)'>
                {
                  this.state.mobileEvents
                    ? <div className='mobile-events-list'>
                      <table>
                        <tbody>
                          {
                            this.state.mobileEvents
                              .map((event) => <tr key={event.id}>
                                <td className={classNames('event-color-code', {
                                  'event-color-code--schedule': false,
                                  'event-color-code--medications': !!event.medicalSection && event.medicalSection.recordDrug,
                                  'event-color-code--measurements': !!event.medicalSection && event.medicalSection.recordPersonalDiary
                                })}>{ moment(event.startTime).format('HH:mm') }</td>
                                <td>{ event.eventGroup.title }</td>
                              </tr>)
                          }
                        </tbody>
                      </table>
                    </div>
                    : null
                }
              </MediaQuery>
            </Card>
            <MediaQuery rule='(max-width: 1220px)'><div className='events-calendar-legend--bottom'>{ legend }</div></MediaQuery>
          </Template>
      }
    </div>
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    showAddModal: function (patientId) {
      dispatch(showAddModal(null, 3, patientId))
    }
  }
}

export default injectIntl(connect(({ user }) => ({ user }), mapDispatchToProps)(EventsCalendar))

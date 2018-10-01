import React, { Component } from 'react'
import PropTypes from 'prop-types'
import qs from 'qs'
import moment from 'moment'
import { injectIntl } from 'react-intl'

import Collapsible from '../../../components/Collapsible'
import { Card } from '../../../components/Card'
import { Checkbox, MaterialInput } from '../../../components/Form'
import { parseSearchString, mergeFilters } from '../../../util'
import Template from '../../../components/Template'
import Calendar from '../../../components/Calendar'

import commonIntlMessages from '../../../i18n/common-messages'

class Filters extends Component {
  constructor () {
    super()
    this.state = {
      calendarDay: new Date(),
      statuses: []
    }
  }

  componentWillReceiveProps (nextProps) {
    if (!(nextProps.location.search === this.props.location.search)) {
      const _search = parseSearchString(nextProps.location.search)
      const _curDate = _search && _search.filter && _search.filter.date
      this.setState({calendarDay: moment(_curDate || new Date()).toDate()})
    }
  }

  componentWillMount () {
    const _search = parseSearchString(this.props.location.search)
    const _curDate = _search && _search.filter && _search.filter.date
    this.setState({calendarDay: moment(_curDate || new Date()).toDate()})
    if (_search.statuses) {
      this.setState({statuses: _search.statuses})
    }
  }

  render () {
    const { state } = this
    const { location, disableCollapsible, activeCollapsible, intl } = this.props
    const query = parseSearchString(location.search)

    const filter = query.filter || {}

    return <Template>
      <Calendar
        selectedDays={state.calendarDay}
        initialMonth={state.calendarDay || new Date()}
        onDayClick={(date) => {
          this.props.history.push({
            search: qs.stringify({
              ...query,
              filter: mergeFilters(filter, {
                date: moment(date).format()
              })
            })
          })
        }}
      />
      <Card>
        <div className='filter-header'>
          { intl.formatMessage(commonIntlMessages.recordsFilter) }
        </div>
        <Collapsible
          touchOpened
          className='filter-collapsible'
          triggerClassName='filter-collapsible-trigger'
          title={intl.formatMessage(commonIntlMessages.labelType)}
          disabled={disableCollapsible}
          active={query.my || query.org || activeCollapsible}
        >
          <ul className='filters-list'>
            <li><Checkbox
              label={intl.formatMessage(commonIntlMessages.labelMyRecords)}
              onChange={(e) => {
                this.props.history.push({
                  search: qs.stringify({
                    ...query,
                    my: query.my !== 'true'
                  })
                })
              }}
              checked={query.my === 'true'}
            /></li>
            <li><Checkbox
              label={intl.formatMessage(commonIntlMessages.labelOrgsRecords)}
              onChange={(e) => {
                this.props.history.push({
                  search: qs.stringify({
                    ...query,
                    organizations: query.organizations !== 'true'
                  })
                })
              }}
              checked={query.organizations === 'true'}
            /></li>
          </ul>
        </Collapsible>

        <Collapsible
          touchOpened
          className='filter-collapsible'
          triggerClassName='filter-collapsible-trigger'
          title={intl.formatMessage(commonIntlMessages.labelCellStatus)}
          disabled={disableCollapsible}
          active={query.statuses || activeCollapsible}
        >
          <ul className='filters-list'>
            <li>
              <Checkbox
                onChange={(e) => {
                  if (!query.statuses) query.statuses = []
                  if (query.statuses.indexOf('free') + 1) {
                    query.statuses.splice(query.statuses.indexOf('free'), 1)
                  } else {
                    query.statuses.push('free')
                  }
                  this.setState({statuses: query.statuses})
                  this.props.history.push({
                    search: qs.stringify(query)
                  })
                }}
                checked={state.statuses.indexOf('free') + 1}
                label={intl.formatMessage(commonIntlMessages.labelFree)}
              />
            </li>
            <li>
              <Checkbox
                onChange={(e) => {
                  if (!query.statuses) query.statuses = []
                  if (query.statuses.indexOf('not_confirmed') + 1) {
                    query.statuses.splice(query.statuses.indexOf('not_confirmed'), 1)
                  } else {
                    query.statuses.push('not_confirmed')
                  }
                  this.setState({statuses: query.statuses})
                  this.props.history.push({
                    search: qs.stringify(query)
                  })
                }}
                checked={state.statuses.indexOf('not_confirmed') + 1}
                label={intl.formatMessage(commonIntlMessages.labelVisitNotConfirmed)}
              />
            </li>
          </ul>
        </Collapsible>
        <Collapsible
          touchOpened
          className='filter-collapsible'
          triggerClassName='filter-collapsible-trigger'
          title={intl.formatMessage(commonIntlMessages.labelPatient)}
          disabled={disableCollapsible}
          active={query.patient || activeCollapsible}
        >
          <ul className='filters-list'>
            <li>
              <MaterialInput
                label={intl.formatMessage(commonIntlMessages.labelPatientFio)}
                value={location.search && query.patient}
                onChange={(e) => {
                  if (!e.target.value) delete query.patient
                  this.props.history.push({
                    search: qs.stringify({
                      ...query,
                      patient: e.target.value
                    })
                  })
                }}
              />
            </li>
          </ul>
        </Collapsible>
      </Card>
    </Template>
  }
}

Filters.propTypes = {
  disableCollapsible: PropTypes.bool,
  activeCollapsible: PropTypes.bool
}

Filters.defaultProps = {
  disableCollapsible: false,
  activeCollapsible: false
}

export default injectIntl(Filters)

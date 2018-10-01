import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Route, Link } from 'react-router-dom'
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl'
import Chart from './Chart'
import List from './List'
import moment from 'moment'
import classNames from 'classnames'

import qs from 'qs'

import { Tile, TileContent, TileAction } from '../../../components/Tile'

import './Monitoring.css'
import { parseSearchString, mergeFilters, getFilterValue } from '../../../util'
import Spinner from '../../../components/Loader/Spinner'
import RadioGroup, { RadioGroupButton } from '../../../components/Form/RadioGroup'

const intlMessages = defineMessages({
  displayChart: {
    id: 'monitoring.display.chart',
    defaultMessage: 'Графиком'
  },
  displayTable: {
    id: 'monitoring.display.table',
    defaultMessage: 'Списком'
  }
})

class Monitoring extends Component {
  render () {
    const { props } = this

    const search = parseSearchString(props.location.search)

    const today = moment().startOf('day')

    const dateStartFilter = moment.utc(getFilterValue(search.filter, 'recordDate', 'gt'))

    const weekMoment = moment(today).utc().subtract(1, 'week')
    const monthMoment = moment(today).utc().subtract(1, 'month')
    const quarterMoment = moment(today).utc().subtract(1, 'Q')
    const yearMoment = moment(today).utc().subtract(1, 'year')

    const { intl } = props

    return <div>
      <div className='page-header'>
        <h1><FormattedMessage id='monitoring.header' defaultMessage='Мониторинг показателей' /></h1>
      </div>

      <div className='sort-menu'>
        <Tile centered>
          <TileContent>
            <FormattedMessage id='monitoring.label.display' defaultMessage='Отобразить данные' />: <RadioGroup onChange={(e) => { props.history.push(e.target.value) }}><RadioGroupButton checked={props.location.pathname === '/cabinet/monitoring'} value='/cabinet/monitoring' label={intl.formatMessage(intlMessages.displayChart)} /><RadioGroupButton checked={props.location.pathname === '/cabinet/monitoring/list'} value='/cabinet/monitoring/list' label={intl.formatMessage(intlMessages.displayTable)} /></RadioGroup>
          </TileContent>
          <TileAction>
            <FormattedMessage id='monitoring.label.show' defaultMessage='Показать данные за' />:{' '}
            <Link className={classNames('color-blue', { active: dateStartFilter.diff(weekMoment) === 0 })} to={{ path: `${props.location.pathname}`, search: qs.stringify({ ...search, filter: mergeFilters(search.filter, { recordDate: [{ type: 'gt', value: weekMoment.format() }] }) }) }}><FormattedMessage id='monitoring.filter.week' defaultMessage='неделю' /></Link>{' '}
            <Link className={classNames('color-blue', { active: dateStartFilter.diff(monthMoment) === 0 })} to={{ path: `${props.location.pathname}`, search: qs.stringify({ ...search, filter: mergeFilters(search.filter, { recordDate: [{ type: 'gt', value: monthMoment.format() }] }) }) }}><FormattedMessage id='monitoring.filter.month' defaultMessage='месяц' /></Link>{' '}
            <Link className={classNames('color-blue', { active: dateStartFilter.diff(quarterMoment) === 0 })} to={{ path: `${props.location.pathname}`, search: qs.stringify({ ...search, filter: mergeFilters(search.filter, { recordDate: [{ type: 'gt', value: quarterMoment.format() }] }) }) }}><FormattedMessage id='monitoring.filter.quoter' defaultMessage='квартал' /></Link>{' '}
            <Link className={classNames('color-blue', { active: dateStartFilter.diff(yearMoment) === 0 })} to={{ path: `${props.location.pathname}`, search: qs.stringify({ ...search, filter: mergeFilters(search.filter, { recordDate: [{ type: 'gt', value: yearMoment.format() }] }) }) }}><FormattedMessage id='monitoring.filter.year' defaultMessage='год' /></Link>{' '}
          </TileAction>
        </Tile>
      </div>

      <div className='monitoring-container'>
        <Route exact path={`${props.match.url}`} render={(pr) => !props.parameters || !props.parameters.length ? <Spinner /> : <Chart patientId={props.user.id} cardId={props.user.card.id} {...pr} />} />
        <Route exact path={`${props.match.url}/list`} render={(pr) => <List patientId={props.user.id} cardId={props.user.card.id} {...pr} />} />
      </div>
    </div>
  }
}

const mapStateToProps = ({ reference, user }) => {
  return {
    user,
    parameters: reference.parameters
  }
}

export default injectIntl(connect(mapStateToProps)(Monitoring))

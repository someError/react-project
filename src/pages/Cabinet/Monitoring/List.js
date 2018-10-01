import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import moment from 'moment'
import qs from 'qs'
import Spinner from '../../../components/Loader/Spinner'
import { getFilterValue, mergeFilters, parseSearchString } from '../../../util'
import api from '../../../api'
import Table from '../../../components/Table'
import groupBy from 'lodash/groupBy'
import map from 'lodash/map'

import './List.css'

class List extends Component {
  constructor () {
    super()

    this.state = {
      loading: true,
      data: []
    }
  }

  fetchData (params) {
    if (this.req) {
      this.req.cancel()
    }

    this.setState({
      loading: true
    })

    const { filter } = params

    if (!filter || !getFilterValue(filter, 'recordDate', 'gt')) {
      params.filter = mergeFilters(filter, { recordDate: [{ type: 'gt', value: moment.utc().startOf('day').subtract(1, 'month').format() }] })
    }

    this.req = api.getMonitoringData(this.props.cardId, qs.stringify(params))

    this.req.then(({ data: { data } }) => {
      this.setState({
        loading: false,
        data: groupBy(data, (d) => moment.utc(d.recordDate).format('DD.MM.YYYY'))
        // data
      })
    })
  }

  componentDidMount () {
    const query = parseSearchString(this.props.location.search)

    this.fetchData(query)
  }

  componentDidUpdate (prevProps) {
    if (this.props.location.search !== prevProps.location.search) {
      const query = parseSearchString(this.props.location.search)

      this.fetchData(query)
    }
  }

  render () {
    if (this.state.loading) {
      return <Spinner />
    }

    if (!this.state.data || !Object.keys(this.state.data).length) {
      return <div style={{ padding: '1.25rem' }}><FormattedMessage id='monitoring.table.no_data' defaultMessage='Нет данных' /></div>
    }

    return <Table>
      <thead>
        <tr>
          <th><FormattedMessage id='monitoring.table.head.date' defaultMessage='Дата' /></th>
          <th><FormattedMessage id='monitoring.table.param' defaultMessage='Параметр' /></th>
          <th><FormattedMessage id='monitoring.table.head.param' defaultMessage='Значение' /></th>
          <th><FormattedMessage id='monitoring.table.head.norm' defaultMessage='Норма, от — до' /></th>
          <th><FormattedMessage id='monitoring.table.head.note' defaultMessage='Примечание' /></th>
        </tr>
      </thead>
      {
        map(
          this.state.data,
          (dataset, day) => {
            return <tbody key={day} className='measurements-list-body'>
              <tr>
                <td rowSpan={dataset.length}>{day}</td>
                <td>{dataset[0].measurement.parameter.name}</td>
                <td>{dataset[0].measurement.value} {dataset[0].measurement.unit.name}</td>
                <td>{[dataset[0].measurement.normalValueFrom, dataset[0].measurement.normalValueTo].join(' – ')}</td>
                <td>{dataset[0].measurement.comment}</td>
              </tr>
              {
                [].concat(dataset).splice(1).map(({ measurement }, i) => {
                  return <tr key={`${measurement.id}-${i}`}>
                    <td>{measurement.parameter.name}</td>
                    <td>{measurement.value} {measurement.unit.name}</td>
                    <td>{[measurement.normalValueFrom, measurement.normalValueTo].join(' – ')}</td>
                    <td>{measurement.comment}</td>
                  </tr>
                })
              }
            </tbody>
          }
        )
      }
    </Table>
  }
}

export default List

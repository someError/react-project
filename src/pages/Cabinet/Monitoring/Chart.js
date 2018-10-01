import React, { Component } from 'react'
import { connect } from 'react-redux'
import chroma from 'chroma-js'
import { Link } from 'react-router-dom'
import qs from 'qs'
import classNames from 'classnames'
import groupBy from 'lodash/groupBy'
import cloneDeep from 'lodash/cloneDeep'
import { injectIntl, defineMessages } from 'react-intl'

import moment from 'moment'

import { Tile, TileIcon, TileAction } from '../../../components/Tile'
import TileContent from '../../../components/Tile/TileContent'
import FeatherIcon from '../../../components/Icons/FeatherIcon'
import api from '../../../api'
import MonitoringChart from '../../../components/Chart/MonitoringChart'
import { Spinner, OverlaySpinner } from '../../../components/Loader'
import { getFilterValue, mergeFilters, parseSearchString } from '../../../util'

const intlMessages = defineMessages({
  chooseParamsNote: {
    id: 'monitoring.choose_paras_note',
    defaultMessage: 'Выберите показатели для отображения на графике (не более 3-х)'
  }
})

const generateColorScale = (count) => {
  return chroma.scale([
    '#C06AF8',
    '#B9C7D5',
    '#FBBA40',
    '#03A0E2',
    '#437CFB',
    '#026EC9',
    '#72D753',
    '#55C894',
    '#008B5B',
    '#E91034',
    '#33CCCC',
    '#3366FF',
    '#CC66CC',
    '#E30000'
  ]).colors(count)
}

const dataWithStyle = (color, label, data) => {
  return {
    label,
    data,
    backgroundColor: color,
    borderColor: color,
    pointBorderWidth: 3,
    radius: 6,
    pointHoverRadius: 6,
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#344758',
    pointHoverBorderColor: 'transparent',

    fill: false
  }
}

const reformatEventsData = (arr) => {
  return arr.map((item) => {
    console.log(item)
    return {
      x: moment.utc(item.startTime),
      y: moment.utc(item.startTime).diff(moment(item.startTime).startOf('day'), 'hours', true),
      id: item.id,
      title: item.eventGroup.title
    }
  })
}

const responseToData = (data = []) => {
  const groups = groupBy(data, (d) => d.measurement.parameter.id)

  const res = []

  for (let k in groups) {
    if (groups.hasOwnProperty(k)) {
      res.push(
        groups[k].map((d) => {
          return {
            x: moment(d.recordDate).utc().toDate(),
            y: Number((d.measurement.value || '').replace(/,/img, '.')),
            unit: d.measurement.unit.name,
            name: d.measurement.parameter.name,
            paramId: d.measurement.parameter.id
          }
        })
      )
    }
  }

  return res
}

class MonitoringChartPage extends Component {
  constructor () {
    super()

    this.state = {
      measuresData: [],
      eventsData: [],
      colors: {}
    }
  }

  fetchData (params) {
    if (this.req) {
      this.req.cancel()
    }

    this.setState({
      loadingData: true
    })

    const { filter } = params

    if (!filter || !getFilterValue(filter, 'recordDate', 'gt')) {
      params.filter = mergeFilters(filter, { recordDate: [{ type: 'gt', value: moment.utc().startOf('day').subtract(1, 'month').format() }] })
    }

    this.req = api.getMonitoringData(this.props.cardId, qs.stringify(params))

    this.req.then(({ data: { data } }) => {
      this.setState({
        loadingData: false,
        measuresData: responseToData(data).map((dataset, i) => {
          return dataWithStyle(this.state.colors[dataset[0].paramId], dataset.name, dataset)
        })
      })
    })
  }

  fetchEvents (params) {
    this.setState({
      loadingEvents: true
    })

    const { filter } = params

    if (!filter || !getFilterValue(filter, 'recordDate', 'gt')) {
      params.filter = mergeFilters(filter, { recordDate: [{ type: 'gt', value: moment.utc().startOf('day').subtract(1, 'month').format() }] })
    }

    params.patient = this.props.patientId
    params.limit = 9999

    this.eventsReq = api.getEvents(qs.stringify(params))

    this.eventsReq
      .then(({ data: { data } }) => {
        this.setState({
          loadingEvents: false,
          eventsData: [{
            radius: 3,
            pointHoverRadius: 3,
            borderColor: '#BC36FF',
            pointBackgroundColor: '#BC36FF',
            pointHoverBackgroundColor: '#BC36FF',
            pointHoverBorderWidth: 0,
            data: reformatEventsData(data.items),
            events: data.items
          }]
        })
      })
  }

  generateColors () {
    const { parameters } = this.props

    const scale = generateColorScale(parameters.length)

    this.setState({
      colors: parameters.reduce((res, p, i) => {
        res[p.id] = scale[i]
        return res
      }, {})
    })
  }

  componentWillUpdate (nextProps) {
    if (this.props.location !== nextProps.location) {
      const query = parseSearchString(nextProps.location.search)

      if (query.parameters && query.parameters.length > 0) {
        this.fetchData(query)
        this.fetchEvents(query)
      } else {
        this.setState({
          measuresData: [],
          eventsData: []
        })
      }
    }
  }

  componentDidMount () {
    const params = parseSearchString(this.props.location.search)

    const parameters = cloneDeep(this.props.parameters || []).splice(0, 2)

    if (!params.parameters || !params.parameters.length) {
      this.props.history.replace({
        search: qs.stringify({parameters: parameters.map((p) => p.id)})
      })
    }

    this.generateColors()

    if (params.parameters && params.parameters.length > 0) {
      this.fetchData(params)
      this.fetchEvents(params)
    }
  }

  render () {
    const { props } = this

    if (!props.parameters || !props.parameters.length) {
      return <Spinner />
    }

    const { intl } = props

    const params = props.parameters

    const colors = this.state.colors

    const queryParams = parseSearchString(props.location.search)

    queryParams.parameters = queryParams.parameters || []

    return <div>
      <div className='chart-settings'>
        <div><b>{ intl.formatMessage(intlMessages.chooseParamsNote) }</b></div>

        <ul className='chart-settings__params-list'>
          {
            params.map((param, i) => {
              const isActive = !!queryParams.parameters.find((p) => p === param.id)

              let search = {
                ...queryParams
              }

              if (isActive) {
                search = {
                  ...search,
                  parameters: queryParams.parameters.filter((p) => p !== param.id)
                }
              } else {
                search = {
                  ...search,
                  parameters: [].concat(queryParams.parameters, param.id)
                }
              }

              const isDisabled = queryParams.parameters.length === 3 && !isActive

              const Component = isDisabled ? 'span' : Link

              return <li key={param.id}>
                <Component
                  className={classNames('param-badge', {active: isActive, disabled: isDisabled})}
                  to={{path: props.pathname, search: qs.stringify(search)}}
                >
                  <Tile centered>
                    <TileIcon>
                      <span className='param-badge__color' style={{ backgroundColor: colors[param.id] }} />
                    </TileIcon>
                    <TileContent>
                      { param.name }
                    </TileContent>
                    {
                      isActive
                        ? <TileAction>
                          <FeatherIcon icon='x' size={18} color='#908C84' />
                        </TileAction>
                        : null
                    }
                  </Tile>
                </Component>
              </li>
            })
          }
        </ul>
      </div>

      <div style={{position: 'relative'}}>
        { this.state.loadingData && <OverlaySpinner /> }
        <MonitoringChart
          measuresDatasets={this.state.measuresData}
          eventsDatasets={this.state.eventsData}
        />
      </div>
    </div>
  }
}

const mapStateToProps = ({ reference }) => {
  return {
    parameters: reference.parameters
  }
}

export default injectIntl(connect(mapStateToProps)(MonitoringChartPage))

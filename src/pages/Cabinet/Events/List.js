import React, { Component } from 'react'
import cloneDeep from 'lodash/cloneDeep'
import { Helmet } from 'react-helmet'
import qs from 'qs'
import { injectIntl } from 'react-intl'

import api from '../../../api'
import EventCard from './EntityViews/EventCard'
import { parseSearchString } from '../../../util'

import QuickForm from '../Add/QuickForm'
import Spinner from '../../../components/Loader/Spinner'
import InViewObserver from '../../../components/Inview/InViewObserver'

import commonIntlMessages from '../../../i18n/common-messages'

class List extends Component {
  constructor () {
    super()

    this.state = {
      items: [],
      loading: false,
      pulling: false
    }
  }

  invalidate () {
    this.setState({
      items: []
    })
  }

  replaceItem (i, data) {
    const items = cloneDeep(this.state.items)

    items.splice(i, 1, data)

    this.setState({
      items
    })
  }

  removeEvent (id) {
    const items = cloneDeep(this.state.items)

    const removeIndex = items.findIndex((r) => r.id === id)

    if (removeIndex > -1) {
      items.splice(removeIndex, 1)

      this.setState({
        items
      })
    }
  }

  getEvents (params, reason = 'loading') {
    const { eventsGroupId } = this.props.match.params

    if (!eventsGroupId) {
      this.req = api.getEventsTimeline(qs.stringify({...params, patient: this.props.patientId, direction: 'desc'}))
    } else {
      this.req = api.getEventsByGroup(eventsGroupId, qs.stringify({...params, patient: this.props.patientId, direction: 'desc'}))
    }

    this.setState({
      [reason]: true
    })

    this.req
      .then(({ data: { data } }) => {
        return {
          ...data,
          items: data.items.map((item) => item[0] || item)
        }
      })
      .then((data) => {
        this.reqMeta = data.meta
        this.setState({
          items: this.state.items.concat(data.items),
          [reason]: false,
          hasNext: data.meta.total_pages !== data.meta.current_page
        })
      })

    return this.req
  }

  pullEvents () {
    const { reqMeta } = this

    this.getEvents({
      ...reqMeta,
      ...parseSearchString(this.props.location.search),
      page: reqMeta.current_page + 1
    }, 'pulling')
  }

  componentDidMount () {
    const { reqMeta } = this
    this.getEvents({
      ...reqMeta,
      ...parseSearchString(this.props.location.search),
      page: 1
    })
  }

  componentWillUnmount () {
    if (this.req) {
      this.req.cancel()
    }
  }

  componentWillUpdate (nextProps) {
    if (!(nextProps.location.pathname === this.props.location.pathname && nextProps.location.search === this.props.location.search)) {
      if (this.req) {
        this.req.cancel()
      }

      this.invalidate()
      this.getEvents({
        ...this.reqMeta,
        ...parseSearchString(nextProps.location.search)
      })
    }
  }

  renderList () {
    const { intl } = this.props

    return this.state.items.length
      ? this.state.items.map((event) => {
        return <EventCard
          cardId={this.props.cardId}
          onRemoved={() => { this.removeEvent(event.id) }}
          key={event.id}
          data={event}
          baseUrl={this.props.baseUrl}
        />
      })
      : <div>{ intl.formatMessage(commonIntlMessages.nothingFound) }</div>
  }

  render () {
    const { hasNext } = this.state
    const { intl } = this.props

    return <div>
      <Helmet>
        <title>{ intl.formatMessage(commonIntlMessages.eventsTitle) }</title>
      </Helmet>

      <div className='record-container'>
        <QuickForm activeTab={3} cardId={this.props.cardId} patientId={this.props.patientId} />
      </div>

      {
        this.state.loading
          ? <Spinner />
          : this.renderList()
      }

      {
        !this.state.loading && !!this.state.items.length && hasNext
          ? (
            <InViewObserver
              onEnter={() => {
                this.pullEvents()
              }}
            >
              <div>
                { this.state.pulling && <Spinner /> }
              </div>
            </InViewObserver>
          )
          : null
      }

    </div>
  }
}

export default injectIntl(List)

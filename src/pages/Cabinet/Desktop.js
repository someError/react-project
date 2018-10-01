import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

import ForRoles from '../../components/ForRoles'
import InfiniteScroll from '../../components/InfiniteScroll'
import EventCard from './Events/EntityViews/EventCard.js'
import api from '../../api'
import Record from './Cards/EntityViews/Record'
import { canEditRecord, isResponseError } from '../../util'
import QuickForm from './Add/QuickForm'

const INITIAL_PARAMS = {
  page: 1,
  limit: 10,
  direction: 'desc'
}

class Desktop extends Component {
  constructor () {
    super()

    this.state = {
      items: [],
      loading: true,
      page: 1
    }

    this.params = {
      ...INITIAL_PARAMS
    }
  }

  getData (params) {
    this.req = api.getDashboard({
      ...this.params,
      ...params
    })

    this.setState({
      loading: true
    })

    this.req
      .then(({ data: { data } }) => {
        const currentPage = Number(data.meta.current_page)

        this.setState({
          loading: false,
          items: [].concat(this.state.items, data.items),
          hasNext: data.meta.total_pages > 1 && currentPage < data.meta.total_pages
        })

        this.params.page = currentPage
      })
  }

  componentDidMount () {
    this.getData(this.params)
  }

  removeRecord (id) {
    this.setState({
      items: this.state.items.filter((item) => !(item.entityType === 'record' && item.id === id))
    })
  }

  removeEvent (id) {
    this.setState({
      items: this.state.items.filter((item) => !(item.entityType === 'event' && item.id === id))
    })
  }

  removeEventGroup (id) {
    this.setState({
      items: this.state.items.filter((item) => {
        return !(item.entityType === 'event' && item.eventGroup.id === id)
      })
    })
  }

  render () {
    return <div>
      <ForRoles allow={['doctor']}>
        <Redirect to='/cabinet/patients' />
      </ForRoles>
      {/* <ForRoles allow={['patient']}> */}
      {/* <Redirect to='/cabinet/doctors' /> */}
      {/* </ForRoles> */}

      <div className='record-container'>
        <QuickForm cardId={this.props.user.cardId} activeTab={0} patientId={this.props.user.id} />
      </div>

      <InfiniteScroll
        loading={this.state.loading}
        onRequestMore={() => {
          this.getData({ page: this.params.page + 1 })
        }}
        hasMore={this.state.hasNext}
      >
        {
          this.state.items.map((item) => {
            if (item.entityType === 'event') {
              return <EventCard
                key={'event-' + item.id}
                data={item}
                onRemoved={(type, id) => {
                  if (type === 'event') {
                    this.removeEvent(id)
                  } else {
                    this.removeEventGroup(id)
                  }
                }}
                onRecordLinked={() => {
                  this.setState({ items: [] })
                  window.scrollTo(0, 0)

                  this.getData({ ...INITIAL_PARAMS })
                }}
                cardId={this.props.user.card.id}
              />
            } else {
              return <Record
                canEdit={canEditRecord(item.author, this.props.user)}
                onPublish={(res) => { if (!isResponseError(res)) { this.updateRecord(res.data.data) } }}
                onRemove={(res) => { this.removeRecord(item.id) }}
                cardId={this.props.user.card.id}
                key={'record-' + item.id}
                {...item}
              />
            }
          })
        }
      </InfiniteScroll>

    </div>
  }
}

const mapStateToProps = ({ user }) => {
  return {
    user
  }
}

export default connect(mapStateToProps)(Desktop)

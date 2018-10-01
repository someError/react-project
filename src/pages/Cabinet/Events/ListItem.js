import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'

import api from '../../../api'
import EventCard from './EntityViews/EventCard'
import EventForm from './Form'

import Spinner from '../../../components/Loader/Spinner'
import { showAddModal } from '../../../redux/modals/actions'

import commonIntlMessages from '../../../i18n/common-messages'

class ListItem extends Component {
  constructor () {
    super()

    this.state = {
      item: {},
      loading: true,
      loadingError: false
    }
  }

  getEvent (id) {
    this.req = api.getEvent(id)

    this.setState({
      loading: true
    })

    this.req
      .then(({ data: { data } }) => {
        this.setState({
          item: data,
          loading: false
        })
      })
      .catch(({ response }) => {
        this.setState({
          loading: false,
          loadingError: response.data.data.message
        })
      })

    return this.req
  }

  componentDidMount () {
    this.getEvent(this.props.match.params.eventId)
  }

  componentWillUnmount () {
    if (this.req) {
      this.req.cancel()
    }
  }

  render () {
    const { history, intl } = this.props
    const { item } = this.state

    let Comp = EventCard

    if (this.props.edit) {
      Comp = EventForm
    }

    return <div>
      <Helmet>
        <title>{ intl.formatMessage(commonIntlMessages.eventsTitle) }</title>
      </Helmet>

      {
        this.state.loading
          ? <Spinner />
          : !this.state.loadingError && <Comp
            onRemoved={() => { history.push('/cabinet/events/list') }}
            data={!this.props.edit ? item : item.eventGroup}
          />
      }

      {
        this.state.loadingError
          ? <div>{ this.state.loadingError }</div>
          : null
      }
    </div>
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    showAddModal (cardId, tabIndex, patientId, eventId) {
      dispatch(showAddModal(cardId, tabIndex, patientId, eventId))
    }
  }
}

export default injectIntl(connect(null, mapDispatchToProps)(ListItem))

import React, { Component } from 'react'

import api from '../../../api'
import Spinner from '../../../components/Loader/Spinner'

import Record from './EntityViews/Record'
import { canEditRecord, isResponseError } from '../../../util'
import withUser from '../../../redux/util/withUser'

class CardRecord extends Component {
  constructor () {
    super()

    this.state = {
      loading: true
    }
  }

  componentDidMount () {
    const { params } = this.props.match

    this.setState({
      loading: true
    })

    this.req = api.getCardRecord(params.cardId, params.recordId)

    this.req
      .then(({ data: { data } }) => {
        this.setState({
          loading: false,
          ...data
        })
      })
  }

  componentWillUnmount () {
    if (this.req) {
      this.req.cancel()
    }
  }

  render () {
    const { state } = this
    const { params } = this.props.match

    if (state.loading) {
      return <Spinner />
    }

    return <Record
      commentsAllowLoadMore
      commentsParams={{ limit: 10, direction: 'asc' }}
      cardId={params.cardId}
      canEdit={canEditRecord(this.state.author, this.props.user)}
      onRemove={() => {
        this.props.history.replace(`/cabinet/cards/${params.cardId}/records`)
      }}
      onPublish={(res) => {
        if (!isResponseError(res)) {
          this.setState({
            ...res.data.data
          })
        }
      }}
      {...state}
    />
  }
}

export default withUser(CardRecord)

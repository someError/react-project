import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Link } from 'react-router-dom'

import api from '../../../api'
import { Spinner, OverlaySpinner } from '../../../components/Loader'
import { Avatar } from '../../../components/Avatar'
import { Tile, TileIcon, TileContent } from '../../../components/Tile'
import CommentForm from './Form/CommentForm'
import withUser from '../../../redux/util/withUser'
import { defineMessages, injectIntl } from 'react-intl'

const messages = defineMessages({
  comments: {
    id: 'comments.count',
    defaultMessage: `{count, plural, 
    one {комментарий}
    few {комментария}
    other {комментариев}
    }`
  },
  total: {
    id: 'comments.total',
    defaultMessage: 'Всего'
  },
  loadMore: {
    id: 'comment.load_more',
    defaultMessage: 'Загрузить ещё'
  }
})

class CommentsList extends Component {
  constructor () {
    super()

    this.state = {
      items: [],
      meta: {},
      loading: true,
      pulling: false,
      initiallyLoaded: false
    }
  }

  fetchComments (params) {
    const { cardId, recordId } = this.props

    this.setState({
      loading: true
    })

    this.req = api.getCardRecordComments(cardId, recordId, params)

    this.req
      .then(({ data: { data } }) => {
        this.setState({
          ...data,
          loading: false,
          initiallyLoaded: true
        })
      })
  }

  pullComments () {
    const { cardId, recordId } = this.props

    this.setState({
      pulling: true
    })

    this.req = api.getCardRecordComments(cardId, recordId, {
      ...this.state.meta,
      limit: this.state.meta.items_per_page,
      page: this.state.meta.current_page + 1
    })

    this.req
      .then(({ data: { data } }) => {
        this.setState((state) => {
          const items = [].concat(state.items, data.items)

          return {
            ...state,
            meta: data.meta,
            items,
            pulling: false
          }
        })
      })
  }

  componentDidMount () {
    this.fetchComments(this.props.params)
  }

  componentWillUnmount () {
    if (this.req) {
      this.req.cancel()
    }
  }

  render () {
    const { state, props } = this
    const { meta } = state

    const { cardId, recordId } = props

    if (!state.initiallyLoaded && state.loading) {
      return <Spinner />
    }

    return <div style={{position: 'relative'}}>
      { state.loading && <OverlaySpinner /> }

      {
        state.items.map((comment) => <Comment key={comment.id} {...comment} />)
      }

      {
        !this.props.allowLoadMore && meta.total > 1
          ? <div className='text-sm' style={{ marginBottom: '1.25rem' }}>{ props.intl.formatMessage(messages.total) } <Link to={`/cabinet/cards/${cardId}/records/${recordId}#comments`}>{ meta.total } { props.intl.formatMessage(messages.comments, { count: meta.total }) }</Link></div>
          : null
      }

      {
        this.props.allowLoadMore && meta.total > 0 && meta.total_pages !== meta.current_page &&
        <div className='comment-load-more'>
          {
            !this.state.pulling
              ? <span className='dashed-link' onClick={() => { this.pullComments() }}>{ props.intl.formatMessage(messages.loadMore) }</span>
              : <Spinner size='sm' />
          }
        </div>
      }

      <CommentForm
        onSuccess={(comment) => {
          let { items } = this.state

          items.push(comment)

          this.setState({
            items
          })
        }}
        user={props.user}
        cardId={this.props.cardId}
        recordId={this.props.recordId}
      />
    </div>
  }
}

CommentsList.propTypes = {
  params: PropTypes.object,
  allowLoadMore: PropTypes.bool
}

CommentsList.defaultProps = {
  params: {},
  allowLoadMore: false
}

export default injectIntl(withUser(CommentsList))

const Comment = ({ text, author, date }) => {
  return <Tile className='comment'>
    <TileIcon>
      <Avatar
        size={'sm'}
        initial={`${author.firstName.split('')[0]}${author.lastName.split('')[0]}`}
        src={author.avatar && author.avatar.url}
      />
    </TileIcon>
    <TileContent>
      <div className='comment-author'>{ author.firstName } { author.lastName } <small className='text-xs color-gray'>{ moment(date).format('DD.MM.YYYY HH:mm') }</small></div>
      <div className='comment-text'>{ text }</div>
    </TileContent>
  </Tile>
}

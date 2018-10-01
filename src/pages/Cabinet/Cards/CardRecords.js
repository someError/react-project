import React, { Component } from 'react'
import qs from 'qs'
import cloneDeep from 'lodash/cloneDeep'
import { connect } from 'react-redux'
import { defineMessages, injectIntl } from 'react-intl'

import api from '../../../api'
import Spinner from '../../../components/Loader/Spinner'
import Record from './EntityViews/Record'
import InViewObserver from '../../../components/Inview/InViewObserver'
import { parseSearchString, isResponseError, canEditRecord } from '../../../util'
import QuickForm from '../Add/QuickForm'

import Helmet from 'react-helmet'

import { showAddModal } from '../../../redux/modals/actions'

const intlMessages = defineMessages({
  header: {
    id: 'page.records.header',
    defaultMessage: 'Записи медкарты'
  }
})

const REQUEST_META = {
  current_page: 0,
  direction: 'desc',
  items_per_page: 10,
  sort: 'entity.createdAt',
  total: null,
  total_pages: null
}

class CardRecords extends Component {
  constructor () {
    super()

    this.state = {
      loading: true,
      records: [],
      hasNext: false,
      pulling: false
    }

    this.reqMeta = {
      ...REQUEST_META
    }
  }

  invalidate () {
    this.setState({
      records: [],
      hasNext: false
    })

    this.reqMeta = {
      ...REQUEST_META
    }
  }

  updateRecord (data) {
    const records = cloneDeep(this.state.records)

    const updateIndex = records.findIndex((r) => r.id === data.id)
    if (updateIndex > -1) {
      records.splice(updateIndex, 1, data)

      this.setState({
        records
      })
    }
  }

  removeRecord (id) {
    const records = cloneDeep(this.state.records)

    const removeIndex = records.findIndex((r) => r.id === id)

    if (removeIndex > -1) {
      records.splice(removeIndex, 1)

      this.setState({
        records
      })
    }
  }

  getRecords (params, reason = 'loading') {
    const { cardId } = this.props

    this.req = api.getCardRecords(cardId, qs.stringify(params))

    this.setState({
      [reason]: true
    })

    this.req.then(({ data: { data } }) => {
      this.reqMeta = data.meta
      this.setState({
        records: this.state.records.concat(data.items),
        hasNext: !!data.meta.total_pages && !!data.meta.total_pages && data.meta.total_pages !== data.meta.current_page,
        [reason]: false
      })
    })

    return this.req
  }

  pullRecords () {
    const { reqMeta } = this

    this.getRecords({
      ...reqMeta,
      ...parseSearchString(this.props.location.search),
      page: reqMeta.current_page + 1
    }, 'pulling')
  }

  componentDidMount () {
    const { reqMeta } = this
    this.getRecords({
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
      this.invalidate()
      this.getRecords({
        ...this.reqMeta,
        ...parseSearchString(nextProps.location.search)
      })
    }
  }

  renderRecords () {
    if (this.state.loading) {
      return <Spinner />
    }

    const { cardId, user } = this.props

    const { hasNext } = this.state

    return <div>
      {
        !this.state.records.length
          ? <div>Нет записей</div>
          : this.state.records.map((record) => (
            <Record
              canEdit={canEditRecord(record.author, user)}
              onPublish={(res) => { if (!isResponseError(res)) { this.updateRecord(res.data.data) } }}
              onRemove={(res) => { this.removeRecord(record.id) }}
              cardId={cardId} key={record.id} {...record}
            />
          ))
      }

      {
        hasNext
          ? (
            <InViewObserver
              onEnter={() => {
                this.pullRecords()
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

  render () {
    const { cardId, location, cardAccess, intl } = this.props

    const search = parseSearchString(location.search)

    return <div>
      <Helmet>
        <title>{ intl.formatMessage(intlMessages.header) }</title>
      </Helmet>

      {
        !search.query && cardAccess === 'read_write'
          ? <div className='record-container'>
            <QuickForm cardId={cardId} activeTab={0} patientId={this.props.patientId} />
          </div>
          : null
      }

      {/* <MediaQuery rule='(max-width: 1220px)'> */}
      {/* <div className='record-container'> */}
      {/* <Card> */}
      {/* <Collapsible */}
      {/* title={intl.formatMessage(commonIntlMessages.recordsFilter)} */}
      {/* triggerClassName='filter-header' */}
      {/* > */}
      {/* <div className='inline-filters'> */}
      {/* <Filters activeCollapsible disableCollapsible className='list-filter' sections={sections} {...this.props} /> */}
      {/* </div> */}
      {/* </Collapsible> */}
      {/* </Card> */}
      {/* </div> */}
      {/* </MediaQuery> */}

      { this.renderRecords() }

    </div>
  }
}

CardRecords.defaultProps = {
  cardAccess: 'read_write'
}

const mapStateToProps = ({ user, reference }) => {
  return {
    user,
    sections: reference.sections || []
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    showAddModal: function (...args) {
      dispatch(showAddModal(...args))
    }
  }
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(CardRecords))

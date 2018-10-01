import React, { Component } from 'react'
import { connect } from 'react-redux'
import api from '../../api'
import { Link } from 'react-router-dom'
import Record from '../../pages/Cabinet/Cards/EntityViews/Record'
import { FormattedMessage } from 'react-intl'
import { parseSearchString } from '../../util'
import InViewObserver from '../../components/Inview/InViewObserver'
import qs from 'qs'

import './style.css'
import { OverlaySpinner, Spinner } from '../../components/Loader'

const REQUEST_META = {
  current_page: 0,
  direction: 'desc',
  items_per_page: 10,
  sort: 'entity.createdAt',
  total: null,
  total_pages: null
}

class Sos extends Component {
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

  getRecords (params, reason = 'loading') {
    // const { cardId } = this.props

    this.req = api.getEmergenciesCardRecords(qs.stringify(params))

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
    api.emergenciesCardFullAccess()
      .then(() => {
        this.getRecords({
          ...reqMeta,
          ...parseSearchString(this.props.location.search),
          page: 1
        })
          .then(({ data: { data: { items } } }) => {
            this.setState({records: items, loading: false})
          })
      })
      .catch(() => {
        this.getRecords({
          ...reqMeta,
          ...parseSearchString(this.props.location.search),
          page: 1
        })
          .then(({ data: { data: { items } } }) => {
            this.setState({records: items, loading: false})
          })
      })
  }

  render () {
    const { state, props } = this
    if (state.loading) {
      return <OverlaySpinner initial />
    }
    return (
      <div>
        <Link style={{textDecoration: 'none', marginBottom: '1.25rem', display: 'inline-flex'}} to={props.match.url.replace('/medical', '')}>
          ← <FormattedMessage id='sos.go_back' defaultMessage='Вернуться к карте экстренной помощи' />
        </Link>
        {
          state.records.map(item => {
            return <Record sosPath {...item} />
          })
        }
        {console.log(state.hasNext)}
        {
          state.hasNext
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
    )
  }
}

const mapStateToProps = ({ user, reference }) => {
  return {
    user,
    reference
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Sos)

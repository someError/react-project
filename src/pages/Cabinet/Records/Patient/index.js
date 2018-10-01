import React, { Component } from 'react'
import { connect } from 'react-redux'
import qs from 'qs'
import { injectIntl } from 'react-intl'
import { ModalRoute } from '../../../../components/Router'
import Record from './EntityViews/Record'
import { fetchRecords } from '../../../../redux/requests/actions'
import { parseSearchString } from '../../../../util'
import Spinner from '../../../../components/Loader/Spinner'

import commonIntlMessages from '../../../../i18n/common-messages'

class PatientRecords extends Component {
  constructor () {
    super()

    this.state = {
    }
  }

  componentDidMount () {
    let query = parseSearchString(this.props.location.search)
    this.props.fetchRecords(qs.stringify({
      timeBox: 'yes',
      ...query
    }))
  }

  componentWillReceiveProps (nextProps) {
    let query = parseSearchString(nextProps.location.search)
    if (nextProps.location.search !== this.props.location.search) {
      this.props.fetchRecords(qs.stringify({
        timeBox: 'yes',
        ...query
      }))
    }
  }

  render () {
    const { records, match, intl } = this.props
    return (
      <div>
        <header className='page-header'>
          <h2>{ intl.formatMessage(commonIntlMessages.receptionsTitle) }</h2>
        </header>
        {
          records.loading ? (
            <Spinner />
          ) : (
            records.items.map((record) => {
              return <Record key={record.id} {...record} />
            })
          )
        }
        {
          <ModalRoute
            modalContainerClassName={'request-detail'}
            closeUrl='/cabinet/records'
            path={`${match.url}/:id`}
            exact
            component={Record}
          />
        }
      </div>
    )
  }
}

const mapStateToProps = ({ records }) => {
  return {
    records
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    // showAddModal: function (...args) {
    //   console.log(args)
    //   return dispatch(showAddModal(...args))
    // },
    fetchRecords: function (query) {
      return dispatch(fetchRecords(query))
    }
  }
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(PatientRecords))

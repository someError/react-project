import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Switch } from 'react-router-dom'
import { injectIntl } from 'react-intl'
import Record from './EntityViews/Record'
import { ModalRoute } from '../../../../components/Router'
import { fetchRecords } from '../../../../redux/requests/actions'
import Spinner from '../../../../components/Loader/Spinner'
import Button from '../../../../components/Button'
import Template from '../../../../components/Template'
import ScheduleRecord from '../../Schedule/ScheduleRecord'
import { parseSearchString } from '../../../../util'
import './style.css'

import commonIntlMessages from '../../../../i18n/common-messages'

class DoctorRecords extends Component {
  constructor () {
    super()

    this.state = {
      recordsOpen: true,
      requestsOpen: true
    }
  }

  componentDidMount () {
    const query = parseSearchString(this.props.location.search || '')
    this.props.fetchRecords(query)
  }

  componentWillReceiveProps (nextProps) {
    if (!(nextProps.location.search === this.props.location.search)) {
      const query = parseSearchString(nextProps.location.search || '')
      this.props.fetchRecords(query)
    }
  }

  render () {
    const { state } = this
    const { records, match, user, intl } = this.props
    const _requests = records.items && records.items.filter(record => { return !record.timeBox && record.status !== 'closed' })
    const _records = records.items && records.items.filter(record => { return record.timeBox })
    return (
      <div>
        <header className='page-header'>
          <h2>{ intl.formatMessage(commonIntlMessages.receptionsAndRequestsTitle) }
            <div className='title-btns'>
              {
                user.queuesCount ? (
                  <Button size='sm' to={`${match.url}/add`}>
                    { intl.formatMessage(commonIntlMessages.enrollPatient) }
                  </Button>
                ) : (
                  <Button size='sm' to={`/cabinet/schedule/add`}>
                    { intl.formatMessage(commonIntlMessages.createScheduleBtn) }
                  </Button>
                )
              }
            </div>
          </h2>
        </header>
        {
          records.loading ? (
            <Spinner />
          ) : (
            <Template>
              {
                _requests && _requests.length ? (
                  <Template>
                    <div className='records-section-title'>
                      <h2>{ intl.formatMessage(commonIntlMessages.receptionsRequestsTitle) }</h2>
                      <span
                        onClick={() => {
                          this.setState({requestsOpen: !state.requestsOpen})
                        }}
                      >{state.requestsOpen ? intl.formatMessage(commonIntlMessages.collapse) : intl.formatMessage(commonIntlMessages.expand)}</span>
                    </div>
                    {
                      state.requestsOpen && _requests.map((record) => {
                        return <Record queuesCount={user.queuesCount} key={record.id} {...record} />
                      })
                    }
                  </Template>
                ) : null
              }
              {
                _records && _records.length ? (
                  <Template>
                    <div className='records-section-title'>
                      <h2>{ intl.formatMessage(commonIntlMessages.receptionsTitle) }</h2>
                      <span
                        onClick={() => {
                          this.setState({
                            recordsOpen: !state.recordsOpen
                          })
                        }}
                      >
                        {state.recordsOpen ? intl.formatMessage(commonIntlMessages.collapse) : intl.formatMessage(commonIntlMessages.expand)}
                      </span>
                    </div>
                    {
                      state.recordsOpen && _records.map((record) => {
                        return <Record key={record.id} queuesCount={user.queuesCount} {...record} />
                      })
                    }
                  </Template>
                ) : null
              }
            </Template>
          )
        }
        <Switch>
          <ModalRoute
            modalContainerClassName={'add-form-content'}
            exact
            closeUrl={match.url}
            path={`${match.url}/add`}
            component={() => <ScheduleRecord {...this.props} backUrl={match.url} />}
          />
          <ModalRoute
            modalContainerClassName={'request-detail'}
            closeUrl='/cabinet/records'
            path={`${match.url}/:id`}
            exact
            component={Record}
          />
        </Switch>
      </div>
    )
  }
}

const mapStateToProps = ({ records, user }) => {
  return {
    records,
    user
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchRecords: function (query) {
      return dispatch(fetchRecords(query))
    }
  }
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(DoctorRecords))

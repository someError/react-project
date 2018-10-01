import React, { Component } from 'react'
import { connect } from 'react-redux'
import qs from 'qs'
import { injectIntl } from 'react-intl'

import api from '../../../api'

import PatientListItem from './EntityViews/PatientListItem'
import Button from '../../../components/Button'
import Select from '../../../components/Form/Select'
import ForRoles from '../../../components/ForRoles'

import { showAddModal, showCreateCardModal } from '../../../redux/modals/actions'
import { parseSearchString } from '../../../util'
import Spinner from '../../../components/Loader/Spinner'

import commonIntlMessages from '../../../i18n/common-messages'

class PatientsList extends Component {
  constructor () {
    super()

    this.state = {
      items: [],
      loading: true,
      requestAccess: null,
      createPatient: false,
      hasNext: false
    }

    this.reqMeta = {}
  }

  fetchPatients (params) {
    this.req = api.getDoctorPatients(params)

    this.req.then(({ data: { data } }) => {
      this.reqMeta = data.meta
      this.setState({
        items: data.items,
        hasNext: data.meta.total_pages !== data.meta.current_page,
        loading: false
      })
    })
  }

  componentDidMount () {
    this.setState({
      loading: true
    })

    this.fetchPatients({
      ...this.reqMeta,
      ...parseSearchString(this.props.location.search),
      page: 1
    })
  }

  componentDidUpdate (prevProps) {
    if (this.props.location !== prevProps.location) {
      // TODO: возможно как-то подругому надо
      /* eslint react/no-did-update-set-state: off */

      this.setState({
        loading: true
      })

      this.fetchPatients({
        ...this.reqMeta,
        ...parseSearchString(this.props.location.search),
        page: 1
      })
    }
  }

  componentWillUnmount () {
    if (this.req) {
      this.req.cancel()
    }
  }

  render () {
    const { showAddModal, showCreateCardModal, intl } = this.props

    const query = parseSearchString(this.props.location.search)

    let sortValue = `${query.sort || 'entity.lastActivityTime'}:${query.direction || 'desc'}`

    if (this.state.loading) {
      return <Spinner />
    }

    return <div>
      <div className='page-header'>
        <h1>{ intl.formatMessage(commonIntlMessages.patientsTitle) } <ForRoles role={['doctor', 'registry']}><Button size='sm' onClick={() => { showCreateCardModal() }}>{ intl.formatMessage(commonIntlMessages.addCardBtn) }</Button></ForRoles></h1>

        {/* <MediaQuery rule='(max-width: 1220px)'> */}
        {/* <div className='record-container'> */}
        {/* <Card> */}
        {/* <Collapsible */}
        {/* title={intl.formatMessage(commonIntlMessages.filterPatients)} */}
        {/* triggerClassName='filter-header' */}
        {/* > */}
        {/* <div className='inline-filters'> */}
        {/* <Filters activeCollapsible disableCollapsible className='list-filter' {...this.props} /> */}
        {/* </div> */}
        {/* </Collapsible> */}
        {/* </Card> */}
        {/* </div> */}
        {/* </MediaQuery> */}

        <div className='sort-menu'>
          { intl.formatMessage(commonIntlMessages.sortBy) }:{' '}
          <Select
            onChange={(e) => {
              const values = e.target.value.split(':')

              const meta = {
                sort: values[0],
                direction: values[1]
              }

              this.props.history.push({
                search: qs.stringify({
                  ...query,
                  ...meta
                })
              })
            }}
            value={sortValue}
            className='color-blue'
          >
            <option value='entity.lastActivityTime:desc'>{ intl.formatMessage(commonIntlMessages.sortingActivityDesc) }</option>
            <option value='entity.lastActivityTime:asc'>{ intl.formatMessage(commonIntlMessages.sortingActivityAsc) }</option>
            <option value='entity.lastName:asc'>{ intl.formatMessage(commonIntlMessages.sortingAlphabetAsc) }</option>
            <option value='entity.lastName:desc'>{ intl.formatMessage(commonIntlMessages.sortingAlphabetDesc) }</option>
          </Select>
        </div>
      </div>

      {
        this.state.items.map((card) => {
          return <div key={card.id} className='record-container'>
            <PatientListItem onAddClick={showAddModal} {...card} />
          </div>
        })
      }
    </div>
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    showAddModal: function (...args) {
      return dispatch(showAddModal(...args))
    },

    showCreateCardModal: function () {
      return dispatch(showCreateCardModal())
    }
  }
}

export default injectIntl(connect(null, mapDispatchToProps)(PatientsList))

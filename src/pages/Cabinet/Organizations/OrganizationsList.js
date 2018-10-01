import React, { Component } from 'react'
import { connect } from 'react-redux'
import qs from 'qs'
import { injectIntl } from 'react-intl'
import { parseSearchString } from '../../../util'
import { OverlaySpinner, Spinner } from '../../../components/Loader'

import OrganizationListItem from './EntityViews/OrganizationListItem'
import Select from '../../../components/Form/Select'
import { showAddModal } from '../../../redux/modals/actions'
import { fetchOrganizations } from '../../../redux/organizations/actions'

import commonIntlMessages from '../../../i18n/common-messages'

// FIXME: воткнуть intl
const SORTING = [
  {
    sort: 'entity.name',
    direction: 'asc',
    name: 'Алфавиту (от А до Я)'
  },
  {
    sort: 'entity.name',
    direction: 'desc',
    name: 'Алфавиту (от Я до А)'
  }
]

class OrganizationsList extends Component {
  constructor () {
    super()

    this.state = {
      items: [],
      initialLoading: true,
      itemIndex: null,
      requestAccess: null,
      createPatient: false,
      activeSort: 0,
      showRequestModal: false
    }
  }

  getOrgsList (search = '') {
    const query = parseSearchString(search)
    const params = {
      ...query,
      limit: 100
    }

    const activeSortIndex = SORTING.findIndex(i => i.sort === query.sort && i.direction === query.direction)

    this.setState({
      activeSort: activeSortIndex || 0
    })
    this.req = this.props.fetchOrganizations(params)
    return this.req
  }

  componentDidMount () {
    const { location } = this.props
    this.getOrgsList(location.search)
      .then(() => this.setState({initialLoading: false}))
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.location.search !== nextProps.location.search) {
      this.getOrgsList(nextProps.location.search)
    }
  }

  render () {
    const { state } = this
    const { organizations, location, intl } = this.props
    const query = parseSearchString(location.search)

    if (state.initialLoading) {
      return <OverlaySpinner />
    }

    return <div>
      <header className='page-header'>
        <h2>{ intl.formatMessage(commonIntlMessages.doctorOrgsTitle) } ({organizations.total})</h2>
      </header>

      <div className='sort-menu'>
        { intl.formatMessage(commonIntlMessages.sortBy) }: <Select
          className='color-blue'
          value={state.activeSort}
          onChange={(e) => {
            const value = e.target.value
            this.props.history.push({
              search: qs.stringify({
                ...query,
                sort: SORTING[value]['sort'],
                direction: SORTING[value]['direction']
              })
            })
            // this.setState({activeSort: value})
          }}
        >
          {
            SORTING.map((item, i) => {
              return <option key={`doc-list-sorting-${i}`} value={i}>{ item.name }</option>
            })
          }
        </Select>
      </div>

      {
        organizations.loading
          ? <Spinner />
          : organizations.items.map((organization, i) => {
            return <div key={organization.id} className='record-container'>
              <OrganizationListItem
                {...organization}
                showTimeBoxes={() => {
                  this.setState({itemIndex: i})
                }}
                showRequestModal={() => {
                  this.setState({showRequestModal: true})
                }}
                opened={this.state.itemIndex === i}
              />
            </div>
          })
      }
    </div>
  }
}

const mapStateToProps = ({ organizations }) => {
  return {
    organizations
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    showAddModal: function (...args) {
      return dispatch(showAddModal(...args))
    },
    fetchOrganizations: function (query) {
      return dispatch(fetchOrganizations(query))
    }
  }
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(OrganizationsList))

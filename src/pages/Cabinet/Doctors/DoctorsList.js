import React, { Component } from 'react'
import { connect } from 'react-redux'
import qs from 'qs'
import { injectIntl } from 'react-intl'
import { parseSearchString } from '../../../util'

import DoctorListItem from './EntityViews/DoctorListItem'
import Select from '../../../components/Form/Select'
import { showAddModal } from '../../../redux/modals/actions'
import { fetchDoctors } from '../../../redux/doctors/actions'
import { OverlaySpinner, Spinner } from '../../../components/Loader'
import commonIntlMessages from '../../../i18n/common-messages'

// FIXME: придумать как воткнуть intl
const SORTING = [
  {
    sort: 'entity.lastName',
    direction: 'asc',
    name: 'Алфавиту (от А до Я)'
  },
  {
    sort: 'entity.lastName',
    direction: 'desc',
    name: 'Алфавиту (от Я до А)'
  }
]

class DoctorsList extends Component {
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

  getDoctorsList (search = '') {
    const query = parseSearchString(search)
    const params = {
      ...query,
      limit: 100
    }

    const activeSortIndex = SORTING.findIndex(i => i.sort === query.sort && i.direction === query.direction)

    this.setState({
      activeSort: activeSortIndex || 0
    })
    this.req = this.props.fetchDoctors(params)
    return this.req
  }

  componentDidMount () {
    const { location } = this.props
    this.getDoctorsList(location.search)
      .then(() => this.setState({initialLoading: false}))
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.location.search !== nextProps.location.search) {
      this.getDoctorsList(nextProps.location.search)
    }
  }

  render () {
    const { state } = this
    const { doctors, location, intl } = this.props
    const query = parseSearchString(location.search)

    if (state.initialLoading) {
      return <OverlaySpinner />
    }

    return <div>
      <header className='page-header'>
        <h2>{ intl.formatMessage(commonIntlMessages.labelDoctors) } ({doctors.total})</h2>
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
        doctors.loading
          ? <Spinner />
          : doctors.items.map((doctor, i) => {
            return <div key={doctor.id} className='record-container'>
              <DoctorListItem
                {...doctor}
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

const mapStateToProps = ({ doctors }) => {
  return {
    doctors
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    showAddModal: function (...args) {
      return dispatch(showAddModal(...args))
    },
    fetchDoctors: function (query) {
      return dispatch(fetchDoctors(query))
    }
  }
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(DoctorsList))

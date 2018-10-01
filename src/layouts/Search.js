import React, { Component } from 'react'
import { injectIntl } from 'react-intl'
import FeatherIcon from '../components/Icons/FeatherIcon'
import MediaQuery from '../components/MediaQuery'
import Select from '../components/Form/Select'
import { withRouter, matchPath } from 'react-router'
import qs from 'qs'
import { parseSearchString } from '../util'
import withUser from '../redux/util/withUser'
import ForRoles from '../components/ForRoles'

import commonIntlMessages from '../i18n/common-messages'

const PATHS = {
  doctors: '/cabinet/doctors',
  patients: '/cabinet/patients',
  organizations: '/cabinet/organizations',
  events: '/events/list'
}

const getSearchData = (location) => {
  let result = {
    field: 'name'
  }

  const isDoctors = /doctors/.test(location.pathname)
  const isPatients = /patients$/.test(location.pathname)
  const isOrganizations = /organizations/.test(location.pathname)
  const isCard = /cards\/([A-z0-9-]+)\/records/.test(location.pathname) || /patients\/([A-z0-9-]+)\/([A-z0-9-]+)\/records/.test(location.pathname)
  // const isEvents = /events/.test(location.pathname)

  if (
    isDoctors ||
    isPatients ||
    isOrganizations
  ) {
    result.field = 'name'
  }

  if (isDoctors) {
    result.pathname = PATHS.doctors
  }

  if (isPatients) {
    result.pathname = PATHS.patients
  }

  if (isOrganizations) {
    result.pathname = PATHS.organizations
  }

  if (isCard) {
    let match = matchPath(location.pathname, {
      path: '/cabinet/cards/:cardId/records'
    })

    if (!match) {
      match = matchPath(location.pathname, {
        path: '/cabinet/patients/:patientId/:cardId/records'
      })
    }

    result.field = 'query'

    if (!match.params.patientId) {
      result.pathname = `/cabinet/cards/${match.params.cardId}/records`
    } else {
      result.pathname = `/cabinet/patients/${match.params.patientId}/${match.params.cardId}/records`
    }
  }

  return result
}

class Search extends Component {
  constructor (props) {
    super()

    const searchData = getSearchData(props.location)

    this.state = {
      field: searchData.field,
      pathname: searchData.pathname
    }

    this.state.query = parseSearchString(props.location.search)[this.state.field] || ''
  }

  search () {
    this.props.history.push({
      pathname: this.state.pathname,
      search: qs.stringify({ [this.state.field]: this.state.query })
    })
  }

  componentDidUpdate (prevProps) {
    if (prevProps !== this.props) {
      const searchData = getSearchData(this.props.location)

      // TODO: возможно как-то подругому надо
      /* eslint react/no-did-update-set-state: off */
      this.setState({
        field: searchData.field,
        pathname: searchData.pathname
        // query: parseSearchString(this.props.location.search)[searchData.field] || ''
      })
    }
  }

  render () {
    let match
    if (this.props.user.entity_type === 'doctor') {
      match = matchPath(this.props.location.pathname, {
        path: '/cabinet/patients/:patientId/:cardId/records'
      })
    }

    const { intl } = this.props

    return <form onSubmit={(e) => { e.preventDefault(); this.search() }} className='global-search-form'>
      <div className='global-search-form__input'>
        <FeatherIcon className='global-search-form__icon' icon='search' color='#8873B3' size={24} />
        <input value={this.state.query} onChange={(e) => { this.setState({ query: e.target.value }) }} placeholder={intl.formatMessage(commonIntlMessages.labelSearch)} type='text' />
      </div>
      <MediaQuery rule='(min-width: 1024px)'>
        <div className='global-search-form__select'>
          <Select
            value={this.state.pathname}
            onChange={(e) => {
              this.setState({
                pathname: e.target.value
              })
            }}
          >
            <ForRoles allow={['patient']}>
              { this.props.user.card && <option value={`/cabinet/cards/${this.props.user.card.id}/records`}>{intl.formatMessage(commonIntlMessages.menuCard)}</option> }
              <option value={PATHS.doctors}>{intl.formatMessage(commonIntlMessages.labelDoctors)}</option>
              <option value={PATHS.organizations}>{intl.formatMessage(commonIntlMessages.labelOrgs)}</option>
            </ForRoles>

            <ForRoles allow={['doctor']}>
              {/* <option value={PATHS.patients}>Пациенты</option> */}
              { match && match.params.patientId && match.params.cardId && <option value={`/cabinet/patients/${match.params.patientId}/${match.params.cardId}/records`}>{intl.formatMessage(commonIntlMessages.menuCard)}</option> }
            </ForRoles>
          </Select>
        </div>
      </MediaQuery>
    </form>
  }
}

export default injectIntl(withRouter(withUser(Search)))

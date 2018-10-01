import React from 'react'
import PropTypes from 'prop-types'
import qs from 'qs'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'

import Collapsible from '../../../components/Collapsible'
import { Checkbox } from '../../../components/Form'
import { parseSearchString } from '../../../util'
import Template from '../../../components/Template'

import commonIntlMessages from '../../../i18n/common-messages'

const Filters = ({ location, history, disableCollapsible, user, intl }) => {
  const query = parseSearchString(location.search)

  const authorsSet = new Set(query.author)
  const statusesSet = new Set(query.status)

  return <Template>
    <Collapsible
      touchOpened
      title={intl.formatMessage(commonIntlMessages.labelAuthor)}
      className='filter-collapsible'
      triggerClassName='filter-collapsible-trigger'
      disabled={disableCollapsible}
      active={authorsSet.size > 0}
    >
      <ul className='filters-list'>
        <li>
          <Checkbox
            checked={authorsSet.has('patient')}
            onChange={(e) => {
              if (e.target.checked) {
                authorsSet.add('patient')
              } else {
                authorsSet.delete('patient')
              }

              history.push({
                search: qs.stringify({
                  ...query,
                  author: [...authorsSet]
                })
              })
            }}
            label={user.entity_type === 'patient' ? intl.formatMessage(commonIntlMessages.labelMyRecords) : intl.formatMessage(commonIntlMessages.labelPatient)}
          />
        </li>
        <li>
          <Checkbox
            checked={authorsSet.has('doctor')}
            onChange={(e) => {
              if (e.target.checked) {
                authorsSet.add('doctor')
              } else {
                authorsSet.delete('doctor')
              }

              history.push({
                search: qs.stringify({
                  ...query,
                  author: [...authorsSet]
                })
              })
            }}
            label={user.entity_type === 'patient' ? intl.formatMessage(commonIntlMessages.labelDoctor) : intl.formatMessage(commonIntlMessages.labelMyRecords)}
          />
        </li>
      </ul>
    </Collapsible>

    <Collapsible
      touchOpened
      className='filter-collapsible'
      triggerClassName='filter-collapsible-trigger'
      title={intl.formatMessage(commonIntlMessages.labelEventStatus)}
      active={!!query.status}
      disabled={disableCollapsible}
    >
      <ul className='filters-list'>
        <li>
          <Checkbox
            checked={statusesSet.has('completed')}
            onChange={(e) => {
              if (e.target.checked) {
                statusesSet.add('completed')
              } else {
                statusesSet.delete('completed')
              }

              history.push({
                search: qs.stringify({
                  ...query,
                  status: [...statusesSet]
                })
              })
            }}
            label={intl.formatMessage(commonIntlMessages.eventStatusDone)}
          /></li>
        <li>
          <Checkbox
            checked={statusesSet.has('unplanned')}
            onChange={(e) => {
              if (e.target.checked) {
                statusesSet.add('unplanned')
              } else {
                statusesSet.delete('unplanned')
              }

              history.push({
                search: qs.stringify({
                  ...query,
                  status: [...statusesSet]
                })
              })
            }}
            label={intl.formatMessage(commonIntlMessages.eventStatusNotPlanned)}
          />
        </li>
        <li>
          <Checkbox
            checked={statusesSet.has('expired')}
            onChange={(e) => {
              if (e.target.checked) {
                statusesSet.add('expired')
              } else {
                statusesSet.delete('expired')
              }

              history.push({
                search: qs.stringify({
                  ...query,
                  status: [...statusesSet]
                })
              })
            }}
            label={intl.formatMessage(commonIntlMessages.eventStatusExpired)}
          />
        </li>
      </ul>
    </Collapsible>
  </Template>
}

Filters.propTypes = {
  disableCollapsible: PropTypes.bool
  // activeCollapsible: PropTypes.bool
}

Filters.defaultProps = {
  disableCollapsible: false,
  activeCollapsible: false
}

export default injectIntl(connect(({ user }) => ({ user }))(Filters))

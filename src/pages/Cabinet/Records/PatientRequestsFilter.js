import React, { Component } from 'react'
import { injectIntl } from 'react-intl'
import PropTypes from 'prop-types'
import qs from 'qs'

import Collapsible from '../../../components/Collapsible'
import { Checkbox } from '../../../components/Form'
import { parseSearchString } from '../../../util'

import commonIntlMessages from '../../../i18n/common-messages'

const STATUSES = [
  {
    label: commonIntlMessages.receptionStatusNotConfirmed,
    value: 'not_confirmed'
  },
  {
    label: commonIntlMessages.receptionStatusConfirmed,
    value: 'confirmed'
  },
  {
    label: commonIntlMessages.receptionStatusCompleted,
    value: 'completed'
  },
  {
    label: commonIntlMessages.receptionStatusMissed,
    value: 'patient_missing'
  },
  {
    label: commonIntlMessages.receptionStatusCanceled,
    value: 'canceled'
  }
]

class Filters extends Component {
  constructor () {
    super()
    this.state = {
      statuses: []
    }
  }

  componentWillMount () {
    const query = parseSearchString(this.props.location.search)
    if (query.filter && query.filter.status[0]['value']) {
      this.setState({ statuses: query.filter.status[0]['value'] })
    }
  }

  render () {
    const { state } = this
    const { location, disableCollapsible, activeCollapsible, intl } = this.props
    const query = parseSearchString(location.search)

    const filter = query.filter || {}

    return <Collapsible
      touchOpened
      className='filter-collapsible'
      triggerClassName='filter-collapsible-trigger'
      title={intl.formatMessage(commonIntlMessages.labelReceptionStatus)}
      disabled={disableCollapsible}
      active={state.statuses || activeCollapsible}
    >
      <ul className='filters-list'>
        {STATUSES.map(status => {
          return (
            <li key={`status-${status.value}`}>
              <Checkbox

                onChange={() => {
                  if (!filter.status) {
                    filter.status = [
                      {
                        type: 'in',
                        value: state.statuses
                      }
                    ]
                  }
                  if (state.statuses.indexOf(status.value) + 1) {
                    state.statuses.splice(state.statuses.indexOf(status.value), 1)
                  } else {
                    state.statuses.push(status.value)
                  }
                  if (!state.statuses.length) {
                    delete query.filter
                  } else {
                    filter.status[0]['value'] = state.statuses
                    query.filter = filter
                  }
                  this.props.history.push({
                    search: qs.stringify(query)
                  })
                }}

                checked={state.statuses.indexOf(status.value) + 1}
                label={status.label && status.label.id ? intl.formatMessage(status.label) : status.label}
              />
            </li>
          )
        })}
      </ul>
    </Collapsible>
  }
}

Filters.propTypes = {
  disableCollapsible: PropTypes.bool,
  activeCollapsible: PropTypes.bool
}

Filters.defaultProps = {
  disableCollapsible: false,
  activeCollapsible: false
}

export default injectIntl(Filters)

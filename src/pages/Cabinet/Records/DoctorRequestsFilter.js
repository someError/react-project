import React from 'react'
import PropTypes from 'prop-types'
import qs from 'qs'
import moment from 'moment'
import { injectIntl } from 'react-intl'

import Collapsible from '../../../components/Collapsible'
import { Checkbox, DateInput, MaterialInput } from '../../../components/Form'
import { parseSearchString, mergeFilters, getFilterValue } from '../../../util'
import Template from '../../../components/Template'

import commonIntlMessages from '../../../i18n/common-messages'

const DoctorRequestsFilters = ({ location, history, specialties, disableCollapsible, activeCollapsible, intl }) => {
  const query = parseSearchString(location.search)

  const filter = query.filter || {}

  const filterGtDate = getFilterValue(filter, 'recordDate', 'gt')
  const filterLtDate = getFilterValue(filter, 'recordDate', 'lt')

  return <Template>
    <Collapsible
      touchOpened
      className='filter-collapsible'
      triggerClassName='filter-collapsible-trigger'
      title={intl.formatMessage(commonIntlMessages.labelSpecialty)}
      disabled={disableCollapsible}
      active={(query.specialties) || activeCollapsible}
    >
      <ul className='filters-list'>
        { renderFilterSpecialtiesList(specialties, location, history) }
      </ul>
    </Collapsible>
    <Collapsible
      overflow='visible'
      touchOpened
      className='filter-collapsible'
      triggerClassName='filter-collapsible-trigger'
      title={intl.formatMessage(commonIntlMessages.labelDate)}
      active={activeCollapsible || !!(filterGtDate || filterLtDate)}
      disabled={disableCollapsible}
    >
      <div className='columns'>
        <div className='column col-6 filter-date-container'>
          <DateInput
            value={filterGtDate ? moment(filterGtDate).format('DD.MM.YYYY') : ''}
            label={intl.formatMessage(commonIntlMessages.prepositionFrom)}
            iconColor='#D9D9D9'
            onDayChange={(date) => {
              history.push({
                search: qs.stringify({
                  ...query,
                  filter: mergeFilters(filter, {
                    recordDate: [
                      {
                        type: 'gt',
                        value: moment.utc(date).utcOffset('+00:00').startOf('day').format()
                      }
                    ]
                  })
                })
              })
            }}
            dayPickerProps={{
              toMonth: new Date()
            }}
          />
        </div>
        <div className='column col-6 filter-date-container'>
          <DateInput
            value={filterLtDate ? moment(filterLtDate).format('DD.MM.YYYY') : ''}
            label={intl.formatMessage(commonIntlMessages.prepositionUntil)}
            iconColor='#D9D9D9'
            onDayChange={(date) => {
              history.push({
                search: qs.stringify({
                  ...query,
                  filter: mergeFilters(filter, {
                    recordDate: [
                      {
                        type: 'lt',
                        value: moment.utc(date).utcOffset('+00:00').endOf('day').format()
                      }
                    ]
                  })
                })
              })
            }}
            dayPickerProps={{
              // disabledDays: (date) => (filterGtDate ? moment(date).isSameOrBefore(filterGtDate) : true) || moment(date).isAfter(moment()),
              toMonth: new Date()
            }}
          />
        </div>
      </div>
    </Collapsible>
    <Collapsible
      touchOpened
      className='filter-collapsible'
      triggerClassName='filter-collapsible-trigger'
      title={intl.formatMessage(commonIntlMessages.labelPatient)}
      disabled={disableCollapsible}
      active={(location.search && query.patientName) || activeCollapsible}
    >
      <ul className='filters-list'>
        <li>
          <MaterialInput
            label={intl.formatMessage(commonIntlMessages.labelPatientFullName)}
            value={location.search && query.patientName}
            onChange={(e) => {
              if (!e.target.value) delete query.patientName
              history.push({
                search: qs.stringify({
                  ...query,
                  patientName: e.target.value
                })
              })
            }}
          />
        </li>
      </ul>
    </Collapsible>
  </Template>
}

DoctorRequestsFilters.propTypes = {
  disableCollapsible: PropTypes.bool,
  activeCollapsible: PropTypes.bool
}

DoctorRequestsFilters.defaultProps = {
  disableCollapsible: false,
  activeCollapsible: false
}

export default injectIntl(DoctorRequestsFilters)

export const renderFilterSpecialtiesList = (specialties, location, history) => {
  const query = parseSearchString(location.search)

  return specialties.map((s) => <li key={s.id}>
    <Checkbox
      onChange={(e) => {
        if (!query.specialties) query.specialties = []
        if (query.specialties.indexOf(s.id) + 1) {
          query.specialties.splice(query.specialties.indexOf(s.id), 1)
        } else {
          query.specialties.push(s.id)
        }

        history.push({
          search: qs.stringify(query)
        })
      }}
      checked={query.specialties && query.specialties.indexOf(s.id) + 1}
      label={s.name}
    />
  </li>)
}

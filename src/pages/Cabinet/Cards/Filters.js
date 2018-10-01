import React from 'react'
import PropTypes from 'prop-types'
import qs from 'qs'
import moment from 'moment'
import { injectIntl } from 'react-intl'

import Collapsible from '../../../components/Collapsible'
import { Checkbox, DateInput } from '../../../components/Form'
import { parseSearchString, mergeFilters, getFilterValue } from '../../../util'
import Template from '../../../components/Template'
import MediaQuery from '../../../components/MediaQuery'

import commonIntlMessages from '../../../i18n/common-messages'

const Filters = ({ location, history, sections, disableCollapsible, activeCollapsible, intl }) => {
  const query = parseSearchString(location.search)

  const filter = query.filter || {}

  const filterGtDate = getFilterValue(filter, 'recordDate', 'gt')
  const filterLtDate = getFilterValue(filter, 'recordDate', 'lt')

  return <Template>
    <Collapsible
      touchOpened
      className='filter-collapsible'
      triggerClassName='filter-collapsible-trigger'
      title={intl.formatMessage(commonIntlMessages.labelAuthor)}
      disabled={disableCollapsible}
      active={activeCollapsible}
    >
      <ul className='filters-list'>
        <li>
          <Checkbox
            label={intl.formatMessage(commonIntlMessages.labelPrivateRecords)}
            checked={query.author === 'patient'}
            onChange={(e) => {
              history.push({
                search: qs.stringify({
                  ...query,
                  author: e.target.checked ? 'patient' : ''
                })
              })
            }}
          />
        </li>
        <li>
          <Checkbox
            label={intl.formatMessage(commonIntlMessages.labelDoctors)}
            checked={query.author === 'doctor'}
            onChange={(e) => {
              history.push({
                search: qs.stringify({
                  ...query,
                  author: e.target.checked ? 'doctor' : ''
                })
              })
            }}
          />
        </li>
      </ul>
    </Collapsible>
    <Collapsible
      touchOpened
      className='filter-collapsible'
      triggerClassName='filter-collapsible-trigger'
      title={intl.formatMessage(commonIntlMessages.labelSection)}
      active={activeCollapsible || !!query.section}
      disabled={disableCollapsible}
    >
      <ul className='filters-list'>
        {
          renderFilterSectionsList(sections, location, history)
        }
      </ul>
    </Collapsible>

    <MediaQuery rule='(min-width: 1221px)'>
      <Collapsible
        overflow='visible'
        touchOpened
        className='filter-collapsible'
        triggerClassName='filter-collapsible-trigger'
        title={intl.formatMessage(commonIntlMessages.labelDate)}
        active={activeCollapsible || !!(filterGtDate || filterLtDate)}
        disabled={disableCollapsible}
      >
        <div className='form-grid'>
          <div className='columns'>
            <div className='column col-12 filter-date-container'>
              <DateInput
                label={intl.formatMessage(commonIntlMessages.prepositionFrom)}
                value={filterGtDate ? moment(filterGtDate).format('DD.MM.YYYY') : ''}
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
                  disabledDays: (date) => {
                    return moment(date).isAfter(moment())
                  },
                  toMonth: new Date()
                }}
              />
            </div>
            <div className='column col-12 filter-date-container'>
              <DateInput
                label={intl.formatMessage(commonIntlMessages.prepositionUntil)}
                value={filterLtDate ? moment(filterLtDate).format('DD.MM.YYYY') : ''}
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
                  disabledDays: (date) => (filterGtDate ? moment(date).isSameOrBefore(filterGtDate) : true) || moment(date).isAfter(moment()),
                  toMonth: new Date()
                }}
              />
            </div>
          </div>
        </div>
      </Collapsible>
    </MediaQuery>
  </Template>
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

export const renderFilterSectionsList = (sections, location, history) => {
  const query = parseSearchString(location.search)
  const filter = query.filter || {}
  filter.section = filter.section || []

  const sectionsSet = new Set((filter.section[0] && filter.section[0].value) || [])

  return sections.map((s) => <li key={s.id}>
    <Checkbox
      onChange={(e) => {
        const newFilter = { ...filter }

        if (e.target.checked) {
          sectionsSet.add(s.id)
        } else {
          sectionsSet.delete(s.id)
        }

        if (sectionsSet.size < 1) {
          newFilter.section = null
        } else {
          newFilter.section = [{
            type: 'in',
            value: [...sectionsSet]
          }]
        }

        history.push({
          pathname: location.url,
          search: qs.stringify({
            ...query,
            filter: mergeFilters(filter, newFilter)
          })
        })
      }}
      checked={sectionsSet.has(s.id)}
      label={s.name}
    />
  </li>)
}

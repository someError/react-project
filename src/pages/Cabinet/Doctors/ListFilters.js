import React, { Component } from 'react'
import PropTypes from 'prop-types'
import qs from 'qs'
import moment from 'moment'
import classNames from 'classnames'
import { injectIntl } from 'react-intl'

import Collapsible from '../../../components/Collapsible'
import { Checkbox } from '../../../components/Form'
import { parseSearchString } from '../../../util'
import Template from '../../../components/Template'
import FeatherIcon from '../../../components/Icons/FeatherIcon'
import commonIntlMessages from '../../../i18n/common-messages'

class DoctorsFilters extends Component {
  constructor () {
    super()
    this.state = {
      calendarDay: new Date(),
      opened: true
    }
  }

  componentWillReceiveProps (nextProps) {
    if (!(nextProps.location.search === this.props.location.search)) {
      const _search = parseSearchString(nextProps.location.search)
      const _curDate = _search && _search.filter && _search.filter.date
      this.setState({calendarDay: moment(_curDate || new Date()).toDate()})
    }
  }

  componentDidMount () {
    const _search = parseSearchString(this.props.location.search)
    const _curDate = _search && _search.filter && _search.filter.date
    this.setState({calendarDay: moment(_curDate || new Date()).toDate()})
  }

  render () {
    const { props } = this
    const { location, history, disableCollapsible, activeCollapsible, intl } = this.props
    const query = parseSearchString(location.search)

    return <Template>
      {/*<div className='filter-row'>*/}
        {/*<div className={`filter-row__item ${classNames({'active': query.favorite})}`}>*/}
          {/*<span onClick={() => {*/}
            {/*if (query.favorite) {*/}
              {/*delete query.favorite*/}
            {/*} else {*/}
              {/*query.favorite = true*/}
            {/*}*/}
            {/*this.props.history.push({*/}
              {/*search: qs.stringify({*/}
                {/*...query*/}
              {/*})*/}
            {/*})*/}
          {/*}}*/}
          {/*>*/}
            {/*<FeatherIcon icon='heart' size={20} />*/}
            {/*{intl.formatMessage(commonIntlMessages.favoriteDoctors)}*/}
          {/*</span>*/}
        {/*</div>*/}
      {/*</div>*/}

      <Collapsible
        touchOpened
        className='filter-collapsible'
        triggerClassName='filter-collapsible-trigger'
        title={intl.formatMessage(commonIntlMessages.labelSpecialty)}
        disabled={disableCollapsible}
        // active={activeCollapsible}
        active={this.state.opened}
      >
        <ul className='filters-list'>
          { renderFilterSpecialtiesList(props.specialties, location, history) }
        </ul>
      </Collapsible>
    </Template>
  }
}

DoctorsFilters.propTypes = {
  disableCollapsible: PropTypes.bool,
  activeCollapsible: PropTypes.bool
}

DoctorsFilters.defaultProps = {
  disableCollapsible: false,
  activeCollapsible: false
}

export default injectIntl(DoctorsFilters)

export const renderFilterSpecialtiesList = (specialties, location, history) => {
  const query = parseSearchString(location.search)

  return specialties.map((s) => <li key={s.id}>
    <Checkbox
      onChange={() => {
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

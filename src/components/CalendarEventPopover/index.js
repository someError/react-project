import React, { Component, Children } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { withRouter, matchPath } from 'react-router'
import { createPortal } from 'react-dom'
import Popper from 'popper.js'
import moment from 'moment'
import includes from 'lodash/includes'
import { injectIntl } from 'react-intl'

import Template from '../Template'

import './CalendarEventPopover.css'
import FeatherIcon from '../Icons/FeatherIcon'
import api from '../../api'
import { noop } from '../../util'

import commonIntlMessages from '../../i18n/common-messages'

class CalendarEventPopover extends Component {
  constructor () {
    super()

    this.state = {
      show: false
    }

    this.toggleClick = this.toggleClick.bind(this)
    this.hide = this.hide.bind(this)
    this.documentClick = this.documentClick.bind(this)
  }

  documentClick (e) {
    if (!this.props.disabled && !this.pop.contains(e.target) && this.state.show) {
      this.hide(e)
    }
  }

  hide (e) {
    if (this.props.disabled) return
    this.setState({
      show: false
    })
  }

  toggleClick (e) {
    if (this.props.disabled) return

    e.stopPropagation()
    e.nativeEvent.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()

    this.setState({
      show: !this.state.show
    })
  }

  componentDidUpdate (nextProps, nextState) {
    if (nextState.show !== this.state.show) {
      this.popper.update()
    }
  }

  componentDidMount () {
    this.popper = new Popper(this.root, this.pop, {
      placement: 'top',
      modifiers: {
        flip: {
          behavior: ['top', 'bottom', 'left', 'right']
        },
        preventOverflow: {
          padding: 10
        }
      }
    })

    document.body.addEventListener('click', this.documentClick, true)
  }

  componentWillUnmount () {
    this.popper.destroy()

    document.body.removeEventListener('click', this.documentClick, true)
  }

  render () {
    const { event, disabled, intl } = this.props

    const match = matchPath(this.props.location.pathname, {
      path: '/cabinet/patients/:patientId/events/calendar'
    })

    let showPopover

    if (disabled) {
      showPopover = false
    } else {
      showPopover = this.state.show
    }

    return <Template>
      { React.cloneElement(Children.only(this.props.children), { style: { cursor: 'pointer' }, onClick: this.toggleClick, ref: (root) => { this.root = root } }) }

      {
        createPortal(<div
          style={{visibility: showPopover ? '' : 'hidden', zIndex: 50}}
          ref={(pop) => { this.pop = pop }}
          className='calendar-event-popover'
        >
          <span onClick={this.hide} className='calendar-event-popover__close'><FeatherIcon icon='x' /></span>

          <h5 className='calendar-event-popover__title'><Link to={`/cabinet/${match ? `patients/${match.params.patientId}/` : ''}events/list/${event.id}`}>{ event.eventGroup.title }</Link></h5>
          <div className='calendar-event-popover__datetime'><span className='calendar-event-popover__datetime__label'>{ intl.formatMessage(commonIntlMessages.labelDateTime) }:</span> { moment(event.startTime).format('DD.MM.YYYY в HH:mm') }</div>
          { event.text && <div className='calendar-event-popover__text'>{ event.eventGroup.text }</div> }

          <div className='calendar-event-popover__actions'>
            {/* { */}
            {/* includes(event.userAccesses, 'edit') */}
            {/* ? <span className='calendar-event-popover__actions__item'> */}
            {/* <FeatherIcon size={18} icon={'edit-2'} /> Изменить */}
            {/* </span> */}
            {/*: null */}
            {/* } */}

            {
              includes(event.userAccesses, 'delete')
                ? <span onClick={() => { api.deleteEvent(event.id).then(this.props.onRemoved) }} className='calendar-event-popover__actions__item'>
                  <FeatherIcon size={18} icon={'trash-2'} /> { intl.formatMessage(commonIntlMessages.remove) }
                </span>
                : null
            }
          </div>
        </div>, document.body)
      }
    </Template>
  }
}

CalendarEventPopover.propTypes = {
  disabled: PropTypes.bool,
  event: PropTypes.object,
  onRemoved: PropTypes.func
}

CalendarEventPopover.defaultProps = {
  onRemoved: noop
}

export default injectIntl(withRouter(CalendarEventPopover))

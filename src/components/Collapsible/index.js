import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import MediaQuery from '../MediaQuery'

import './Collapsible.css'

// TODO: отделить стили, ввести проп disabled

class Collapsible extends PureComponent {
  constructor ({ active }) {
    super()

    this.state = {
      active
    }
  }

  toggle () {
    if (this.props.disabled || this.state.disabled) {
      return
    }

    this.setState({
      active: !this.state.active,
      opened: false
    })
  }

  render () {
    const { active, opened } = this.state
    console.log(opened, 'opened')
    const { title, children, className, triggerClassName, bodyClassName, renderTrigger } = this.props
    const disabled = this.props.disabled || this.state.disabled

    return <div className={classNames('collapsible', { 'collapsible--active': active }, className)}>
      <div
        className={classNames('collapsible-trigger', { 'collapsible-trigger--disabled': disabled }, triggerClassName)}
        onClick={() => { this.toggle() }}
      >
        { renderTrigger(title, active) }
      </div>

      <div
        onTransitionEnd={(e) => {
          this.setState({
            opened: active
          })
        }}
        style={{ overflow: opened ? this.props.overflow : null }}
        className={classNames('collapsible-body', { 'collapsible-body--active': active }, bodyClassName)}
      >
        { children }
      </div>
      {
        this.props.touchOpened &&
        <MediaQuery rule='(max-width: 1220px)' onChange={() => this.setState({active: true, disabled: true})} />
      }

      {
        this.props.touchOpened && !this.props.disabled &&
        <MediaQuery rule='(min-width: 1221px)' onChange={() => this.setState({disabled: false})} />
      }
    </div>
  }
}

Collapsible.propTypes = {
  active: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  bodyClassName: PropTypes.string,
  triggerClassName: PropTypes.string,
  renderTrigger: PropTypes.func,
  overflow: PropTypes.string
}

Collapsible.defaultProps = {
  disabled: false,
  className: '',
  bodyClassName: '',
  triggerClassName: '',
  renderTrigger: (title) => {
    return title
  },
  overflow: 'auto'
}

export default Collapsible

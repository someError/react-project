import React, { PureComponent } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Transition } from 'react-transition-group'

import { Fade } from '../Transitions'

import { noop } from '../../util'

import './Drawer.css'

class Drawer extends PureComponent {
  constructor () {
    super()

    // this.el = document.createElement('div')
    this.state = {
      items: [{key: 'a', size: 10}, {key: 'b', size: 20}, {key: 'c', size: 30}]
    }
  }

  componentDidMount () {
    document.body.classList.add('has-drawer')
    this.children = this.props.children
    // document.body.appendChild(this.el)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.isOpen) {
      document.body.classList.add('drawer-opened')
    } else {
      document.body.classList.remove('drawer-opened')
    }
  }

  // componentWillUnmount () {
  //   document.body.removeChild(this.el)
  // }

  render () {
    const { isOpen, onCloseRequest, className, right } = this.props

    return ReactDOM.createPortal(
      <div className={classNames('drawer-container', className)}>
        <Transition
          in={isOpen}
          timeout={0}
          appear
        >
          {
            (state) => <div className={`drawer slide slide-${state} ${right ? 'slide--right' : null}`}>{this.props.children}</div>
          }
        </Transition>

        <Fade in={isOpen}>
          <span><div className={`drawer-overlay`} onClick={onCloseRequest} /></span>
        </Fade>

      </div>
      , document.body)
  }
}

Drawer.propTypes = {
  isOpen: PropTypes.bool,
  onCloseRequest: PropTypes.func
}

Drawer.defaultProps = {
  isOpen: false,
  onCloseRequest: noop
}

export default Drawer

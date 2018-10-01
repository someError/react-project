import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'

import FeatherIcon from '../Icons/FeatherIcon'
import MediaQuery from '../MediaQuery'

import './Modal.css'

class Modal extends Component {
  componentDidMount () {
    document.body.classList.add('portal-opened')
  }

  componentWillUnmount () {
    document.body.classList.remove('portal-opened')
  }

  render () {
    const { className, containerClassName, onRequestClose, style, children } = this.props

    return ReactDOM.createPortal(
      <div style={style} className={classNames('modal active', className)}>
        <div className='modal-overlay' onClick={onRequestClose} />
        <div className={classNames('modal-container', containerClassName)}>
          <span className='modal-close' onClick={onRequestClose}>
            <MediaQuery rule='(min-width: 656px)'>
              <FeatherIcon icon={'x'} size={40} />
            </MediaQuery>
            <MediaQuery rule='(max-width: 655px)'>
              <FeatherIcon icon={'x'} size={30} />
            </MediaQuery>
          </span>
          { children }
        </div>
      </div>
      , document.body)
  }
}

export default Modal

const ModalHeader = ({ className, ...props }) => {
  return <div className={`modal-header ${className || ''}`} {...props} />
}

export { ModalHeader }

const ModalBody = ({ className, ...props }) => {
  return <div className={`modal-body ${className || ''}`} {...props} />
}

export { ModalBody }

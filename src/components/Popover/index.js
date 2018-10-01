import React, { Children, PureComponent } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Drop from 'tether-drop'

import Template from '../Template'

import './Popover.css'

class Popover extends PureComponent {
  constructor () {
    super()

    this.content = document.createElement('div')
  }

  createDrop () {
    const {
      position,
      openOn,
      constrainToWindow,
      constrainToScrollParent,
      classes,
      hoverOpenDelay,
      hoverCloseDelay,
      focusDelay,
      blurDelay,
      tetherOptions
    } = this.props

    // ReactDOM.render(content, this.content)

    this._drop = new Drop({
      target: this.target,
      content: this.content,
      position,
      openOn,
      constrainToWindow,
      constrainToScrollParent,
      classes: classNames(classes, 'drop-theme-phr'),
      hoverOpenDelay,
      hoverCloseDelay,
      focusDelay,
      blurDelay,
      tetherOptions
    })
  }

  componentDidMount () {
    // document.body.appendChild(this.content)

    this.createDrop()

    // this._drop.open()
  }

  componentWillUnmount () {
    this._drop.destroy()
    // document.body.removeChild(this.content)
  }

  render () {
    const child = Children.only(this.props.children)

    const Portal = ReactDOM.createPortal(
      <div onClick={() => { if (this.props.closeOnClick) this._drop.close() }}>
        { child }
      </div>
      , this.content
    )

    return <Template>
      <span
        className={classNames(this.props.className)}
        ref={(t) => { this.target = t }}
      >
        { this.props.label }
      </span>
      { Portal }
    </Template>

    // return <Template>
    //   <span ref={(t) => { this.target = t }}>{ this.props.children }</span> { Portal }
    // </Template>
  }
}

Popover.propTypes = {
  position: PropTypes.string,
  openOn: PropTypes.string,
  constrainToWindow: PropTypes.bool,
  constrainToScrollParent: PropTypes.bool,
  classes: PropTypes.string,
  hoverOpenDelay: PropTypes.number,
  hoverCloseDelay: PropTypes.number,
  focusDelay: PropTypes.number,
  blurDelay: PropTypes.number,
  tetherOptions: PropTypes.object,
  // content: PropTypes.node.isRequired,
  closeOnClick: PropTypes.bool
}

Popover.defaultProps = {
  position: 'bottom center',
  openOn: 'click',
  constrainToWindow: true,
  constrainToScrollParent: true,
  classes: '',
  hoverOpenDelay: 0,
  hoverCloseDelay: 50,
  focusDelay: 0,
  blurDelay: 50,
  tetherOptions: {}
}

export default Popover

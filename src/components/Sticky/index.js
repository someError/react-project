import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import stickybits from 'stickybits'

import './Sticky.css'

class Sticky extends PureComponent {
  componentDidMount () {
    this.stick = stickybits(this.root, {
      stickyBitStickyOffset: this.props.offset,
      useStickyClasses: false
    })
  }

  componentWillUnmount () {
    if (this.stick) {
      this.stick.cleanup()
    }
  }

  render () {
    const { children, className } = this.props

    return <div ref={(root) => { this.root = root }} className={classNames(`sticky`, className)}>
      { children }
    </div>
  }
}

Sticky.propTypes = {
  offset: PropTypes.number
}

export default Sticky

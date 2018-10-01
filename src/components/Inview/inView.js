import React, { PureComponent } from 'react'
import ReactDOM from 'react-dom'
import { noop } from '../../util'

const inView = (WrappedComponent) => {
  class InView extends PureComponent {
    constructor () {
      super()

      this.handler = this.handler.bind(this)

      this.observer = new IntersectionObserver(this.handler)
    }

    handler (entries) {
      const el = entries[0]

      if (el.intersectionRatio > 0) {
        this.props.onEnter()
      } else {
        this.props.onLeave()
      }
    }

    componentDidMount () {
      this.observer.observe(ReactDOM.findDOMNode(this))
    }

    componentWillUnmount () {
      this.observer.unobserve(ReactDOM.findDOMNode(this))
      this.observer.disconnect()
    }

    render () {
      return <WrappedComponent {...this.props} />
    }
  }

  InView.defaultProps = {
    onEnter: noop,
    onLeave: noop
  }

  return InView
}

export default inView

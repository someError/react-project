import React, { PureComponent } from 'react'

const withPreviousLocation = (WrappedComponent) => {
  return class WithPrevLocation extends PureComponent {
    constructor (props) {
      super()

      // this.previousLocation = props.location

      this.state = {
        previousLocation: props.location
      }
    }

    componentWillUpdate (nextProps) {
      if (
        nextProps.history.action !== 'POP'
      ) {
        this.setState({
          previousLocation: this.props.location
        })
      }
    }

    render () {
      return <WrappedComponent previousLocation={this.previousLocation} {...this.props} />
    }
  }
}

export default withPreviousLocation

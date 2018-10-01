import React, { Component } from 'react'
import PropTypes from 'prop-types'

class PatientParamsProvider extends Component {
  getChildContext () {
    console.log(this.props)
    return {
      patientParams: this.props.patientParams
    }
  }

  render () {
    return this.props.children
    // return React.Children.map(this.props.children, (child) => React.cloneElement(child, this.props))
  }
}

PatientParamsProvider.childContextTypes = {
  patientParams: PropTypes.array
}

export default PatientParamsProvider

const withPatientParams = (WrappedComponent) => {
  let comp = function (props, context) { return <WrappedComponent {...props} patientParams={context.patientParams} /> }
  comp.componentName = 'Wat'

  comp.contextTypes = {
    patientParams: PropTypes.array
  }

  return comp
}

export { withPatientParams }

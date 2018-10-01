import React, { Component } from 'react'
import PropTypes from 'prop-types'

class PatientProvider extends Component {
  getChildrenContext () {
    return {
      patientId: this.props.id,
      patientCardId: this.props.cardId
    }
  }

  render () {
    return this.props.children
  }
}

PatientProvider.childContextTypes = {
  id: PropTypes.string.required,
  cardId: PropTypes.string.required
}

export default PatientProvider

const withPatient = (WrappedComponent, context) => {
  return <WrappedComponent {...context} />
}

withPatient.contextTypes = {
  patientId: PropTypes.string.required,
  patientCardId: PropTypes.string.required
}

export { withPatient }

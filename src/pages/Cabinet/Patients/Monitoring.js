import React from 'react'
import { connect } from 'react-redux'
import { Route } from 'react-router-dom'
import Spinner from '../../../components/Loader/Spinner'
import Chart from '../Monitoring/Chart'
import List from '../Monitoring/List'

const Monitoring = (props) => {
  const { patientId } = props
  const { cardId } = props.match.params

  return <div>
    <Route exact path={`${props.match.url}`} render={(pr) => !props.parameters || !props.parameters.length ? <Spinner /> : <Chart cardId={cardId} patientId={patientId} {...pr} />} />
    <Route exact path={`${props.match.url}/list`} render={(pr) => <List cardId={cardId} patientId={patientId} {...pr} />} />
  </div>
}

const mapStateToProps = ({ reference }) => {
  return {
    parameters: reference.parameters
  }
}

export default connect(mapStateToProps)(Monitoring)

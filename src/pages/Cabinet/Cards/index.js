import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Route, Switch, Redirect } from 'react-router-dom'

import CardRecords from './CardRecords'
import Template from '../../../components/Template'
import { ModalRoute } from '../../../components/Router'
import { RecordEdit } from './Form/RecordForm'

import ForRoles from '../../../components/ForRoles'
import CardAccess from './CardAccess'
import CardRecord from './CardRecord'

class Cards extends Component {
  constructor (props) {
    super()

    this.previousLocation = props.location
  }

  componentWillUpdate (nextProps) {
    const { location } = this.props
    // set previousLocation if props.location is not modal
    if (
      nextProps.history.action !== 'POP' &&
      (!location.state || !location.state.modal)
    ) {
      this.previousLocation = this.props.location
    }
  }

  render () {
    const { match, location, user, cardAccess } = this.props
    const isModal = (
      location.state &&
      location.state.modal &&
      this.previousLocation !== location // not initial render
    )

    return <Template>
      {
        user.entity_type === 'patient' && location.pathname === '/cabinet/cards'
          ? <Redirect to={`${match.url}/${user.card.id}`} />
          : null
      }
      <Switch location={isModal ? this.previousLocation : location}>
        <Route exact path={`${match.url}`} render={() => <div>cards</div>} />
        <Route exact path={`${match.url}/:cardId/records`} render={(props) => <CardRecords cardAccess={cardAccess} patientId={this.props.patientId || user.id} cardId={props.match.params.cardId} {...props} />} />
        <Route exact path={`${match.url}/:cardId/records/:recordId`} render={(props) => <CardRecord key={props.match.params.recordId} cardId={props.match.params.cardId} {...props} />} />
        <ForRoles allow={['patient']}>
          <Route exact path={`${match.url}/:cardId/access`} component={CardAccess} />
        </ForRoles>
      </Switch>

      <Route
        path={`${match.url}/:cardId/records`}
        render={({ match }) => {
          const { cardId } = match.params

          return <ModalRoute
            isModal
            prevLocation={this.previousLocation}
            path={`${match.url}/:recordId/edit`}
            render={(props) => {
              return <RecordEdit cardId={cardId} recordId={props.match.params.recordId} {...props} />
            }}
          />
        }}
      />

      {/* <ModalRoute exact isModal path={`${match.url}/:cardId/records/add`} component={RecordAdd} /> */}
    </Template>
  }
}

Cards.defaultProps = {
  cardAccess: 'read_write'
}

export default connect(({ user }) => ({ user }))(Cards)

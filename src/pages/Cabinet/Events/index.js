import React from 'react'
import { connect } from 'react-redux'
import { Route, Redirect } from 'react-router-dom'
import List from './List'
import EventsCalendar from './Calendar'
import TasksLists from './TasksLists'
import TaskLines from './TaskLines'
import ListItem from './ListItem'

const Events = ({ match, user, patientId, cardId }) => {
  patientId = patientId || user.id
  cardId = cardId || user.card.id

  return <div>
    <Route exact path={`${match.url}`} render={() => <Redirect to={`${match.url}/list`} />} />
    <Route exact path={`${match.url}/list`} render={(props) => <List baseUrl={match.url} cardId={cardId} patientId={patientId} {...props} />} />

    <Route exact path={`${match.url}/list/group/:eventsGroupId`} render={(props) => <List key={props.location.key} baseUrl={match.url} cardId={cardId} patientId={patientId} {...props} />} />

    <Route exact path={`${match.url}/list/:eventId`} render={(props) => <ListItem key={props.location.key} cardId={cardId} patientId={patientId} {...props} />} />
    <Route exact path={`${match.url}/list/:eventId/edit`} render={(props) => <ListItem key={props.location.key} cardId={cardId} edit patientId={patientId} {...props} />} />

    <Route path={`${match.url}/taskslists`} render={(props) => <TasksLists cardId={cardId} patientId={patientId} {...props} />} />
    <Route path={`${match.url}/taskslines`} component={(props) => <TaskLines cardId={cardId} patientId={patientId} {...props} />} />

    <Route path={`${match.url}/calendar`} render={(props) => <EventsCalendar cardId={cardId} patientId={patientId} {...props} />} />
  </div>
}

export default connect(({ user }) => ({ user }))(Events)

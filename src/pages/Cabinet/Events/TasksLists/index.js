import React from 'react'
import { Route, Switch } from 'react-router-dom'
import List from './List'
import TasksList from './TasksList'

const TasksLists = ({ match, patientId }) => {
  return <div>
    <Switch>
      <Route exact path={`${match.url}`} render={(props) => <List patientId={patientId} {...props} />} />
      <Route path={`${match.url}/:taskListId`} render={(props) => <TasksList key={props.location.key} {...props} patientId={patientId} />} />
    </Switch>
  </div>
}

export default TasksLists

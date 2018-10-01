import React, {Component} from 'react'
import { Route } from 'react-router-dom'
import classNames from 'classnames'
import Template from '../../../components/Template'
import ScheduleMain from './ScheduleMain'
import ScheduleAdd from './ScheduleAdd'
import ScheduleRecord from './ScheduleRecord'
import { ModalRoute } from '../../../components/Router'

class Schedule extends Component {
  render () {
    const { match } = this.props
    return <Template>
      <Route path={`${match.url}`} component={ScheduleMain} />
      <ModalRoute
        modalContainerClassName={'add-form-content'}
        closeUrl={match.url + classNames(this.props.location.search)}
        path={`${match.url}/add`}
        component={ScheduleAdd}
      />
      <ModalRoute
        modalContainerClassName={'add-form-content'}
        closeUrl={match.url + classNames(this.props.location.search)}
        path={`${match.url}/edit/:id`}
        component={ScheduleAdd}
      />
      <ModalRoute
        modalContainerClassName={'add-form-content'}
        closeUrl={match.url + classNames(this.props.location.search)}
        path={`${match.url}/record`}
        component={ScheduleRecord}
      />
      {/* <ModalRoute */}
      {/* modalContainerClassName={'add-form-content'} */}
      {/* closeUrl={match.url} */}
      {/* path={`${match.url}/:id`} */}
      {/* component={ScheduleDetail} */}
      {/* /> */}
    </Template>
  }
}

export default Schedule

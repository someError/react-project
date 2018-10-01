import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Card, CardHeader, CardBody } from '../../../../components/Card'
import { Tile, TileContent } from '../../../../components/Tile'
import UserIdentity from '../../../../components/Avatar/UserIdentity'

import api from '../../../../api'
import { Checkbox } from '../../../../components/Form'
import { noop, taskListToSend } from '../../../../util'

class TaskCard extends Component {
  updateList (data) {
    this.req = api.putTasksList(this.props.id, this.props.patient.id, { ...data })

    return this.req
  }

  render () {
    const { author, tasks, title } = this.props

    return <Card>
      <CardHeader>
        <Tile centered>
          <TileContent>
            <UserIdentity
              user={author}
              size={'sm'}
            />
          </TileContent>
        </Tile>
      </CardHeader>

      <CardBody>
        <h3 className='record-title'>{ title }</h3>
        {
          tasks.map((task, i) => {
            return <div key={task.id}>
              <Checkbox
                onChange={(e) => {
                  const d = taskListToSend(this.props)

                  d.tasks[i].completed = !e.target.value

                  this.updateList(d)
                    .then(({ data: { data } }) => { this.props.onChange(data) })
                }}
                defaultChecked={task.completed}
                label={task.title}
              />
              <div>{ task.comment }</div>
            </div>
          })
        }
      </CardBody>
    </Card>
  }
}

TaskCard.propsTypes = {
  onChange: PropTypes.func
}

TaskCard.defaultProps = {
  onChange: noop
}

export default TaskCard

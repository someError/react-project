import React, { Component } from 'react'
import classNames from 'classnames'
import { Link } from 'react-router-dom'
import { injectIntl } from 'react-intl'

import api from '../../../api'
import { Card, CardBody } from '../../../components/Card'
import { Tile, TileContent, TileAction } from '../../../components/Tile'
import Button from '../../../components/Button'
import withUser from '../../../redux/util/withUser'
import Modal, { ModalBody, ModalHeader } from '../../../components/Modal'
import Checkbox from '../../../components/Form/Checkbox'
import FeatherIcon from '../../../components/Icons/FeatherIcon'

import './TaskLines.css'
import Spinner from '../../../components/Loader/Spinner'
import Template from '../../../components/Template'
import AddTaskLineForm from './Form/AddTaskLineForm'

import commonIntlMessages from '../../../i18n/common-messages'

const filterTemplates = (taskLines = [], templates = []) => {
  return templates.filter((temp) => {
    return !taskLines.find((line) => {
      return line.taskLineTemplate.id === temp.id
    })
  })
}

class TaskLines extends Component {
  constructor () {
    super()

    this.state = {
      loading: true,
      templates: [],
      taskLines: [],
      showPostForm: false,
      formData: {}
    }
  }

  componentDidMount () {
    this.req = api.getTaskLines(this.props.patientId || this.props.user.id)

    this.setState({
      loading: true
    })

    this.req.then(({data: {data}}) => {
      this.setState({
        taskLines: data.items
      })

      this.templatesReq = api.getTaskLinesTemplates()
      this.templatesReq.then(({data: {data}}) => {
        this.setState({
          templates: data.items,
          loading: false
        })
      })
    })
  }

  componentWillUnmount () {
    if (this.req) {
      this.req.cancel()
    }

    if (this.templatesReq) {
      this.templatesReq.cancel()
    }
  }

  deleteTasksLine (id) {
    api.deleteTaskLine(id)
      .then(() => {
        this.setState({
          taskLines: this.state.taskLines.filter((line) => line.id !== id)
        })
      })
  }

  render () {
    const { intl } = this.props

    return <div>
      <div className='page-header'>
        <h1>{ intl.formatMessage(commonIntlMessages.tasksLinesTitle) }</h1>
      </div>

      {
        this.loading
          ? <Spinner />
          : <Template>
            {
              this.state.taskLines.map((line) => {
                return <Card key={line.id}>
                  <CardBody>
                    <Tile>
                      <TileContent>
                        <h4>{ line.title }</h4>
                      </TileContent>

                      {
                        this.props.user && line.author.id === this.props.user.id
                          ? <TileAction className='task-lines-actions'>
                            <span onClick={() => {
                              this.deleteTasksLine(line.id)
                            }}>
                              <FeatherIcon size={15} icon='power' />
                            </span>
                          </TileAction>
                          : null
                      }

                    </Tile>

                    <ul className='events-group-list'>
                      {
                        line.taskLists.map((item) => {
                          const eventsCount = item.eventGroups.reduce((res, group) => {
                            res.totalEvents += group.info.eventsCount
                            res.completedEvents += group.info.completedEventsCount
                            return res
                          }, { totalEvents: 0, completedEvents: 0 })

                          const isCompleted = eventsCount.completedEvents === eventsCount.totalEvents

                          return <li className={classNames({'color-gray': isCompleted})} key={item.id}>
                            <Checkbox checked={isCompleted} disabled />{' '}
                            <Link to={`/cabinet/${this.props.user.entity_type === 'doctor' ? `patients/${this.props.patientId}/` : ''}events/taskslists/${item.id}`} className={classNames('events-group-list__title', {completed: isCompleted})}>{item.title}</Link>{' '}
                            <span className='text-xs'>{eventsCount.completedEvents} / {eventsCount.totalEvents}</span>
                          </li>
                        })
                      }
                    </ul>
                  </CardBody>
                </Card>
              })
            }

            {
              filterTemplates(this.state.taskLines, this.state.templates).map((template) => {
                return <Card key={template.id}>
                  <CardBody>
                    <Tile centered>
                      <TileContent>
                        <h4>{ template.title }</h4>
                      </TileContent>
                      <TileAction>
                        <Button
                          onClick={() => {
                            this.setState({
                              showPostForm: template.id
                            })
                          }}
                          size='sm'
                        >
                          { intl.formatMessage(commonIntlMessages.turnOn) }
                        </Button>
                      </TileAction>
                    </Tile>
                  </CardBody>
                </Card>
              })
            }
          </Template>
      }

      {
        (this.state.showPostForm && this.state.templates.length > 0) && <Modal
          onRequestClose={() => {
            this.setState({
              showPostForm: false,
              formData: {}
            })
          }}
        >
          <ModalHeader>
            <h1>{ intl.formatMessage(commonIntlMessages.tasksLinesAdd) }</h1>
          </ModalHeader>
          <ModalBody>
            <AddTaskLineForm
              onSuccess={(line) => {
                document.location.assign(document.location.href)

                // const { taskLines } = this.state
                //
                // taskLines.push(line)
                //
                // this.setState({
                //   showPostForm: false,
                //   formData: {},
                //   taskLines
                // })
              }}
              patientId={this.props.patientId || this.props.user.id}
              templateId={this.state.showPostForm}
              templates={this.state.templates}
              data={this.state.formData}
            />
          </ModalBody>
        </Modal>
      }

    </div>
  }
}

export default injectIntl(withUser(TaskLines))

import React, { Component } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { Link } from 'react-router-dom'
import cloneDeep from 'lodash/cloneDeep'
import moment from 'moment'
import { injectIntl, defineMessages } from 'react-intl'

import {
  SortableContainer,
  SortableElement,
  SortableHandle,
  arrayMove
} from 'react-sortable-hoc'

import { Card } from '../../../../components/Card'
import Checkbox from '../../../../components/Form/Checkbox'
import { Tile, TileAction, TileContent } from '../../../../components/Tile'
import FeatherIcon from '../../../../components/Icons/FeatherIcon'

import './TasksLists.css'
import Button from '../../../../components/Button'
import { showAddModal } from '../../../../redux/modals/actions'
import api from '../../../../api'
import Spinner from '../../../../components/Loader/Spinner'
import EventForm from '../Form'
import Modal, { ModalHeader } from '../../../../components/Modal'
import { mapGroupsToSend } from '../../../../util'
import Avatar from '../../../../components/Avatar/Avatar'
import TileIcon from '../../../../components/Tile/TileIcon'

import commonIntlMessages from '../../../../i18n/common-messages'

const intlMessages = defineMessages({
  expired: {
    id: 'task_list.expired',
    defaultMessage: 'просрочено'
  },
  addEventToTaskList: {
    id: 'task_list.add_event_to_task_list',
    defaultMessage: 'Добавить дело в список дел'
  },
  finishBefore: {
    id: 'task_list.finish_before',
    defaultMessage: 'Завершить до'
  }
})

const SortableList = SortableContainer(({children}) => {
  return (
    <div className='events-sortable'>
      {children}
    </div>
  )
})

const DragHandle = SortableHandle(() => <span className='drag-handle' />)

const SortableItem = SortableElement(({children}) => {
  return (
    <div className='events-sortable__item'>
      <DragHandle />
      {children}
    </div>
  )
})

class Group extends Component {
  constructor () {
    super()

    this.state = {
      title: '',
      eventGroups: [],
      loading: true,
      showEventForm: false
    }
  }

  getTaskList () {
    api.getTaskList(this.props.match.params.taskListId)
      .then(({ data: { data } }) => {
        this.setState({
          ...data,
          loading: false
        })
      })
  }

  componentDidMount () {
    this.getTaskList()
  }

  deleteTaskList () {
    api.deleteTaskList(this.props.match.params.taskListId)
      .then(() => {
        this.props.history.replace(this.props.user.entity_type === 'patient' ? `/cabinet/events/taskslists` : `/cabinet/patients/${this.props.patientId}/events/taskslists`)
      })
  }

  patchList (eventGroups) {
    api.putTaskList(this.props.match.params.taskListId, { taskList: { ...this.state, patient: this.props.patientId, eventGroups } })
      .then(({ data: { data } }) => {
        this.setState({
          ...data
        })
      })
  }

  render () {
    const { intl } = this.props

    if (this.state.loading) {
      return <Spinner />
    }

    return <div>
      <header className='page-header'>
        <h2 style={{ marginBottom: '10px' }}>{ this.state.title } <span className='events-sortable__item__action' onClick={() => { this.deleteTaskList() }}><FeatherIcon icon='trash-2' size={22} /></span></h2>
        <div>
          <Avatar src={this.state.author.avatar && this.state.author.avatar.url} size={'sm'} initial={`${(this.state.author.firstName || ' ')[0]}${(this.state.author.lastName || ' ')[0]}`} />{' '}
          <span className='color-blue' style={{ verticalAlign: 'middle' }}>{ this.state.author.firstName } { this.state.author.lastName }</span>{' '}
          { this.state.deadlineTime && <span style={{ verticalAlign: 'middle' }} className={`color-gray ${moment().diff(this.state.deadlineTime, 'days') ? 'color-red' : ''}`}>{ intl.formatMessage(intlMessages.finishBefore) } { moment(this.state.deadlineTime).format('DD.MM.YYYY') }</span> }
        </div>
      </header><br /><br />
      <Card>
        <SortableList
          useDragHandle
          lockToContainerEdges
          onSortEnd={({ oldIndex, newIndex }) => {
            let eventGroups = arrayMove(this.state.eventGroups, oldIndex, newIndex)

            eventGroups.forEach((eg, i) => {
              eg.position = i
            })

            this.setState({
              eventGroups
            })

            this.patchList(mapGroupsToSend(this.state.eventGroups))
          }}
        >
          {
            this.state.eventGroups.map((e, i) => {
              let latestMoment
              const { info } = e

              let isOverdue = info.expiredEventsCount > 0

              return <SortableItem index={i} key={e.id}>
                <Tile>
                  <TileIcon>
                    <Checkbox
                      onChange={() => {
                        let eventGroups = cloneDeep(this.state.eventGroups)
                        eventGroups = mapGroupsToSend(eventGroups).map((eg) => {
                          if (eg.id === e.id) {
                            eg.completed = !e.completed
                          }

                          return eg
                        })

                        this.patchList(eventGroups)
                      }}
                      checked={e.completed}
                    />
                  </TileIcon>
                  <TileContent style={{ paddingTop: '2px' }}>
                    <Link className='events-group-list__title' to={`/cabinet/${this.props.user.entity_type === 'doctor' ? `patients/${this.props.patientId}/` : ''}events/list/group/${e.id}`}>{ e.title }</Link> { info.eventsCount > 0 && <span className='text-sm color-gray'>{ info.completedEventsCount }/{ info.eventsCount } { e.expiredEventsCount && <span className='color-red'>({ e.expiredEventsCount } { intl.formatMessage(intlMessages.expired) })</span> }</span> }{' '}
                    {/* <span className='events-sortable__item__action'><FeatherIcon size={17} icon='edit-2' /></span> */}
                    {/* <span className='events-sortable__item__action'><FeatherIcon size={22} icon='x' /></span> */}
                  </TileContent>
                  {
                    latestMoment
                      ? <TileAction>
                        <span className={classNames('text-xs', { 'color-red': isOverdue, 'color-gray': !isOverdue })}>{ isOverdue ? <FeatherIcon size={18} icon={'alert-circle'} /> : null } { latestMoment.format('DD.MM.YYYY') }</span>
                      </TileAction>
                      : null
                  }
                </Tile>
              </SortableItem>
            })
          }
        </SortableList>

        <div className='events-sortable__item'>
          <Button size='sm' onClick={() => { this.setState({ showEventForm: true }) }}>{ intl.formatMessage(commonIntlMessages.addEventBtn) }</Button>
        </div>

        {
          this.state.showEventForm
            ? <Modal
              onRequestClose={() => {
                this.setState({
                  showEventForm: false
                })
              }}
            >
              <ModalHeader>
                <h1>{ intl.formatMessage(intlMessages.addEventToTaskList) } «{ this.state.title }»</h1>
              </ModalHeader>
              <EventForm
                onSuccess={(data) => {
                  this.getTaskList()

                  this.setState({
                    showEventForm: false
                  })
                }}
                patientId={this.props.patientId}
                data={{
                  taskList: {
                    id: this.state.id,
                    title: this.state.title
                  }
                }}
              />
            </Modal>
            : null
        }
      </Card>
    </div>
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    showAddModal: function () {
      dispatch(showAddModal(null, 3))
    }
  }
}

export default injectIntl(connect(({ user }) => ({ user }), mapDispatchToProps)(Group))

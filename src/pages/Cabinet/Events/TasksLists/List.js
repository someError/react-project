import React, { Component } from 'react'
import cloneDeep from 'lodash/cloneDeep'
import { Helmet } from 'react-helmet'
import moment from 'moment'
import qs from 'qs'
import linkState from 'linkstate'
import includes from 'lodash/includes'
import { injectIntl, defineMessages } from 'react-intl'
import Masonry from 'react-masonry-component'

import withUser from '../../../../redux/util/withUser'
import api from '../../../../api'
import { parseSearchString, removeFromArray, mapGroupsToSend } from '../../../../util'

import Spinner from '../../../../components/Loader/Spinner'
import InViewObserver from '../../../../components/Inview/InViewObserver'
import Card from '../../../../components/Card/Card'
import CardBody from '../../../../components/Card/CardBody'
import { Checkbox, MaterialInput } from '../../../../components/Form'
import { Link } from 'react-router-dom'

import FeatherIcon from '../../../../components/Icons/FeatherIcon'
import Modal, { ModalBody, ModalHeader } from '../../../../components/Modal'
import Button from '../../../../components/Button'

import './TasksList.css'
import Tile from '../../../../components/Tile/Tile'
import TileContent from '../../../../components/Tile/TileContent'
import TileAction from '../../../../components/Tile/TileAction'
import Avatar from '../../../../components/Avatar/Avatar'
import TileIcon from '../../../../components/Tile/TileIcon'
import MediaQuery from '../../../../components/MediaQuery'
import Template from '../../../../components/Template'

import commonIntlMessages from '../../../../i18n/common-messages'

const intlMessages = defineMessages({
  tasksListsTitle: {
    id: 'tasks_lists.title',
    defaultMessage: 'Списки дел'
  },
  addButton: {
    id: 'tasks_lists.add_btn',
    defaultMessage: 'добавить'
  },
  addTitle: {
    id: 'tasks_list.add.title',
    defaultMessage: 'Добавить список дел'
  },
  labelTaskListTitle: {
    id: 'label.task_list.title',
    defaultMessage: 'Название списка дел'
  }
})

const patchList = (taskListId, data) => {
  return api.putTaskList(taskListId, { taskList: { ...data } })
}

class List extends Component {
  constructor () {
    super()

    this.state = {
      items: [],
      loading: false,
      pulling: false,
      showAddModal: false
    }
  }

  invalidate () {
    this.setState({
      items: []
    })
  }

  replaceItem (i, data) {
    const items = cloneDeep(this.state.items)

    items.splice(i, 1, data)

    this.setState({
      items
    })
  }

  removeGroup (id) {
    const items = cloneDeep(this.state.items)

    const removeIndex = items.findIndex((r) => r.id === id)

    if (removeIndex > -1) {
      items.splice(removeIndex, 1)

      this.setState({
        items
      })
    }
  }

  deleteGroup (id) {
    api.deleteTaskList(id)
      .then(() => {
        this.removeGroup(id)
      })
  }

  getGroups (params, reason = 'loading') {
    this.req = api.getTaskLists(this.props.patientId, qs.stringify({ sort: 'entity.deadlineTime', direction: 'asc', ...params, groups: ['list'] }))

    this.setState({
      [reason]: true
    })

    this.req.then(({ data: { data } }) => {
      this.reqMeta = data.meta
      this.setState({
        items: this.state.items.concat(data.items),
        [reason]: false,
        hasNext: data.meta.total_pages !== data.meta.current_page
      })
    })

    return this.req
  }

  pullGroups () {
    const { reqMeta } = this

    this.getGroups({
      ...reqMeta,
      ...parseSearchString(this.props.location.search),
      page: reqMeta.current_page + 1
    }, 'pulling')
  }

  componentDidMount () {
    const { reqMeta } = this

    this.getGroups({
      ...reqMeta,
      ...parseSearchString(this.props.location.search),
      page: 1
    })
  }

  componentWillUnmount () {
    if (this.req) {
      this.req.cancel()
    }
  }

  componentWillUpdate (nextProps) {
    if (!(nextProps.location.pathname === this.props.location.pathname && nextProps.location.search === this.props.location.search)) {
      this.invalidate()
      this.getGroups({
        ...this.reqMeta,
        ...parseSearchString(nextProps.location.search)
      })
    }
  }

  replaceTaskList (data) {
    const items = cloneDeep(this.state.items)

    this.setState({
      items: items.map((l) => {
        if (l.id === data.id) {
          return data
        }

        return l
      })
    })
  }

  renderList () {
    const { patientId, user, intl } = this.props

    return this.state.items.length
      ? this.state.items.map((taskList) => {
        const pathname = `/cabinet/${user.entity_type === 'doctor' ? `patients/${patientId}/` : ''}events/taskslists/${taskList.id}`

        return <Card key={taskList.id} className='events-group'>
          <CardBody>
            <Tile>
              <TileContent>
                <h3 className='events-group-title'>
                  <Link
                    to={{
                      pathname: pathname,
                      state: {
                        removeRef: pathname
                      }
                    }}
                  >
                    { taskList.title }
                  </Link> <span className='events-group-delete' onClick={() => { this.deleteGroup(taskList.id) }}><FeatherIcon icon={'trash-2'} size={15} /></span>
                </h3>
              </TileContent>
              {
                taskList.author
                  ? <TileAction>
                    <Avatar
                      size='sm'
                      src={taskList.author.avatar && taskList.author.avatar.url}
                      initial={`${taskList.author.firstName[0]}${taskList.author.lastName[0]}`}
                    />
                  </TileAction>
                  : null
              }
            </Tile>
            <ul className='events-group-list'>
              {
                (taskList.eventGroups || []).map((e) => {
                  return <li key={e.id}>
                    <Tile>
                      <TileIcon>
                        <Checkbox
                          onChange={() => {
                            let eventGroups = cloneDeep(taskList.eventGroups)
                            eventGroups = mapGroupsToSend(eventGroups).map((eg) => {
                              if (eg.id === e.id) {
                                eg.completed = !e.completed
                              }

                              return eg
                            })

                            patchList(taskList.id, {...taskList, patient: patientId, eventGroups})
                              .then(({data: {data}}) => {
                                this.replaceTaskList(data)
                              })
                          }}

                          checked={e.completed}
                        />{' '}
                      </TileIcon>
                      <TileContent style={{ paddingTop: '2px' }}>
                        <Link
                          to={`/cabinet/${user.entity_type === 'doctor' ? `patients/${patientId}/` : ''}events/list/group/${e.id}`}
                          className={`events-group-list__title ${e.completed ? 'completed' : ''}`}>{e.title}</Link>
                        {' '}
                        {e.endTime &&
                        <span className='events-group-list__date'>{moment(e.endTime).format('DD.MM.YYYY')}</span>}
                      </TileContent>
                    </Tile>
                  </li>
                })
              }
            </ul>
          </CardBody>
        </Card>
      })
      : <div>{ intl.formatMessage(commonIntlMessages.nothingFound) }</div>
  }

  render () {
    const { hasNext } = this.state

    const { intl } = this.props

    return <div>
      <Helmet>
        <title>{ intl.formatMessage(commonIntlMessages.tasksListsTitle) }</title>
      </Helmet>
      <div className='page-header'>
        <h1>{ intl.formatMessage(commonIntlMessages.tasksListsTitle) } <Button size='sm' onClick={() => { this.setState({ showAddModal: true }) }}>{ intl.formatMessage(intlMessages.addButton) }</Button></h1>
      </div>
      {
        this.state.loading
          ? <Spinner />
          : <Template>
            <MediaQuery rule='(min-width: 768px)'>
              <Masonry options={{
                itemSelector: '.events-group',
                transitionDuration: 0,
                gutter: 20
              }}>{ this.renderList() }</Masonry>
            </MediaQuery>
            <MediaQuery rule='(max-width: 767px)'>
              <Template>
                { this.renderList() }
              </Template>
            </MediaQuery>
          </Template>
      }

      {
        !this.state.loading && !!this.state.items.length && hasNext
          ? (
            <InViewObserver
              onEnter={() => {
                this.pullGroups()
              }}
            >
              <div>
                { this.state.pulling && <Spinner /> }
              </div>
            </InViewObserver>
          )
          : null
      }

      {
        this.state.showAddModal
          ? <Modal
            onRequestClose={() => {
              this.setState({showAddModal: false})
            }}
          >
            <ModalHeader>
              <h1>{ intl.formatMessage(intlMessages.addTitle) }</h1>
            </ModalHeader>
            <ModalBody>
              <AddTasksListForm
                patientId={this.props.patientId}
                onSuccess={() => {
                  this.setState({showAddModal: false})
                  this.invalidate()
                  this.getGroups()
                }}
              />
            </ModalBody>
          </Modal>
          : null
      }
    </div>
  }
}

export default injectIntl(withUser(List))

class AddTasksListFormBase extends Component {
  constructor () {
    super()

    this.state = {
      title: '',
      notificationTypes: []
    }
  }

  toggleNotificationType (type) {
    this.setState((state) => {
      let notificationTypes = [].concat(state.notificationTypes)

      if (includes(notificationTypes, type)) {
        notificationTypes = removeFromArray(notificationTypes, (t) => t === type)
      } else {
        notificationTypes.push(type)
      }

      return {
        notificationTypes
      }
    })
  }

  render () {
    const { intl } = this.props

    return <form
      onSubmit={(e) => {
        e.preventDefault()

        api.postTaskLists(this.props.patientId, this.state)
          .then(() => {
            this.props.onSuccess()
          })
      }}
    >
      <div className='form-grid'>
        <div className='columns'>
          <div className='column col-12'>
            <MaterialInput
              label={intl.formatMessage(intlMessages.labelTaskListTitle)}
              value={this.state.title}
              onChange={linkState(this, 'title')}
            />
          </div>
        </div>

        <div className='event-form-notifications__block'>
          <div className='event-form-notifications__block__title'>{ intl.formatMessage(commonIntlMessages.labelReminderTypes) }</div>
          <div className='columns'>
            <div className='column col-4'>
              <Checkbox checked={includes(this.state.notificationTypes, 'email')} onChange={() => { this.toggleNotificationType('email') }} label={intl.formatMessage(commonIntlMessages.labelReminderTypeEmail)} />
            </div>
            <div className='column col-4'>
              <Checkbox checked={includes(this.state.notificationTypes, 'sms')} onChange={() => { this.toggleNotificationType('sms') }} label={intl.formatMessage(commonIntlMessages.labelReminderTypeSms)} />
            </div>
            <div className='column col-4'>
              <Checkbox checked={includes(this.state.notificationTypes, 'push')} onChange={() => { this.toggleNotificationType('push') }} label={intl.formatMessage(commonIntlMessages.labelReminderTypePush)} />
            </div>
          </div>
        </div>
        <div>
          <Button size='sm'>{ intl.formatMessage(commonIntlMessages.createButton) }</Button>
        </div>
      </div>
    </form>
  }
}

const AddTasksListForm = injectIntl(AddTasksListFormBase)

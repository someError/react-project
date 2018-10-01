import React, { Component } from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import includes from 'lodash/includes'
import moment from 'moment'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl'

import { Card, CardBody, CardHeader, CardFooter } from '../../../../components/Card'
import MediaQuery from '../../../../components/MediaQuery'
import { Tile, TileAction, TileContent } from '../../../../components/Tile'
import Button from '../../../../components/Button'

import api from '../../../../api'
import UserIdentity from '../../../../components/Avatar/UserIdentity'
import Checkbox from '../../../../components/Form/Checkbox'
import MedicationsTable from '../../../../components/Table/Medications'
import FeatherIcon from '../../../../components/Icons/FeatherIcon'
import Template from '../../../../components/Template'

import { noop } from '../../../../util'

import './EventCard.css'
import Modal, { ModalBody, ModalHeader } from '../../../../components/Modal'
import { DateTimeInput, Select } from '../../../../components/Form'
import { eventToPost } from '../Form'
import RecordFormStandalone from '../../Add/RecordFormStandalone'
import chunk from 'lodash/chunk'
import RadioButton from '../../../../components/Form/RadioButton'

import commonIntlMessages from '../../../../i18n/common-messages'

const deleteEvent = (id) => {
  return api.deleteEvent(id)
}

const deleteEventsGroup = (id) => {
  return api.deleteEventGroup(id)
}

class EventCard extends Component {
  constructor (props) {
    super()

    this.state = {
      data: props.data,
      showPlanForm: false,
      showRecordForm: false
    }

    this.deleteEvent = this.deleteEvent.bind(this)
    this.deleteEventsGroup = this.deleteEventsGroup.bind(this)
  }

  toggleComplete (check = true) {
    const { id } = this.state.data
    let req

    if (check) {
      req = api.completeEvent(id)
    } else {
      req = api.unCompleteEvent(id)
    }

    req.then(({ data: { data } }) => {
      this.setState({
        data: {
          ...data
        }
      })
    })
  }

  updateEventGroup (data) {
    return api.putEventsGroup(data)
  }

  deleteEvent (id) {
    this.setState({
      removing: true
    })

    deleteEvent(id)
      .then(() => {
        this.setState({
          removing: false
        })
        this.props.onRemoved('event', id)
      })
      .catch(() => {
        this.setState({
          removing: false
        })
      })
  }

  deleteEventsGroup (id) {
    this.setState({
      removing: true
    })
    deleteEventsGroup(id)
      .then(() => {
        this.setState({
          removing: false
        })
        this.props.onRemoved('group', id)
      })
      .catch(() => {
        this.setState({
          removing: false
        })
      })
  }

  deleteClickHandler (group, eventId) {
    if (group.items && group.items.length > 1) {
      this.setState({
        showDeleteModal: true
      })
    } else {
      this.deleteEvent(eventId)
    }
  }

  render () {
    const { props, state } = this

    const {
      user,
      intl
    } = props

    const {
      id,
      completed,
      userAccesses,
      startTime,
      status
    } = state.data

    const {
      title,
      text,
      medications,
      medicalSection,
      doctor,
      organization,
      taskList,
      parameters,
      patient,
      author
    } = state.data.eventGroup

    const deleteBtn = includes(userAccesses, 'delete') &&
      <Button disabled={this.state.removing} loading={this.state.removing} onClick={() => { this.deleteClickHandler(state.data.eventGroup, id) }} link size='xs'>{ intl.formatMessage(commonIntlMessages.remove) }</Button>
    const editBtn = includes(userAccesses, 'edit-stub') &&
      <Button ghost to={`/cabinet/events/list/${id}/edit`} size='xs'>{ intl.formatMessage(commonIntlMessages.edit) }</Button>
    const createRecordBtn = includes(userAccesses, 'link') && <Button size='xs' onClick={() => { this.setState({ showRecordForm: true }) }}>{ intl.formatMessage(commonIntlMessages.createRecordButton) }</Button>

    let dateView = null

    const isExpired = status === 'expired'

    const cardClassName = classNames({ 'record-card--completed': completed, 'record-card--patient_missing': isExpired })

    if (!startTime) {
      dateView = <span className='color-gray text-xxs event-card-plan-btn' onClick={() => { this.setState({ showPlanForm: true }) }}><FeatherIcon icon='calendar' size={15} /> <FormattedMessage id='event.plan' defaultMessage='запланировать' /></span>
    } else {
      dateView = <span className={`color-${isExpired ? 'red' : 'gray'} text-xs`}>{ isExpired ? <FeatherIcon icon='alert-circle' size={18} /> : null } { moment(startTime).format('DD.MM.YYYY [в] HH:mm') }</span>
    }

    let userUrl = '/cabinet/profile'

    if (user.id !== author.id) {
      if (author.entity_type === 'doctor') {
        userUrl = `/cabinet/doctors/${author.id}`
      } else {
        userUrl = `/cabinet/patients/${author.id}`
      }
    }

    let baseUrl = props.baseUrl || '/cabinet/events'

    return <div className='record-container'>
      <Card className={cardClassName}>
        <Tile centered className='record-controls'>
          <TileContent>
            <Checkbox
              disabled={!includes(userAccesses, 'completed') && !includes(userAccesses, 'not_completed')}
              onChange={(e) => { this.toggleComplete(e.target.checked) }}
              defaultChecked={completed} /><i>{completed ? intl.formatMessage(commonIntlMessages.eventStatusDone) : intl.formatMessage(commonIntlMessages.eventStatusNotDone)}</i>
          </TileContent>
          <MediaQuery rule='(min-width: 656px)'>
            <TileAction>
              {deleteBtn}
              {editBtn}
              {createRecordBtn}
            </TileAction>
          </MediaQuery>
        </Tile>

        <MediaQuery rule='(min-width: 656px)'>
          <CardHeader>
            <Tile centered>
              <TileContent>
                <UserIdentity
                  user={author}
                  size={'sm'}
                  url={userUrl}
                />
                {
                  medicalSection
                    ? <span className='record-section-path'>
                      <FeatherIcon icon='chevron-right' size={20} /> { medicalSection.name }
                    </span>
                    : null
                }
              </TileContent>
              <TileAction>
                { dateView }
              </TileAction>
            </Tile>
          </CardHeader>
        </MediaQuery>

        <MediaQuery rule='(max-width: 655px)'>
          <CardHeader>
            <UserIdentity
              centred={false}
              user={author}
              size={'sm'}
              className='card-user-identity--mobile'
              subtitle={<div>{ dateView }</div>}
            />
          </CardHeader>
        </MediaQuery>

        <CardBody>
          <div className='record-body'>
            <h3 className='record-title'><Link to={`/cabinet${user.entity_type === 'doctor' ? `/patients/${patient.id}` : ''}/events/list/${id}`}>{ title }</Link></h3>

            { taskList ? <div className='text-sm color-gray'>{ intl.formatMessage(commonIntlMessages.labelTasksList) }: <Link to={`${baseUrl}/taskslists/${taskList.id}`}>{taskList.title}</Link></div> : null }

            {
              medications && medications.length
                ? <div className='event-card-block'>
                  <h4 className='event-card-block__title'><FormattedMessage id='event.medications.title' defaultMessage='Приём лекаств' /></h4>
                  <MedicationsTable
                    className='event-medications-table'
                    items={medications}
                    dataModifier={(data) => {
                      return data.reduce((res, row) => {
                        res.push(row.filter((cell) => cell.key !== 'comment'))

                        return res
                      }, [])
                    }}
                  />
                </div>
                : null
            }

            {
              parameters && parameters.length
                ? <div>
                  <h4 className='event-card-block__title'><FormattedMessage id='event.params.title' defaultMessage='Физиологические измерения' /></h4>
                  <div className='event-form-toggling-block'>
                    {
                      chunk(parameters, 3).map((row, i) => {
                        return <div key={i} className='columns'>
                          {
                            row.map((param) => {
                              return <div key={param.id} className='column col-4'>
                                <Checkbox
                                  checked
                                  disabled
                                  key={param.id}
                                  label={param.name}
                                />
                              </div>
                            })
                          }
                        </div>
                      })
                    }
                  </div>
                </div>
                : null
            }

            {
              text && <div className='event-card-block'>
                <h4 className='event-card-block__title'>{ intl.formatMessage(commonIntlMessages.noteLabel) }</h4>
                <div className='record-text'>{ text }</div>
              </div>
            }

            {
              doctor || organization
                ? <div className='doc-footer'>
                  {
                    doctor
                      ? <span>{ intl.formatMessage(commonIntlMessages.labelDoctor) }: <Link to={`/cabinet/doctors/${doctor.id}`}>{`${doctor.firstName} ${doctor.lastName}`}</Link></span>
                      : null
                  }
                  {' '}
                  {
                    organization
                      ? <span>{ intl.formatMessage(commonIntlMessages.labelOrg) }: <Link to={`/cabinet/organizations/${organization.id}`}>{organization.name}</Link></span>
                      : null
                  }
                </div>
                : null
            }
          </div>
          <MediaQuery rule='(max-width: 655px)'>
            <Template>
              {
                editBtn || createRecordBtn || (deleteBtn && (
                  <CardFooter className='card-footer--record-controls'>
                    <div className='record-controls--mobile'>
                      <div className='columns'>
                        {
                          editBtn && (
                            <div className='column col-6'>
                              { editBtn }
                            </div>
                          )
                        }
                        {
                          createRecordBtn && (
                            <div className='column col-6'>
                              { createRecordBtn }
                            </div>
                          )
                        }
                      </div>
                      {
                        deleteBtn && (
                          <div className='columns'>
                            <div className='column col-6 col-mx-auto'>
                              { deleteBtn }
                            </div>
                          </div>
                        )
                      }
                    </div>
                  </CardFooter>
                ))
              }
            </Template>
          </MediaQuery>
        </CardBody>
      </Card>

      {
        completed &&
        state.showRecordForm
          ? <Modal
            onRequestClose={() => {
              this.setState({
                showRecordForm: false
              })
            }}
          >
            <ModalHeader>
              <h1>Создать запись</h1>
            </ModalHeader>
            <RecordFormStandalone
              onSuccess={(data) => {
                api.linkEventToRecord(id, data.id)
                  .then(({ data: { data } }) => {
                    this.setState({
                      data,
                      showRecordForm: false
                    })

                    if (this.props.onRecordLinked) {
                      this.props.onRecordLinked()
                    }
                  })
              }}
              section={medicalSection}
              cardId={this.props.cardId}
            />
          </Modal>
          : null
      }

      {
        !startTime && state.showPlanForm
          ? <Modal
            onRequestClose={() => {
              this.setState({
                showPlanForm: false
              })
            }}
          >
            <ModalHeader>
              <h1><FormattedMessage id='event.title.set_date' defaultMessage='Назначить дату выполнения дела' /></h1>
            </ModalHeader>
            <ModalBody>
              <PlanForm onSubmit={(e, data) => {
                e.preventDefault()

                this.updateEventGroup(eventToPost({
                  ...state.data.eventGroup,
                  ...data,
                  items: [{
                    startTime: data.startTime
                  }],
                  patient: patient.id
                }))
                  .then(({ data: { data } }) => {
                    document.location.reload()

                    this.setState({
                      showPlanForm: false,
                      data: {
                        ...this.state.data,
                        startTime: data.startTime,
                        eventGroup: {
                          ...this.state.data.eventGroup,
                          ...data
                        }
                      }
                    })
                  })
              }} />
            </ModalBody>
          </Modal>
          : null
      }

      {
        state.showDeleteModal
          ? <Modal
            onRequestClose={() => {
              this.setState({
                showDeleteModal: false
              })
            }}
          >
            <ModalHeader><h1><FormattedMessage id='event.title.remove' defaultMessage='Удаление события' /></h1></ModalHeader>
            <ModalBody>
              <DeleteEventForm
                eventId={id}
                eventsGroupId={state.data.eventGroup.id}
                deleteEvent={this.deleteEvent}
                deleteEventsGroup={this.deleteEventsGroup}
                onRemoved={(...args) => {
                  if (this.props.onRemoved) {
                    this.props.onRemoved(...args)
                  } else {
                    const location = this.props.location
                    location.key = `${location.key}${Math.random()}`
                    location.search = `v=1`
                    this.props.history.replace(location)
                  }
                }}
              />
            </ModalBody>
          </Modal>
          : null
      }
    </div>
  }
}

EventCard.defaultProps = {
  onRemoved: noop
}

export default injectIntl(withRouter(connect(({ user }) => ({ user }))(EventCard)))

const IntlMessages = defineMessages({
  labelSingle: {
    id: 'event.form.label.single',
    defaultMessage: 'Только это событие'
  },
  labelAll: {
    id: 'event.form.label.all',
    defaultMessage: 'Все события'
  }
})

class DeleteEventFormBase extends Component {
  constructor () {
    super()

    this.state = {
      type: 'event'
    }
  }

  render () {
    const { intl } = this.props

    return <form
      onSubmit={(e) => {
        e.preventDefault()
        let req

        if (this.state.type === 'event') {
          req = this.props.deleteEvent(this.props.eventId)
        } else {
          req = this.props.deleteEventsGroup(this.props.eventsGroupId)
        }

        if (req) {
          req.then(this.state.type, this.state.type === 'event' ? this.props.eventId : this.props.eventsGroupId)
        }
      }}
    >
      <ul className='filters-list'>
        <li>
          <RadioButton
            checked={this.state.type === 'event'}
            onChange={() => {
              this.setState({
                type: 'event'
              })
            }}
            label={intl.formatMessage(IntlMessages.labelSingle)}
          />
        </li>
        <li>
          <RadioButton
            checked={this.state.type === 'group'}
            onChange={() => {
              this.setState({
                type: 'group'
              })
            }}
            label={intl.formatMessage(IntlMessages.labelAll)}
          />
        </li>
      </ul>
      <br />
      <div>
        <Button size='sm'>{ intl.formatMessage(commonIntlMessages.remove) }</Button>
      </div>
    </form>
  }
}

const DeleteEventForm = injectIntl(DeleteEventFormBase)

class PlanFormBase extends Component {
  constructor () {
    super()

    this.state = {
      startTime: moment().add(1, 'hour').startOf('hour').format(),
      remindHours: 0
    }
  }

  render () {
    const { state } = this

    const { intl } = this.props

    return <form
      onSubmit={(e) => {
        e.preventDefault()
        this.props.onSubmit(e, this.state)
      }}
    >
      <div className='form-grid columns'>
        <div className='column col-5'>
          <DateTimeInput
            value={moment(state.startTime).format('DD.MM.YYYY HH:mm')}
            onChange={(date) => {
              this.setState({
                startTime: moment(date).format()
              })
            }}
          />
        </div>
        <div className='column col-7'>
          <Select
            value={state.remindHours}
            onChange={(e) => {
              this.setState({
                remindHours: Number(e.target.value)
              })
            }}
            material
            label={intl.formatMessage(commonIntlMessages.labelEventRemind)}
          >
            <option value={0}>{intl.formatMessage(commonIntlMessages.labelRemindExact)}</option>
            <option value={1}>{intl.formatMessage(commonIntlMessages.labelRemindHour)}</option>
            <option value={3}>{intl.formatMessage(commonIntlMessages.labelRemind3hours)}</option>
            <option value={10}>{intl.formatMessage(commonIntlMessages.labelRemind10hours)}</option>
            <option value={24}>{intl.formatMessage(commonIntlMessages.labelRemindDay)}</option>
          </Select>
        </div>
      </div>
      <Button size='sm'>{ intl.formatMessage(commonIntlMessages.saveBtn) }</Button>
    </form>
  }
}

const PlanForm = injectIntl(PlanFormBase)

import React, { Component } from 'react'
import { connect } from 'react-redux'
import linkState from 'linkstate'
import remove from 'lodash/remove'
import includes from 'lodash/includes'
import chunk from 'lodash/chunk'
import isString from 'lodash/isString'
import moment from 'moment'
import qs from 'qs'
import { injectIntl, defineMessages } from 'react-intl'

import Button from '../../../../components/Button'
import { MaterialInput } from '../../../../components/Form'
import FeatherIcon from '../../../../components/Icons/FeatherIcon'

import api from '../../../../api'
import { Card, CardBody } from '../../../../components/Card'
import MedicationsForm, { DRUG_SCHEME } from '../../Cards/Form/MedicationsForm'
import Checkbox from '../../../../components/Form/Checkbox'
import Autocomplete from '../../../../components/Form/Autocomplete'
import RadioButton from '../../../../components/Form/RadioButton'
import Select from '../../../../components/Form/Select'
import ScheduleForm from './ScheduleForm'

import './Form.css'
import SectionAddButton from './SectionAddButton'
import EventTypeRadio from './EventTypeRadio'
import Collapsible from '../../../../components/Collapsible'
import Template from '../../../../components/Template'
import { noop, removeFromArray, errorsToObj } from '../../../../util'
import ErrorMessage from '../../../../components/Form/ErrorMessage'

import commonIntlMessages from '../../../../i18n/common-messages'

export const eventToPost = (data) => {
  return {
    ...data,
    medicalSection: typeof data.medicalSection === 'string' ? data.medicalSection : (data.medicalSection && data.medicalSection.id),
    doctor: data.doctor ? data.doctor.id : null,
    organization: data.organization ? data.organization.id : null,
    medications: data.medications.map((med) => ({ ...med, drug: med.drug.id })),
    taskList: data.taskList ? data.taskList.id : null,
    parameters: data.parameters.map((p) => isString(p) ? p : p.id)
  }
}

const DEFAULT_STATE = {
  title: '',
  type: 'custom',
  medicalSection: '',
  text: null,
  medications: [],
  parameters: [],
  doctor: null,
  organization: null,
  access: 'self',
  taskList: null,
  schedule: null,
  notificationTypes: ['email'],
  remindHours: 0,
  taskLists: []
}

const intlMessages = defineMessages({
  labelTitle: {
    id: 'event.form.label.title',
    defaultMessage: 'Введите название события'
  },
  labelEventTypeCustom: {
    id: 'event.form.label.type.custom',
    defaultMessage: 'Произвольное'
  },
  labelEventTypeParams: {
    id: 'event.form.label.type.params',
    defaultMessage: 'Измерения'
  },
  labelEventTypeMedications: {
    id: 'event.form.label.type.medications',
    defaultMessage: 'Приём лекарств'
  },
  blockTitleNote: {
    id: 'events.form.block.title.note',
    defaultMessage: 'Примечание'
  },
  blockTitleDocAndOrg: {
    id: 'events.form.block.title.doc_org',
    defaultMessage: 'Врач и медучреждение'
  },
  blockTitleDue: {
    id: 'events.form.block.title.due',
    defaultMessage: 'Срок'
  },
  blockTitleTasksList: {
    id: 'events.form.block.title.tasks_list',
    defaultMessage: 'Список дел'
  },
  blockTitleAccessSettings: {
    id: 'events.form.block.title.access_settings',
    defaultMessage: 'Настройки доступа'
  },
  blockTitleNotificationsSettings: {
    id: 'events.form.block.title.notifications_settings',
    defaultMessage: 'Настройки уведомлений'
  },
  labelAccessPrivate: {
    id: 'events.form.access.private',
    defaultMessage: 'Доступно только мне'
  },
  labelAccessDoctors: {
    id: 'events.form.access.doctors',
    defaultMessage: 'Доступно моим врачам'
  }
})

class EventForm extends Component {
  constructor (props) {
    super()

    this.state = {
      ...DEFAULT_STATE,
      ...props.data,
      loading: false
    }

    this.toggleNotificationType = this.toggleNotificationType.bind(this)
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

  save () {
    this.setState({
      loading: true
    })

    api.postEventsGroup(this.props.patientId, eventToPost(this.state))
      .then(({ data: { data } }) => {
        this.props.onSuccess(data)
      })
      .catch((err) => {
        this.setState({
          loading: false
        })

        if (err.response) {
          if (err.response.status === 400) {
            this.setState({
              errors: errorsToObj(err.response.data.data.errors).eventGroup
            })
          } else if (err.response.status === 403) {
            this.setState({
              errors: {
                global: err.response.data.data.message
              }
            })
          }
        }
      })
  }

  getSections () {
    if (this.state.type === 'custom') {
      return this.props.sections.filter((section) => {
        return !section.recordPersonalDiary && !section.recordDrug
      })
    }

    return this.props.sections
  }

  componentWillReceiveProps () {
    if (this.props.sections && this.props.sections.length) {
      this.setState({
        medicalSection: this.props.sections[0].id
      })
    }
  }

  componentWillUpdate (nextProps, nextState) {
    if (nextState.type !== this.state.type) {
      if (nextState.type === 'measurement') {
        this.setState({
          medicalSection: this.props.sections.filter((section) => section.recordPersonalDiary)[0].id,
          medications: []
        })
      } else if (nextState.type === 'medication') {
        this.setState({
          medicalSection: this.props.sections.filter((section) => section.recordDrug)[0].id,
          medications: [{ ...DRUG_SCHEME }]
        })
      } else {
        this.setState({
          medicalSection: this.props.sections[0].id,
          medications: []
        })
      }
    }
  }

  componentDidMount () {
    api.getTaskLists(this.props.patientId, qs.stringify({ limit: 1000 }))
      .then(({ data: { data } }) => {
        this.setState({
          taskLists: data.items
        })
      })
  }

  render () {
    const { parameters, intl } = this.props
    const { errors } = this.state

    return <Card>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          this.save()
        }}
      >
        <CardBody
          style={{ background: '#F7F7F8' }}
        >
          <div className='form-grid'>
            <div className='columns'>
              <div className='column col-12'>
                <MaterialInput
                  size='lg'
                  onChange={linkState(this, 'title')}
                  label={intl.formatMessage(intlMessages.labelTitle)}
                  value={this.state.title}
                  error={!!(errors && errors.title)}
                />
                <ErrorMessage>{ errors && errors.title }</ErrorMessage>
                { errors && errors.global && <ErrorMessage>{ errors.global }</ErrorMessage> }
              </div>
            </div>
          </div>

          <div className='event-type-group'>
            <EventTypeRadio
              checked={this.state.type === 'custom'}
              icon='edit-2'
              label={intl.formatMessage(intlMessages.labelEventTypeCustom)}
              onChange={() => { this.setState({type: 'custom'}) }}
            />

            <EventTypeRadio
              checked={this.state.type === 'measurement'}
              icon='trending-up'
              label={intl.formatMessage(intlMessages.labelEventTypeParams)}
              onChange={() => { this.setState({type: 'measurement'}) }}
            />

            <EventTypeRadio
              checked={this.state.type === 'medication'}
              icon='pill'
              label={intl.formatMessage(intlMessages.labelEventTypeMedications)}
              onChange={() => { this.setState({type: 'medication'}) }}
            />
          </div>

          {
            this.state.type === 'custom'
              ? <div className='form-grid'>
                <div className='columns'>
                  <div className='column col-12'>
                    <Select
                      material
                      label={intl.formatMessage(commonIntlMessages.labelChooseSection)}
                      value={this.state.medicalSection}
                      onChange={linkState(this, 'medicalSection')}
                    >
                      {
                        this.getSections().map((section) => {
                          return <option key={section.id} value={section.id}>{section.name}</option>
                        })
                      }
                    </Select>
                  </div>
                </div>
              </div>
              : null
          }

          {
            this.state.type === 'measurement'
              ? <Template>
                <div className='event-form-toggling-block'>
                  {
                    chunk(parameters, 3).map((row, i) => {
                      return <div key={i} className='columns'>
                        {
                          row.map((param) => {
                            return <div key={param.id} className='column col-4'>
                              <Checkbox
                                checked={includes(this.state.parameters, param.id)}
                                onChange={(e) => {
                                  this.setState((state) => {
                                    if (includes(state.parameters, param.id)) {
                                      remove(state.parameters, (p) => p === param.id)
                                    } else {
                                      state.parameters.push(param.id)
                                    }

                                    return state
                                  })
                                }}
                                key={param.id}
                                label={param.name}
                              />
                            </div>
                          })
                        }
                      </div>
                    })
                  }
                  <ErrorMessage>{ errors && errors.parameters }</ErrorMessage>
                </div>
              </Template>
              : null
          }

          {
            this.state.type === 'medication'
              ? <Template><MedicationsForm keepDefaultInSync errors={errors && errors.medications} defaultItems={this.state.medications} onChange={(items) => { this.setState({medications: items}) }} /><br /><br /></Template>
              : null
          }

          {
            this.state.text !== null
              ? (
                <TogglingBlock
                  icon='align-left'
                  label={intl.formatMessage(intlMessages.blockTitleNote)}
                  onRemoveClick={() => {
                    this.setState({
                      text: null
                    })
                  }}
                >
                  <div className='form-grid'>
                    <div className='columns'>
                      <div className='column col-12 no-margin'>
                        <MaterialInput
                          label={intl.formatMessage(commonIntlMessages.labelTypeInNote)}
                          textarea
                          minRows={5}
                          value={this.state.text}
                          onChange={linkState(this, 'text')}
                        />
                      </div>
                    </div>
                  </div>
                </TogglingBlock>
              )
              : null
          }

          {
            this.state.doctor !== null
              ? (
                <TogglingBlock
                  icon='align-left'
                  label={intl.formatMessage(intlMessages.blockTitleDocAndOrg)}
                  onRemoveClick={() => {
                    this.setState({
                      doctor: null,
                      organization: null
                    })
                  }}
                >
                  <div className='form-grid'>
                    <div className='columns'>
                      <div className='column col-6 col-xs-12 no-margin'>
                        <Autocomplete
                          label={intl.formatMessage(commonIntlMessages.labelDoctor)}
                          defaultValue={this.state.doctor ? `${[this.state.doctor.firstName, this.state.doctor.lastName].filter((n) => !!n).join(' ')}` : ''}
                          requestSuggestions={(q) => api.searchDoctors(q)}
                          getSuggestionValue={(suggestion) => {
                            return `${suggestion.firstName} ${suggestion.lastName}`
                          }}
                          renderSuggestion={(suggestion) => {
                            return `${suggestion.firstName} ${suggestion.lastName}`
                          }}
                          onSuggestionSelected={(e, {suggestion}) => {
                            this.setState({
                              doctor: suggestion
                            })
                          }}
                        />
                      </div>

                      <div className='column col-6 col-xs-12 no-margin'>
                        <Autocomplete
                          label={intl.formatMessage(commonIntlMessages.labelOrg)}
                          defaultValue={`${(this.state.organization && this.state.organization.name) || ''}`}
                          requestSuggestions={(q) => api.searchOrganizations(q)}
                          onSuggestionSelected={(e, {suggestion}) => {
                            this.setState({
                              organization: suggestion
                            })
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </TogglingBlock>
              )
              : null
          }

          {
            this.state.taskList !== null
              ? (
                <TogglingBlock
                  icon='check-square'
                  label={intl.blockTitleTasksList}
                  removable={!this.state.hasInitialTaskList}
                  onRemoveClick={() => {
                    this.setState({
                      taskList: null
                    })
                  }}
                >
                  <div className='form-grid'>
                    <div className='columns'>
                      <div className='column col-12 no-margin'>
                        <Autocomplete
                          label={intl.formatMessage(commonIntlMessages.labelTasksList)}
                          defaultValue={this.state.taskList.title}
                          highlightFirstSuggestion
                          shouldRenderSuggestions={() => true}
                          requestSuggestions={(q) => {
                            this.setState({
                              taskList: {}
                            })
                            return new Promise((resolve, reject) => {
                              if (q !== '') {
                                resolve(this.state.taskLists.filter((tl) => tl.title.toLocaleLowerCase().indexOf(q.toLocaleLowerCase()) > -1))
                              } else {
                                resolve(this.state.taskLists)
                              }
                            })
                          }}
                          getSuggestionValue={(suggestion) => {
                            return `${suggestion.title}`
                          }}
                          onSuggestionSelected={(e, {suggestion}) => {
                            this.setState({
                              taskList: suggestion
                            })
                          }}
                          inputProps={{
                            onBlur: (e, { highlightedSuggestion }) => {
                              const value = e.target.value.trim()

                              if (value && !this.state.taskList.id) {
                                if (!!highlightedSuggestion && value.toLocaleLowerCase().trim() === highlightedSuggestion.title.toLowerCase()) {
                                  this.setState({
                                    taskList: highlightedSuggestion
                                  })
                                } else {
                                  api.postTaskLists(this.props.patientId, {
                                    title: value
                                  })
                                    .then(({data: {data}}) => {
                                      this.setState({
                                        taskLists: [].concat(this.state.taskLists, [data])
                                      })
                                    })
                                }
                              }
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </TogglingBlock>
              )
              : null
          }

          {
            this.state.schedule !== null
              ? (
                <TogglingBlock
                  icon='clock'
                  label={intl.formatMessage(intlMessages.blockTitleDue)}
                  onRemoveClick={() => {
                    this.setState({
                      schedule: null
                    })
                  }}
                >
                  <ScheduleForm
                    onChange={(periodData) => {
                      let data = {
                        startTime: moment(periodData.startDate).format(),
                        endTime: periodData.repeatable ? moment(periodData.endDate).format() : null
                      }

                      if (periodData.disableEventTime) {
                        data.startTime = moment(data.startTime).startOf('day').format()

                        if (data.endTime) {
                          data.endTime = moment(data.endTime).endOf('day').format()
                        } else {
                          data.endTime = moment(data.startTime).endOf('day').format()
                        }
                      }

                      if (periodData.repeatable) {
                        data = {
                          ...data,
                          periodType: periodData.schedule.type,
                          periodValue: periodData.schedule.repeat
                        }
                      }

                      data.items = (periodData.schedule.dates).map((date) => {
                        return { startTime: moment(date).format() }
                      })

                      if (!data.items.length) {
                        data.items = [{ startTime: moment(data.startTime).format() }]
                      }

                      if (data.disableEventTime) {
                        data.items = data.items.map((item) => ({ startTime: moment(item.startTime).startOf('day').format() }))
                      }

                      this.setState({
                        ...this.state,
                        ...data
                      })
                    }}
                  />
                </TogglingBlock>
              )
              : null
          }

          <TogglingBlock
            icon='lock'
            removable={false}
            label={intl.formatMessage(intlMessages.blockTitleAccessSettings)}
          >
            <div className='columns'>
              <div className='column col-4'>
                <RadioButton
                  onChange={() => { this.setState({access: 'self'}) }}
                  checked={this.state.access === 'self'}
                  label={intl.formatMessage(intlMessages.labelAccessPrivate)}
                />
              </div>
              <div className='column col-4'>
                <RadioButton
                  onChange={() => { this.setState({access: 'self_and_doctors'}) }}
                  checked={this.state.access === 'self_and_doctors'}
                  label={intl.formatMessage(intlMessages.labelAccessDoctors)}
                />
              </div>
            </div>
          </TogglingBlock>

          <div className='event-blocks'>
            { this.state.text === null && <SectionAddButton icon='align-left' onClick={() => { this.setState({text: ''}) }}>{ intl.formatMessage(intlMessages.blockTitleNote) }</SectionAddButton> }
            { this.state.schedule === null && <SectionAddButton icon='clock' onClick={() => { this.setState({schedule: []}) }}>{ intl.formatMessage(intlMessages.blockTitleDue) }</SectionAddButton> }
            { this.state.taskList === null && <SectionAddButton icon='check-square' onClick={() => { this.setState({taskList: {}}) }}>{ intl.formatMessage(intlMessages.blockTitleTasksList) }</SectionAddButton> }
            { this.state.doctor === null && <SectionAddButton onClick={() => { this.setState({doctor: {}}) }}>{ intl.formatMessage(intlMessages.blockTitleDocAndOrg) }</SectionAddButton> }
            { this.state.access === null && <SectionAddButton icon='lock' onClick={() => { this.setState({access: 'private'}) }}>{ intl.formatMessage(intlMessages.blockTitleAccessSettings) }</SectionAddButton> }
          </div>
        </CardBody>

        <CardBody
          className='event-form-notifications'
          style={{background: '#F7F7F8'}}
        >
          <Collapsible
            triggerClassName='event-form-notifications__trigger'
            title={intl.formatMessage(intlMessages.blockTitleNotificationsSettings)}
            renderTrigger={(title, active) => {
              return <Template><span>{ title }</span> <FeatherIcon icon={active ? 'chevron-up' : 'chevron-down'} /></Template>
            }}
          >
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

            <div className='event-form-notifications__block'>
              <div className='event-form-notifications__block__title'>{ intl.formatMessage(commonIntlMessages.labelEventRemind) }</div>
              <div className='columns'>
                <div className='column col-4'>
                  <RadioButton
                    value={0}
                    checked={this.state.remindHours === 0}
                    onChange={() => { this.setState({ remindHours: 0 }) }}
                    label={intl.formatMessage(commonIntlMessages.labelRemindExact)}
                  />
                </div>
                <div className='column col-4'>
                  <RadioButton
                    checked={this.state.remindHours === 1}
                    label={intl.formatMessage(commonIntlMessages.labelRemindHour)}
                    onChange={() => { this.setState({ remindHours: 1 }) }}
                  />
                </div>
                <div className='column col-4'>
                  <RadioButton
                    checked={this.state.remindHours === 3}
                    label={intl.formatMessage(commonIntlMessages.labelRemind3hours)}
                    onChange={() => { this.setState({ remindHours: 3 }) }}
                  />
                </div>
              </div>
              <div className='columns'>
                <div className='column col-4'>
                  <RadioButton
                    checked={this.state.remindHours === 10}
                    label={intl.formatMessage(commonIntlMessages.labelRemind10hours)}
                    onChange={() => { this.setState({ remindHours: 10 }) }}
                  />
                </div>
                <div className='column col-4'>
                  <RadioButton
                    checked={this.state.remindHours === 24}
                    label={intl.formatMessage(commonIntlMessages.labelRemindDay)}
                    onChange={() => { this.setState({ remindHours: 24 }) }}
                  />
                </div>
              </div>
            </div>
          </Collapsible>
        </CardBody>

        <CardBody
          style={{background: '#F7F7F8'}}
        >
          <Button disabled={this.state.loading} loading={this.state.loading} size='sm'>{ intl.formatMessage(commonIntlMessages.addEventBtn) }</Button>
        </CardBody>
      </form>
    </Card>
  }
}

EventForm.defaultProps = {
  onSuccess: noop
}

export default injectIntl(connect(({ reference }) => ({ parameters: reference.parameters, sections: reference.sections }))(EventForm))

const TogglingBlock = (props) => {
  return <div className='event-form-toggling-block'>
    <div className='event-form-toggling-block__header'>
      <div className='event-form-toggling-block__header-title'>
        { props.icon ? <FeatherIcon icon={props.icon} size={18} /> : null } { props.label }
      </div>
      <div className='event-form-toggling-block__header-line' />
      {
        props.removable && <div className='event-form-toggling-block__header-rm'>
          <span className='event-form-toggling-block__header-rm-btn' onClick={props.onRemoveClick}><FeatherIcon icon='x' size={14} /></span>
        </div>
      }
    </div>
    { props.children }
  </div>
}

TogglingBlock.defaultProps = {
  removable: true
}

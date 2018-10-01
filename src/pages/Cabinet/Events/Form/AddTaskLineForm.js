import React, { Component } from 'react'
import moment from 'moment-timezone'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl'
import { Checkbox, DateInput, Select } from '../../../../components/Form'
import Button from '../../../../components/Button'
import memoize from 'memoizejs'

import api from '../../../../api'
import includes from 'lodash/includes'
import { removeFromArray } from '../../../../util'

import commonIntlMessages from '../../../../i18n/common-messages'

const getPregnantWeeks = memoize((total = 40) => {
  const res = []
  let i = 1

  while (i <= total) {
    res.push(i)

    i++
  }

  return res
})

const intlMessages = defineMessages({
  labelChooseTasksLine: {
    id: 'label.choose_tasks_line',
    defaultMessage: 'Выберите линейку дел'
  },
  labelChoosePregnantWeek: {
    id: 'label.choose_pregnant_week',
    defaultMessage: 'Укажите неделю беременности'
  },
  labelStartDate: {
    id: 'label.start_date',
    defaultMessage: 'Дата начала'
  },
  ordinalWeek: {
    id: 'label.week_ordinal',
    defaultMessage: `{num}{num, selectordinal, other {-я}} неделя`
  }
})

class AddTaskLineForm extends Component {
  constructor (props) {
    super()

    this.state = {
      template: props.templateId || '',
      week: 1,
      notificationTypes: [],
      startTime: moment().add(1, 'day').toDate()
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

  isPregnantSelected () {
    const pregnant = this.props.templates.find((t) => t.type === 'pregnancy')
    return pregnant && this.state.template === pregnant.id
  }

  post () {
    const postData = {
      patient: this.props.patientId,
      taskLineTemplate: this.state.template,
      notificationTypes: this.state.notificationTypes,
      startTime: moment(this.state.startTime).add(1, 'hour').utc().format(),
      groups: ['list']
    }

    if (this.isPregnantSelected()) {
      postData.offsetDays = this.state.week * 7
    }

    api.postTaskLine({
      taskLine: postData
    })
      .then(({data: {data}}) => {
        this.props.onSuccess(data)
      })
  }

  render () {
    const { intl } = this.props

    const isPregnantSelected = this.isPregnantSelected()

    return <form
      onSubmit={(e) => {
        e.preventDefault()

        this.post()
      }}
    >
      <div className='form-grid'>
        <div className='columns'>
          <div className={`column ${isPregnantSelected ? 'col-5' : 'col-9'}`}>
            <Select
              material
              label={intl.formatMessage(intlMessages.labelChooseTasksLine)}
              value={this.state.template}
              onChange={(e) => {
                this.setState({
                  template: e.target.value
                })
              }}
            >
              {
                this.props.templates.map((template) => {
                  return <option value={template.id} key={template.id}>{template.title}</option>
                })
              }
            </Select>
          </div>

          {
            isPregnantSelected
              ? <div className='column col-4'>
                <Select
                  material
                  label={intl.formatMessage(intlMessages.labelChoosePregnantWeek)}
                  value={this.state.week}
                  onChange={(e) => {
                    this.setState({
                      week: Number(e.target.value)
                    })
                  }}
                >
                  {
                    getPregnantWeeks()
                      .map((v) => {
                        return <option key={v} value={v}>{intl.formatMessage(intlMessages.ordinalWeek, { num: v })}</option>
                      })
                  }
                </Select>
              </div>
              : null
          }

          <div className='column col-3'>
            <DateInput
              label={intl.formatMessage(intlMessages.labelStartDate)}
              value={moment(this.state.startTime).format('DD.MM.YYYY')}
              onDayChange={(date) => {
                this.setState({
                  startTime: date.toDate()
                })
              }}
              dayPickerProps={{
                disabledDays: (date) => {
                  return moment(date).isBefore(moment().add(1, 'day'), 'days')
                }
              }}
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
          <Button size='sm'><FormattedMessage id='tasks_line.turn_on.btn' defaultMessage='включить линейку' /></Button>
        </div>
      </div>
    </form>
  }
}

export default injectIntl(AddTaskLineForm)

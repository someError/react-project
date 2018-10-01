import React, { Component } from 'react'
import { connect } from 'react-redux'
import linkState from 'linkstate'
import moment from 'moment'
import { injectIntl, FormattedMessage } from 'react-intl'

import api from '../../../../api'
import Button from '../../../../components/Button'
import { MaterialInput, DateInput } from '../../../../components/Form'
import Modal from '../../../../components/Modal'
import { DoctorScheduleHeader, DoctorScheduleForm } from '../../../../components/DoctorScheduleForm'

import commonIntlMessages from '../../../../i18n/common-messages'

class RequestModal extends Component {
  constructor (props) {
    super()

    this.state = {
      birthday: moment().startOf('day').format('YYYY-MM-DDThh:mm:ssZ'),
      organization: props.id,
      patient: props.user.id,
      fullName: '',
      phone: '',
      email: '',
      datetimeText: '',
      info: '',
      postLoading: false
    }
    this.onSubmit = this.onSubmit.bind(this)
    this.handleDayChange = this.handleDayChange.bind(this)
  }

  handleDayChange (selectedDay, modifiers) {
    this.setState({
      selectedDay,
      isDisabled: modifiers.disabled === true
    })
  }

  onSubmit (e) {
    e.preventDefault()
    this.setState({ postLoading: true })
    const { postLoading, ...postData } = this.state
    api.postScheduleRequest(postData)
      .then(() => {
        this.setState({
          postLoading: false
        })
        this.props.onRequestClose()
      })
      .catch(({ response: { data: { data } } }) => {
        this.setState({
          errors: data.errors,
          postLoading: false
        })
      })
  }

  render () {
    const { props, state } = this
    const { intl } = props

    return (
      <Modal
        onRequestClose={() => { props.onRequestClose() }}
      >
        <DoctorScheduleForm
          onSubmit={this.onSubmit}
        >
          <DoctorScheduleHeader title={intl.formatMessage(commonIntlMessages.receptionRequestTitle)} />
          <div className='form-grid'>
            <div className='columns'>
              <div className='column col-12'>
                <MaterialInput
                  label={intl.formatMessage(commonIntlMessages.fullName)}
                  value={state.fullName}
                  onChange={linkState(this, 'fullName')}
                  error={state.errors && state.errors['request[fullName]'] && state.errors['request[fullName]'][0]}
                />
              </div>
            </div>
            <div className='columns'>
              <div className='column col-12'>
                <DateInput
                  label={intl.formatMessage(commonIntlMessages.labelBirthDate)}
                  width={180}
                  error={state.errors && state.errors['request[birthday]'] && state.errors['request[birthday]'][0]}
                  onDayChange={(date) => {
                    this.setState({
                      birthday: moment(date).startOf('day').format('YYYY-MM-DDThh:mm:ssZ')
                    })
                    if (state.errors && state.errors['request[birthday]']) {
                      const errors = state.errors
                      delete errors['request[birthday]']
                      this.setState({errors})
                    }
                  }}
                  dayPickerProps={{
                    onDayClick: (date, dateProps) => {
                      if (dateProps.disabled) {
                        return
                      }
                      this.setState({
                        birthday: moment(date).startOf('day').format('YYYY-MM-DDThh:mm:ssZ')
                      })
                      if (state.errors && state.errors['request[birthday]']) {
                        const errors = state.errors
                        delete errors['request[birthday]']
                        this.setState({errors})
                      }
                    }
                  }}
                  value={moment(state.birthday).startOf('day').format('DD.MM.YYYY')}
                />
              </div>
            </div>
            <div className='columns'>
              <div className='column col-12'>
                <MaterialInput
                  width={180}
                  type='number'
                  label={intl.formatMessage(commonIntlMessages.phone)}
                  value={state.phone}
                  onChange={(e) => {
                    this.setState({phone: e.target.value})
                  }}
                />
              </div>
            </div>
            <div className='columns'>
              <div className='column col-12'>
                <MaterialInput
                  label={intl.formatMessage(commonIntlMessages.email)}
                  value={state.email}
                  onChange={linkState(this, 'email')}
                  error={state.errors && state.errors['request[email]'] && state.errors['request[email]'][0]}
                />
              </div>
            </div>
            <div className='columns'>
              <div className='column col-7'>
                <MaterialInput
                  label={intl.formatMessage(commonIntlMessages.desiredReceptionDays)}
                  value={state.datetimeText}
                  onChange={linkState(this, 'datetimeText')}
                />
              </div>
            </div>
            <div className='columns'>
              <div className='column col-12'>
                <MaterialInput
                  textarea
                  minRows={3}
                  label={intl.formatMessage(commonIntlMessages.additionalReceptionInfo)}
                  value={state.info}
                  onChange={linkState(this, 'info')}
                />
              </div>
            </div>
          </div>
          <Button
            loading={state.postLoading}
          >
            <FormattedMessage
              id='reception.send_request'
              defaultMessage='Отправить заявку'
            />
          </Button>
        </DoctorScheduleForm>
      </Modal>
    )
  }
}

const mapStateToProps = ({ user }) => {
  return {
    user
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(RequestModal))

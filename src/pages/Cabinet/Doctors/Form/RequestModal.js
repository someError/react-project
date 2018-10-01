import React, { Component } from 'react'
import { connect } from 'react-redux'
import linkState from 'linkstate'
import moment from 'moment'

import api from '../../../../api'
import Button from '../../../../components/Button'
import { MaterialInput, DateInput } from '../../../../components/Form'
import Modal from '../../../../components/Modal'
import { DoctorScheduleHeader, DoctorScheduleForm } from '../../../../components/DoctorScheduleForm'

class RequestModal extends Component {
  constructor (props) {
    super()

    this.state = {
      birthday: moment().startOf('day').format('YYYY-MM-DDThh:mm:ssZ'),
      doctor: props.id,
      patient: props.user.id,
      fullName: '',
      phone: '',
      email: '',
      dateText: '',
      timeText: '',
      info: '',
      postLoading: false,
      errors: null
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
    const { postLoading, errors, ...postData } = this.state
    this.setState({postLoading: true})
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
    return (
      <Modal
        onRequestClose={() => { props.onRequestClose() }}
      >
        <DoctorScheduleForm
          onSubmit={this.onSubmit}
        >
          <DoctorScheduleHeader title='Заявка на прием к врачу' />
          <div className='form-grid'>
            <div className='columns'>
              <div className='column col-12'>
                <MaterialInput
                  label='Фамилия Имя Отчество'
                  value={state.fullName}
                  onChange={linkState(this, 'fullName')}
                  error={state.errors && state.errors['request[fullName]'] && state.errors['request[fullName]'][0]}
                />
              </div>
            </div>
            <div className='columns'>
              <div className='column col-12'>
                <DateInput
                  label='Дата рождения'
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
                  phone
                  // type='number'
                  label='Номер телефона'
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
                  label='Электронная почта'
                  value={state.email}
                  onChange={linkState(this, 'email')}
                  error={state.errors && state.errors['request[email]'] && state.errors['request[email]'][0]}
                />
              </div>
            </div>
            <div className='columns'>
              <div className='column col-7'>
                <MaterialInput
                  label='Желаемые дни приема'
                  value={state.dateText}
                  onChange={linkState(this, 'dateText')}
                />
              </div>
            </div>
            <div className='columns'>
              <div className='column col-7'>
                <MaterialInput
                  label='Желаемое время приема'
                  value={state.timeText}
                  onChange={linkState(this, 'timeText')}
                />
              </div>
            </div>
            <div className='columns'>
              <div className='column col-12'>
                <MaterialInput
                  textarea
                  minRows={3}
                  label='Дополнительная информация, пожелания'
                  value={state.info}
                  onChange={linkState(this, 'info')}
                />
              </div>
            </div>
          </div>
          <Button
            loading={state.postLoading}
          >
            Отправить заявку
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
  // return {
  //   showAddModal: function (...args) {
  //     console.log(args)
  //     return dispatch(showAddModal(...args))
  //   },
  //   fetchDoctors: function (query) {
  //     return dispatch(fetchDoctors(query))
  //   }
  // }
}

export default connect(mapStateToProps, mapDispatchToProps)(RequestModal)

// FIXME: воткнуть intl

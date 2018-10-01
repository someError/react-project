import React, { Component } from 'react'
import { injectIntl, defineMessages } from 'react-intl'

import Modal, { ModalHeader, ModalBody } from '../../../components/Modal'
import { MaterialInput, Select } from '../../../components/Form'
import api from '../../../api'
import Button from '../../../components/Button'

import commonIntlMessages from '../../../i18n/common-messages'
import { normalizeLogin } from '../../../util'

const intlMessages = defineMessages({
  addWorkerTitle: {
    id: 'worker.for.title',
    defaultMessage: 'Добавить своего сотрудника'
  },
  chooseRole: {
    id: 'choose.worker.role',
    defaultMessage: 'Выберите роль сотрудника'
  }
})

class AddForm extends Component {
  constructor () {
    super()
    this.state = {
      firstName: '',
      lastName: '',
      middleName: '',
      postLoading: false,
      role: ''
    }
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit (e) {
    e.preventDefault()

    this.setState({postLoading: true})
    const formData = new FormData(this.form)

    if (formData.get('user[phone]')) {
      formData.set('user[phone]', normalizeLogin(formData.get('user[phone]')))
    }

    const createRole = (request) => {
      request
        .then(({data: {data}}) => {
          this.props.onAdd(data)
          this.props.onClose() || this.setState({postLoading: false})
        })
        .catch(({ response: { data: { data } } }) => {
          this.setState({
            errors: data.errors,
            postLoading: false
          })
        })
    }

    switch (this.state.role) {
      case 'doctor':
        createRole(api.createDoctor(formData))
        break
      case 'registry':
        createRole(api.createRegistry(formData))
        break
      case 'expert':
        createRole(api.createExpert(formData))
        break
      default:
        return false
    }
  }

  onChange (e) {
    this.setState({[e.target.name]: e.target.value})

    const errors = this.state.errors && JSON.parse(JSON.stringify(this.state.errors))

    if (errors && errors[e.target.name]) {
      delete errors[e.target.name]
      this.setState({errors})
    }
  }

  render () {
    const { state, props } = this
    const { intl } = props

    return (
      <Modal
        onRequestClose={props.onClose}
      >
        <ModalHeader>
          <h1>{ intl.formatMessage(intlMessages.addWorkerTitle) }</h1>
        </ModalHeader>
        <ModalBody>
          <div className='form-grid'>
            <div className='columns'>
              <div className='column col-12'>
                <Select
                  material
                  label={intl.formatMessage(intlMessages.chooseRole)}
                  value={state.role}
                  onChange={(e) => { this.setState({role: e.target.value}) }}
                >
                  <option value='doctor'>{ intl.formatMessage(commonIntlMessages.labelDoctor) }</option>
                  <option value='registry'>{ intl.formatMessage(commonIntlMessages.labelRegistry) }</option>
                  <option value='expert'>{ intl.formatMessage(commonIntlMessages.labelExpert) }</option>
                </Select>
              </div>
            </div>
            <form ref={(form) => { this.form = form }} onSubmit={this.onSubmit} id='addAssistantForm'>
              <div className='columns'>
                <div className='column col-4'>
                  <MaterialInput
                    name='lastName'
                    value={state.lastName}
                    onChange={e => this.onChange(e)}
                    label={intl.formatMessage(commonIntlMessages.lastName)}
                    error={state.errors && state.errors['lastName'] && state.errors['lastName'][0]}
                  />
                </div>
                <div className='column col-4'>
                  <MaterialInput
                    name='firstName'
                    value={state.firstName}
                    onChange={e => this.onChange(e)}
                    label={intl.formatMessage(commonIntlMessages.firstName)}
                    error={state.errors && state.errors['firstName'] && state.errors['firstName'][0]}
                  />
                </div>
                <div className='column col-4'>
                  <MaterialInput
                    name='middleName'
                    value={state.middleName}
                    onChange={e => this.onChange(e)}
                    label={intl.formatMessage(commonIntlMessages.middleName)}
                    error={state.errors && state.errors['middleName'] && state.errors['middleName'][0]}
                  />
                </div>
              </div>
              <div className='columns'>
                <div className='column col-4'>
                  <MaterialInput
                    phone
                    name='user[phone]'
                    value={state['user[phone]']}
                    onChange={e => this.onChange(e)}
                    label={intl.formatMessage(commonIntlMessages.phone)}
                    error={state.errors && state.errors['user[phone]'] && state.errors['user[phone]'][0]}
                  />
                </div>
                <div className='column col-8'>
                  <MaterialInput
                    name='user[email]'
                    value={state['user[email]']}
                    onChange={e => this.onChange(e)}
                    label={intl.formatMessage(commonIntlMessages.email)}
                    error={state.errors && state.errors['user[email]'] && state.errors['user[email]'][0]}
                  />
                </div>
              </div>
              <Button disabled={!state.role} loading={state.postLoading} size='sm'>{ intl.formatMessage(commonIntlMessages.invite) }</Button>
            </form>
          </div>
        </ModalBody>
      </Modal>
    )
  }
}

export default injectIntl(AddForm)

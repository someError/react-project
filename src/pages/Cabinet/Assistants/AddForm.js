import React, {Component} from 'react'
import Modal, {ModalHeader, ModalBody} from '../../../components/Modal'
import { injectIntl } from 'react-intl'
import { MaterialInput } from '../../../components/Form'
import api from '../../../api'
import Button from '../../../components/Button'

import intlMessages from '../../../i18n/common-messages'

class AddForm extends Component {
  constructor () {
    super()
    this.state = {
      phone: '',
      email: '',
      firstName: '',
      lastName: '',
      middleName: '',
      postLoading: false
    }
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit (e) {
    e.preventDefault()
    this.setState({postLoading: true})
    const formData = new FormData(this.form)
    api.postAssistants(formData)
      .then(({data: {data}}) => {
        this.props.onAdd(data)
        this.props.onClose()
      })
  }

  render () {
    const { state, props } = this
    const { intl } = this.props

    return (
      <Modal
        onRequestClose={props.onClose}
      >
        <ModalHeader>
          <h1>Добавить своего ассистента</h1>
        </ModalHeader>
        <ModalBody>
          <form onSubmit={this.onSubmit} ref={(form) => { this.form = form }} id='addAssistantForm' className='form-grid'>
            <div className='columns'>
              <div className='column col-4'>
                <MaterialInput
                  name='lastName'
                  value={state.lastName}
                  onChange={(e) => { this.setState({lastName: e.target.value}) }}
                  label={intl.formatMessage(intlMessages.lastName)}
                />
              </div>
              <div className='column col-4'>
                <MaterialInput
                  name='firstName'
                  value={state.firstName}
                  onChange={(e) => { this.setState({firstName: e.target.value}) }}
                  label={intl.formatMessage(intlMessages.firstName)}
                />
              </div>
              <div className='column col-4'>
                <MaterialInput
                  name='middleName'
                  value={state.middleName}
                  onChange={(e) => { this.setState({middleName: e.target.value}) }}
                  label={intl.formatMessage(intlMessages.middleName)}
                />
              </div>
            </div>
            <div className='columns'>
              <div className='column col-4'>
                <MaterialInput
                  phone
                  name='user[phone]'
                  value={state.phone}
                  onChange={(e) => { this.setState({phone: e.target.value}) }}
                  label={intl.formatMessage(intlMessages.phone)}
                />
              </div>
              <div className='column col-8'>
                <MaterialInput
                  name='user[email]'
                  value={state.email}
                  onChange={(e) => { this.setState({email: e.target.value}) }}
                  label={intl.formatMessage(intlMessages.email)}
                />
              </div>
            </div>
            <Button loading={state.postLoading} size='sm'>{ intl.formatMessage(intlMessages.invite) }</Button>
          </form>
        </ModalBody>
      </Modal>
    )
  }
}

export default injectIntl(AddForm)

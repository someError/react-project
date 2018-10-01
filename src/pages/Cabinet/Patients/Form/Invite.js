import React, { Component } from 'react'
import { MaterialInput } from '../../../../components/Form'
import Button from '../../../../components/Button'
import linkState from 'linkstate'
import is from 'is_js'
import { injectIntl } from 'react-intl'

import api from '../../../../api'
import Modal, { ModalBody, ModalHeader } from '../../../../components/Modal/index'

import commonIntlMessages from '../../../../i18n/common-messages'

class InviteForm extends Component {
  constructor () {
    super()

    this.state = {
      email: '',
      loading: false
    }

    this.submit = this.submit.bind(this)
  }

  submit (e) {
    e.preventDefault()

    this.setState({
      loading: true
    })

    this.req = api.invitePatient(this.props.patientId, this.state.email)

    this.req
      .then(({ data: { data } }) => {
        this.setState({
          message: data.message
        })
      })
  }

  render () {
    const { intl } = this.props

    return <Modal
      onRequestClose={this.props.onRequestClose}
    >
      <ModalHeader>
        <h1>{ intl.formatMessage(commonIntlMessages.invitePatient) }</h1>
      </ModalHeader>
      <ModalBody>
        <form
          onSubmit={this.submit}
        >
          <div className='form-grid'>
            <div className='columns'>
              <div className='column col-12'>
                <MaterialInput
                  label={intl.formatMessage(commonIntlMessages.email)}
                  value={this.state.email}
                  onChange={linkState(this, 'email')}
                />
              </div>
            </div>
          </div>
          {
            !this.state.message
              ? <Button disabled={this.state.loading || is.not.email(this.state.email)} loading={this.state.loading}>{ intl.formatMessage(commonIntlMessages.invitePatient) }</Button>
              : <div className='color-green'>{ this.state.message }</div>
          }
        </form>
      </ModalBody>
    </Modal>
  }
}

export default injectIntl(InviteForm)

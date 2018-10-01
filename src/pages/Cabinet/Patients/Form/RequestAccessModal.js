import React, { Component } from 'react'
import { connect } from 'react-redux'
import linkState from 'linkstate'
import { injectIntl, FormattedMessage } from 'react-intl'

import { MaterialInput, RadioButton } from '../../../../components/Form/index'
import Modal, { ModalHeader, ModalBody } from '../../../../components/Modal/index'
import Button from '../../../../components/Button/index'
import api from '../../../../api'
import Template from '../../../../components/Template/index'
import ErrorMessage from '../../../../components/Form/ErrorMessage'
import { noop } from '../../../../util'

import commonIntlMessages from '../../../../i18n/common-messages'

class RequestAccessModal extends Component {
  constructor (props) {
    super()

    this.state = {
      type: props.hasReadAccess ? 'read_write' : 'read',
      requestText: '',
      errorMessage: '',
      loading: false
    }
  }

  send () {
    this.setState({
      errorMessage: '',
      loading: true
    })

    this.req = api.requestAccess(this.props.patientId, { access: { ...this.state } })

    this.req
      .then(() => {
        this.props.onSuccess()
      })
      .catch(({ response: { data: { data } } }) => {
        this.setState({
          errorMessage: data.message,
          loading: false
        })
      })

    return this.req
  }

  render () {
    const { intl } = this.props

    return <Modal
      onRequestClose={this.props.onRequestClose}
    >
      <ModalHeader>
        <h1>
          <FormattedMessage
            id='request_access.title'
            defaultMessage='Запросить доступ к медкарте'
          />
        </h1>
      </ModalHeader>
      <ModalBody>
        <form
          onSubmit={(e) => {
            e.preventDefault()

            this.send()
          }}
        >
          <div className='form-grid'>
            <div className='columns'>
              <div className='column col-12'>
                <MaterialInput
                  autoFocus
                  error={!!this.state.errorMessage}
                  value={this.state.requestText}
                  onChange={linkState(this, 'requestText')}
                  label={intl.formatMessage(commonIntlMessages.labelRequestText)}
                />
                <ErrorMessage>{ this.state.errorMessage }</ErrorMessage>
              </div>
            </div>

            <div className='columns'>
              <div className='column col-12'>
                <b>{ intl.formatMessage(commonIntlMessages.accessType) }:</b>{' '}
                {
                  !this.props.hasReadAccess
                    ? <Template>
                      <RadioButton
                        checked={this.state.type === 'read'}
                        onChange={(e) => { this.setState({type: 'read'}) }}
                        label={intl.formatMessage(commonIntlMessages.accessRead)}
                      />{' '}
                    </Template>
                    : null
                }

                <RadioButton
                  checked={this.state.type === 'read_write'}
                  onChange={(e) => { this.setState({type: 'read_write'}) }}
                  label={intl.formatMessage(commonIntlMessages.accessReadWrite)}
                />
              </div>
            </div>
          </div>

          <Button size='sm'>{ intl.formatMessage(commonIntlMessages.sendRequestBtn) }</Button>
        </form>
      </ModalBody>
    </Modal>
  }
}

RequestAccessModal.defaultProps = {
  onSuccess: noop
}

export default injectIntl(connect(({ reference }) => ({ sections: reference.sections }))(RequestAccessModal))

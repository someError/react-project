import React, {Component} from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'
import Modal, {ModalHeader, ModalBody} from '../../../components/Modal'
import { MaterialInput } from '../../../components/Form'
import api from '../../../api'
import withUser from '../../../redux/util/withUser'
import Button from '../../../components/Button'
import OverlaySpinner from '../../../components/Loader/OverlaySpinner'

import commonIntlMessages from '../../../i18n/common-messages'

class ConfirmModal extends Component {
  constructor ({changedProviders}) {
    super()
    this.state = {
      changedProviders,
      code: Object.keys(changedProviders).map(() => {
        return ''
      }),
      errors: Object.keys(changedProviders).map(() => {
        return ''
      })
    }
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit (e) {
    e.preventDefault()
    this.setState({send: true})
    const codes = this.state.code
    const changedProviders = this.state.changedProviders
    const errors = this.state.errors
    codes.map((code, i) => {
      api.confirm(this.props.user.id, code, 'change')
        .then(() => {
          errors.splice(i, 1)
          if (i === codes.length - 1 && !this.state.errors.length) {
            this.props.onClose()
          }

          delete changedProviders[Object.keys(changedProviders)[i]]
          codes.splice(i, 1)

          this.setState({
            changedProviders,
            code: codes
          })
        })
        .catch(() => {
          errors[i] = true
          this.setState({errors})
          this.setState({send: false})
        })
    })
  }

  render () {
    const { props, state } = this
    const { changedProviders } = state

    const { intl } = props

    // FIXME: а от хрен его знает, как вот это всё запихать в intl
    const textTemplate = `${changedProviders.email ? 'почту' : ''}
      ${Object.keys(changedProviders).length === 2 ? ' и ' : ''}
      ${changedProviders.phone ? 'телефон' : ''}`

    return (
      <Modal
        onRequestClose={props.onClose}
      >
        <ModalHeader>
          <h1>Подтвердите { textTemplate }</h1>
          <span>
            Мы отправили код подтверждения на вашу {textTemplate}. Пожалуйста, введите
            { Object.keys(changedProviders).length === 2 ? ' их' : ' его' } ниже.
          </span>
        </ModalHeader>
        <ModalBody>
          { state.send && <OverlaySpinner /> }
          <form className='form-grid' onSubmit={this.onSubmit}>
            <div className='columns'>
              {
                Object.keys(changedProviders).map((key, i) => {
                  return (
                    <div className='column col-6'>
                      <span>{ key === 'phone' ? <FormattedMessage id='label.code.phone' defaultMessage='код для телефона' /> : <FormattedMessage id='label.code.email' defaultMessage='код для почты' />}:</span>{' '}
                      <MaterialInput
                        width={100}
                        error={state.errors[i]}
                        value={state.code[i]}
                        onChange={(e) => {
                          const code = state.code
                          code[i] = e.target.value
                          this.setState({code})
                        }}
                      />
                    </div>
                  )
                })
              }
            </div>
            <Button loading={state.send} size='sm'>{ intl.formatMessage(commonIntlMessages.confirm) }</Button>
          </form>
        </ModalBody>
      </Modal>
    )
  }
}

export default injectIntl(withUser(ConfirmModal))

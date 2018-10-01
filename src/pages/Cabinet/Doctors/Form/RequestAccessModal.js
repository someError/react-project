import React, { Component } from 'react'
import { connect } from 'react-redux'
import linkState from 'linkstate'
import moment from 'moment'

import { MaterialInput, RadioButton } from '../../../../components/Form/index'
import Modal, { ModalHeader, ModalBody } from '../../../../components/Modal/index'
import Button from '../../../../components/Button/index'
import api from '../../../../api'
import Template from '../../../../components/Template/index'

class RequestAccessModal extends Component {
  constructor (props) {
    super()
    this.state = {
      type: 'read',
      doctor: props.doctor,
      requestText: '',
      status: 'allowed',
      allowedFrom: moment().format('YYYY-MM-DDThh:mm:ssZ'),
      postLoading: false,
      card: props.user.card && props.user.card.id
    }
  }

  send () {
    const { postLoading, ...postData } = this.state
    this.setState({ postLoading: true })
    api.postAccessRule({ access: postData })
      .then(({ data: { data } }) => {
        this.setState({ postLoading: false })
        this.props.onSubmit(data)
        this.props.onRequestClose()
      })
      .catch((err) => {
        console.log(err)
        this.setState({ postLoading: false })
      })
  }

  render () {
    return <Modal
      onRequestClose={this.props.onRequestClose}
    >
      <ModalHeader>
        <h1>Предоставить доступ к медкарте</h1>
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
                  value={this.state.requestText}
                  onChange={linkState(this, 'requestText')}
                  label='Текст запроса'
                />
              </div>
            </div>

            <div className='columns'>
              <div className='column col-12'>
                <b>Вид доступа:</b>{' '}
                {
                  !this.props.hasReadAccess
                    ? <Template>
                      <RadioButton
                        checked={this.state.type === 'read'}
                        onChange={(e) => { this.setState({type: 'read'}) }}
                        label='Чтение'
                      />{' '}
                    </Template>
                    : null
                }

                <RadioButton
                  checked={this.state.type === 'read_write'}
                  onChange={(e) => { this.setState({type: 'read_write'}) }}
                  label='Чтение и запись'
                />
              </div>
            </div>
          </div>

          <Button
            loading={this.state.postLoading}
          >
            Отправить запрос
          </Button>
        </form>
      </ModalBody>
    </Modal>
  }
}

export default connect(({ user }) => ({ user }))(RequestAccessModal)

// FIXME: воткнуть intl

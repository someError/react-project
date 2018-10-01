import React, { Component } from 'react'
import { connect } from 'react-redux'
import linkState from 'linkstate'
import moment from 'moment'
import { injectIntl } from 'react-intl'

import { MaterialInput, RadioButton } from '../../../../components/Form'
import Modal, { ModalHeader, ModalBody } from '../../../../components/Modal'
import Button from '../../../../components/Button'
import api from '../../../../api'
import DateInput from '../../../../components/Form/DateInput'
import Select from '../../../../components/Form/Select'
import { Tile, TileIcon, TileContent } from '../../../../components/Tile'
import { noop } from '../../../../util'
import Spinner from '../../../../components/Loader/Spinner'
import { fetchReference } from '../../../../redux/reference/actions'

import commonIntlMessages from '../../../../i18n/common-messages'

class CreateCard extends Component {
  constructor (props) {
    super()

    this.state = {
      firstName: '',
      lastName: '',
      middleName: '',
      iin: '',
      birthday: '',
      sex: 'male',
      blood: '',
      errorMessage: '',
      loading: props.bloods.length < 1
    }
  }

  componentDidMount () {
    if (!this.props.bloods.length) {
      this.props.fetchBloods()
        .then(() => {
          this.setState({
            loading: false
          })
        })
    }
  }

  send () {
    this.setState({
      errorMessage: ''
    })

    this.req = api.postPatient({ patient: { ...this.state } })

    return this.req
  }

  render () {
    const { intl } = this.props

    return <Modal
      onRequestClose={this.props.onRequestClose}
    >
      <ModalHeader>
        <h1>{ intl.formatMessage(commonIntlMessages.addPatientBtn) }</h1>
      </ModalHeader>
      <ModalBody>
        {
          this.state.loading
            ? <Spinner />
            : <form
              onSubmit={(e) => {
                e.preventDefault()

                this.send()
                  .then(({ data: { data } }) => {
                    this.props.onSuccess(data)
                  })
              }}
            >
              <div className='form-grid'>
                <div className='columns'>
                  <div className='column col-12'>
                    <MaterialInput
                      autoFocus
                      value={this.state.firstName}
                      onChange={linkState(this, 'firstName')}
                      label={intl.formatMessage(commonIntlMessages.labelTypeInFirstName)}
                    />
                  </div>
                </div>

                <div className='columns'>
                  <div className='column col-12'>
                    <MaterialInput
                      value={this.state.lastName}
                      onChange={linkState(this, 'lastName')}
                      label={intl.formatMessage(commonIntlMessages.labelTypeInLastName)}
                    />
                  </div>
                </div>

                <div className='columns'>
                  <div className='column col-12'>
                    <MaterialInput
                      value={this.state.middleName}
                      onChange={linkState(this, 'middleName')}
                      label={intl.formatMessage(commonIntlMessages.labelTypeInMidName)}
                    />
                  </div>
                </div>

                <div className='columns'>
                  <div className='column col-4'>
                    <MaterialInput
                      value={this.state.iin}
                      onChange={linkState(this, 'iin')}
                      label={intl.formatMessage(commonIntlMessages.labelIin)}
                    />
                  </div>
                  <div className='column col-4'>
                    <DateInput
                      label={intl.formatMessage(commonIntlMessages.labelBirthDate)}
                      value={!this.state.birthday ? this.state.birthday : moment(this.state.birthday).format('DD.MM.YYYY')}
                      dayPickerProps={{
                        disabledDays: (date) => moment(date).isSameOrAfter(moment().startOf('day')),
                        onDayClick: (date, dateProps) => {
                          if (dateProps.disabled) {
                            return
                          }

                          this.setState({
                            birthday: moment(date).startOf('day').format('YYYY-MM-DDThh:mm:ssZ')
                          })
                        }
                      }}
                    />
                  </div>
                  <div className='column col-4'>
                    <Select
                      material
                      value={this.state.blood}
                      onChange={linkState(this, 'blood')}
                      label={intl.formatMessage(commonIntlMessages.labelBlood)}
                    >
                      <option />
                      {
                        this.props.bloods.map((blood) => <option key={blood.id} value={blood.id}>{ blood.name }</option>)
                      }
                    </Select>
                  </div>
                </div>

                <div className='columns'>
                  <div className='column col-12'>
                    <Tile centered>
                      <TileIcon>{intl.formatMessage(commonIntlMessages.labelGender)}:</TileIcon>
                      <TileContent>
                        <RadioButton checked={this.state.sex === 'male'} onChange={() => { this.setState({ sex: 'male' }) }} label={intl.formatMessage(commonIntlMessages.genderMale)} />{' '}{' '}{' '}
                        <RadioButton checked={this.state.sex === 'female'} onChange={() => { this.setState({ sex: 'female' }) }} label={intl.formatMessage(commonIntlMessages.genderFemale)} />
                      </TileContent>
                    </Tile>
                  </div>
                </div>

              </div>

              <Button size='sm'>{ intl.formatMessage(commonIntlMessages.createButton) }</Button>
            </form>
        }

      </ModalBody>
    </Modal>
  }
}

CreateCard.defaultProps = {
  onRequestClose: noop,
  onSuccess: noop
}

export default injectIntl(connect(
  ({ reference }) => ({ bloods: reference.bloods }),
  (dispatch) => {
    return {
      fetchBloods: function () {
        return dispatch(fetchReference('bloods'))
      }
    }
  }
)(CreateCard))

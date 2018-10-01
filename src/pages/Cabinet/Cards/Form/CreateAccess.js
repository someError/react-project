import React, { Component } from 'react'
import { connect } from 'react-redux'
import linkState from 'linkstate'
import moment from 'moment'
import { injectIntl, defineMessages } from 'react-intl'

import { RadioButton } from '../../../../components/Form'
import Modal, { ModalHeader, ModalBody } from '../../../../components/Modal'
import Button from '../../../../components/Button'
import api from '../../../../api'
import Select from '../../../../components/Form/Select'
import DateInput from '../../../../components/Form/DateInput'
import Checkbox from '../../../../components/Form/Checkbox'
import Autocomplete from '../../../../components/Form/Autocomplete'

import commonIntlMessages from '../../../../i18n/common-messages'

const intlMessages = defineMessages({
  header: {
    id: 'access.form.header',
    description: 'заголовок формы добавки доступа к карте',
    defaultMessage: 'Создать доступ к медкарте'
  },
  fullAccess: {
    id: 'access.option.full',
    description: 'текст пункта "Полный доступ к медкарте"',
    defaultMessage: 'Полный доступ к медкарте'
  }
})

class CreateAccessModal extends Component {
  constructor () {
    super()

    this.state = {
      type: 'read',
      doctor: {},
      organization: {},
      allowedFrom: moment().startOf('day').format(),
      allowedTo: '',
      section: '',
      hasNoExpire: true
    }
  }

  send () {
    api.postAccessRule({
      access: {
        ...this.state,
        doctor: this.state.doctor.id || null,
        organization: this.state.organization.id || null,
        card: this.props.cardId,
        status: 'allowed'
      }
    })
      .then(({ data: { data } }) => {
        this.props.onSuccess(data)
      })
  }

  componentWillUpdate (nextProps, nextState) {
    if (nextState.hasNoExpire !== this.state.hasNoExpire) {
      this.setState({
        allowedTo: nextState.hasNoExpire ? '' : moment(this.state.allowedFrom).add(1, 'days').endOf('day').format()
      })
    }
  }

  render () {
    const { intl } = this.props

    return <Modal
      onRequestClose={this.props.onRequestClose}
    >
      <ModalHeader>
        <h1>{ intl.formatMessage(intlMessages.header) }</h1>
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
                <Select
                  onChange={linkState(this, 'section')}
                  value={this.state.section}
                  material
                  label={intl.formatMessage(commonIntlMessages.labelChooseSection)}
                >
                  <option value={''}>{ intl.formatMessage(intlMessages.fullAccess) }</option>
                  {
                    this.props.sections.map((section) => <option key={section.id} value={section.id}>{ section.name }</option>)
                  }
                </Select>
              </div>
            </div>
            <div className='columns'>
              <div className='column col-12'>
                <Autocomplete
                  label={intl.formatMessage(commonIntlMessages.labelDoctor)}
                  requestSuggestions={(q) => api.searchDoctors(q)}
                  getSuggestionValue={(suggestion) => {
                    return `${suggestion.firstName} ${suggestion.lastName}`
                  }}
                  renderSuggestion={(suggestion) => {
                    return `${suggestion.firstName} ${suggestion.lastName}`
                  }}
                  onSuggestionSelected={(e, { suggestion }) => {
                    this.setState({
                      doctor: suggestion
                    })
                  }}
                />
              </div>
            </div>
            <div className='columns'>
              <div className='column col-12'>
                <Autocomplete
                  label={intl.formatMessage(commonIntlMessages.labelOrg)}
                  requestSuggestions={(q) => api.searchOrganizations(q)}
                  onSuggestionSelected={(e, { suggestion }) => {
                    this.setState({
                      organization: suggestion
                    })
                  }}
                />
              </div>
            </div>

            <div className='columns'>
              <div className='column col-12'>
                <b>{intl.formatMessage(commonIntlMessages.accessType)}:</b>{' '}
                <RadioButton
                  checked={this.state.type === 'read'}
                  onChange={(e) => { this.setState({type: 'read'}) }}
                  label={intl.formatMessage(commonIntlMessages.accessRead)}
                />{' '}
                <RadioButton
                  checked={this.state.type === 'read_write'}
                  onChange={(e) => { this.setState({type: 'read_write'}) }}
                  label={intl.formatMessage(commonIntlMessages.accessReadWrite)}
                />
              </div>
            </div>

            <div className='columns'>
              <div className='column col-12'>
                <b>{intl.formatMessage(commonIntlMessages.activePeriodLabel)}:</b>{' '}

                <div className='form-grid'>
                  <div className='columns'>
                    <div className='column col-4'>
                      <DateInput
                        label={intl.formatMessage(commonIntlMessages.startsLabel)}
                        value={moment(this.state.allowedFrom).format('DD.MM.YYYY')}
                        dayPickerProps={{
                          disabledDays: (date) => moment(date).isSameOrBefore(moment().startOf('day')),
                          onDayClick: (date, dateProps) => {
                            if (dateProps.disabled) {
                              return
                            }

                            this.setState({
                              allowedFrom: moment(date).startOf('day').format()
                            })
                          }
                        }}
                      />
                    </div>
                    <div className='column col-4'>
                      <DateInput
                        disabled={this.state.hasNoExpire}
                        label={intl.formatMessage(commonIntlMessages.endsLabel)}
                        value={this.state.allowedTo ? moment(this.state.allowedTo).format('DD.MM.YYYY') : ''}
                        dayPickerProps={{
                          disabledDays: (date) => moment(moment().startOf('day')).isAfter(date),
                          onDayClick: (date, dateProps) => {
                            if (dateProps.disabled) {
                              return
                            }

                            this.setState({
                              allowedTo: moment(date).endOf('day').format()
                            })
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>

                <Checkbox
                  checked={this.state.hasNoExpire}
                  onChange={() => { this.setState({hasNoExpire: !this.state.hasNoExpire}) }}
                  label={intl.formatMessage(commonIntlMessages.accessUnlimited)}
                />
              </div>
            </div>
          </div>

          <Button size='sm'>{ intl.formatMessage(commonIntlMessages.createButton) }</Button>
        </form>
      </ModalBody>
    </Modal>
  }
}

export default injectIntl(connect(({ reference }) => ({ sections: reference.sections }))(CreateAccessModal))

import React, { Component } from 'react'
import cloneDeep from 'lodash/cloneDeep'
import { injectIntl, defineMessages } from 'react-intl'

import { MaterialInput } from '../../../../components/Form'
import RadioGroup, { RadioGroupButton } from '../../../../components/Form/RadioGroup'
import Autocomplete from '../../../../components/Form/Autocomplete'
import FeatherIcon from '../../../../components/Icons/FeatherIcon'

import api from '../../../../api'
import ErrorMessage from '../../../../components/Form/ErrorMessage'

import commonIntlMessages from '../../../../i18n/common-messages'

const intlMessages = defineMessages({
  medication: {
    id: 'form.medication.label.medication',
    defaultMessage: 'Препарат'
  },
  quantity: {
    id: 'form.medication.label.quantity',
    defaultMessage: 'Количество'
  },
  pills: {
    id: 'form.medication.label.pills',
    defaultMessage: 'таблетки'
  },
  ml: {
    id: 'form.medication.label.ml',
    defaultMessage: 'мл'
  },
  mg: {
    id: 'form.medication.label.mg',
    defaultMessage: 'мг'
  },
  addMedication: {
    id: 'form.medication.add_btn',
    defaultMessage: 'Добавить препарат'
  }
})

export const DRUG_SCHEME = {
  drug: {
    id: '',
    name: ''
  },
  drugName: '',
  value: '',
  type: 'pill',
  comment: ''
}

class MedicationsForm extends Component {
  constructor (props) {
    super()

    this.state = {
      items: props.defaultItems || [{...DRUG_SCHEME}]
    }
  }

  add () {
    const items = cloneDeep(this.state.items)

    items.push({...DRUG_SCHEME})

    this.setState({items})
  }

  updateItem (i, values) {
    const items = cloneDeep(this.state.items)

    items[i] = {
      ...items[i],
      ...values
    }

    this.setState({items})

    return items
  }

  componentWillReceiveProps (nextProps) {
    // FIXME: костыль. для формы событий. потому что хз, почему она себя там так ведёт
    if (this.props.keepDefaultInSync) {
      this.setState({
        items: nextProps.defaultItems
      })
    }
  }

  render () {
    const { onChange, errors, intl } = this.props

    return <div>
      {
        this.state.items.map((item, i) => {
          return <div className='form-grid' key={i}>
            <div className='columns'>
              <div className='column col-12'>
                <Autocomplete
                  label={intl.formatMessage(intlMessages.medication)}
                  defaultValue={(item.drug && item.drug.name) || item.drugName}
                  requestSuggestions={(q) => api.getReference('drugs', { name: q })}
                  onSuggestionSelected={(e, { suggestion }) => { onChange(this.updateItem(i, { drug: suggestion, drugName: null })) }}
                  inputProps={{
                    error: !!(errors[i] && errors[i].drug),
                    onChange: (e, { newValue }) => {
                      onChange(this.updateItem(i, { drug: {}, drugName: newValue }))
                    }
                  }}
                  highlightFirstSuggestion
                />
                <ErrorMessage>{ errors[i] && errors[i].drug }</ErrorMessage>
              </div>
            </div>
            <div className='columns'>
              <div className='column col-6'>
                <MaterialInput
                  value={item.value}
                  onChange={(e) => { onChange(this.updateItem(i, { value: e.target.value })) }}
                  label={intl.formatMessage(intlMessages.quantity)}
                  error={!!(errors[i] && errors[i].value)}
                />
                <ErrorMessage>{ errors[i] && errors[i].value }</ErrorMessage>
              </div>
              <div className='column col-6' style={{ paddingTop: '15px' }}>
                <RadioGroup name='type' onChange={(e) => { onChange(this.updateItem(i, {type: e.target.value})) }}>
                  <RadioGroupButton value='pill' label={intl.formatMessage(intlMessages.pills)} checked={item.type === 'pill'} />
                  <RadioGroupButton value='milligram' label={intl.formatMessage(intlMessages.mg)} checked={item.type === 'milligram'} />
                  <RadioGroupButton value='milliliter' label={intl.formatMessage(intlMessages.ml)} checked={item.type === 'milliliter'} />
                </RadioGroup>
              </div>
            </div>
            <div className='columns'>
              <div className='column col-12'>
                <MaterialInput
                  value={item.comment}
                  onChange={(e) => { onChange(this.updateItem(i, { comment: e.target.value })) }}
                  label={intl.formatMessage(commonIntlMessages.noteLabel)}
                />
              </div>
            </div>
          </div>
        })
      }

      <span className='add-param' onClick={(e) => { this.add() }}>
        <FeatherIcon icon='plus-circle' size={20} /> { intl.formatMessage(intlMessages.addMedication) }
      </span>
    </div>
  }
}

MedicationsForm.defaultProps = {
  errors: {}
}

export default injectIntl(MedicationsForm)

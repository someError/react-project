import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { fetchReference } from '../../../../redux/reference/actions'
import { Select, MaterialInput, ErrorMessage } from '../../../../components/Form'
import { Spinner } from '../../../../components/Loader'
import FeatherIcon from '../../../../components/Icons/FeatherIcon'
import Template from '../../../../components/Template/index'
import { noop } from '../../../../util'

class ParametersForm extends PureComponent {
  constructor (props) {
    super()

    this.state = {
      loading: true
    }
  }

  updateItem (i, values) {
    const items = [].concat(this.props.items)

    items[i] = {
      ...items[i],
      ...values
    }

    return items
  }

  render () {
    const { onChange, errors, user } = this.props

    const disableNorms = user.entity_type !== 'patient'

    console.log(errors)

    return <div className='form-group'>
      {
        this.props.loading
          ? <Spinner />
          : this.props.items.map((item, i) => {
            return <div className='form-grid form-group--item' key={i}>
              <div className='columns'>
                <div className='column col-1-1'>
                  <Select
                    material
                    label='Выберите параметр'
                    value={item.parameter.id}
                    onChange={(e) => {
                      const { value } = e.target
                      this.props.onParamChange(i, this.props.parameters.find((param) => param.id === value), e)
                    }}
                    error={!!(errors && errors[i] && (errors[i].parameter || errors[i].parameterName))}
                    pad
                  >
                    { this.props.parameters.map((param) => <option key={param.id} value={param.id}>{param.name}</option>) }
                  </Select>
                  <ErrorMessage>{ errors && errors[i] && (errors[i].parameter || errors[i].parameterName) }</ErrorMessage>
                </div>
              </div>
              <Template if={!!item.units}>
                <div className='columns'>
                  <div className='column col-6 col-xs-12'>
                    <MaterialInput
                      value={item.value}
                      onChange={(e) => { onChange(this.updateItem(i, {value: e.target.value})) }}
                      label='Введите значение'
                      error={!!(errors && errors[i] && errors[i].value)}
                      pad
                    />
                    <ErrorMessage>{errors && errors[i] && errors[i].value}</ErrorMessage>
                  </div>
                  <div className='column col-6 col-xs-12'>
                    <Select
                      material
                      label={'Ед. измерения'}
                      value={item.unit.id}
                      onChange={(e) => {
                        onChange(this.updateItem(i, {unit: item.units.find((u) => e.target.value === u.id)}))
                      }}
                      error={!!(errors && errors[i] && errors[i].unit)}
                      pad
                    >
                      {
                        item.units.map((unit) => <option key={unit.id} value={unit.id}>{unit.name}</option>)
                      }
                    </Select>
                    <ErrorMessage>{errors && errors[i] && errors[i].unit}</ErrorMessage>
                  </div>
                </div>
                <div className='columns'>
                  <div className='column col-6'>
                    <MaterialInput
                      disabled={disableNorms}
                      value={item.normalValueFrom}
                      onChange={(e) => { onChange(this.updateItem(i, {normalValueFrom: e.target.value})) }}
                      label='Норма, от'
                      pad
                    />
                  </div>
                  <div className='column col-6'>
                    <MaterialInput
                      disabled={disableNorms}
                      value={item.normalValueTo}
                      onChange={(e) => { onChange(this.updateItem(i, {normalValueTo: e.target.value})) }}
                      label='Норма, до'
                      pad
                    />
                  </div>
                </div>
                <div className='columns'>
                  <div className='column col-12'>
                    <MaterialInput
                      value={item.comment}
                      onChange={(e) => { onChange(this.updateItem(i, {comment: e.target.value})) }}
                      label='Примечание'
                      pad
                    />
                  </div>
                </div>
              </Template>
            </div>
          })
      }

      <span className='add-param' onClick={(e) => { this.props.onAddClick() }}>
        <FeatherIcon icon='plus-circle' size={20} /> Добавить параметр
      </span>
    </div>
  }
}

ParametersForm.propTypes = {
  onChange: PropTypes.func
}

ParametersForm.defaultProps = {
  onChange: noop,
  errors: []
}

const mapStateToProps = ({ reference, user }) => {
  return {
    user,
    parameters: reference.parameters
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchParameters: function () {
      return dispatch(fetchReference('parameters', { limit: 100 }))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ParametersForm)

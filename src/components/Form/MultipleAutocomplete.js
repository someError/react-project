import React, {Component} from 'react'

import api from '../../api'

import PropTypes from 'prop-types'
import Autosuggest from 'react-autosuggest'

import { MaterialInput } from '../Form'
import { Card } from '../Card'

import './Autocomplete.css'

const theme = {
  container: 'form-autocomplete',
  containerOpen: 'form-autocomplete--open',
  input: 'form-input',
  inputOpen: 'form-input--open',
  inputFocused: 'react-autosuggest__input--focused',
  suggestionsContainer: 'form-autocomplete__suggestions-container',
  suggestionsContainerOpen: 'form-autocomplete__suggestions-container--open',
  suggestionsList: 'suggestions-list',
  suggestion: 'suggestions-list__item',
  suggestionFirst: 'suggestions-list__item--first',
  suggestionHighlighted: 'suggestions-list__item--highlighted',
  sectionContainer: 'suggestions-list__section-container',
  sectionContainerFirst: 'suggestions-list__section-container--first',
  sectionTitle: 'suggestions-list__section-title'

}
// TODO: поменялся компонент Autocomplete, пришлось скопипастить старую версию, как нибудь надо будет сделать нормально...
class Autocomplete extends Component {
  constructor (props) {
    super()

    this.state = {
      value: props.defaultValue || '',
      suggestions: []
    }

    this.requestSuggestions = this.requestSuggestions.bind(this)
  }

  requestSuggestions (data) {
    this.req = this.props.requestSuggestions(data.value)
    if (this.req) {
      this.req.then(({ data: { data } }) => {
        this.setState({
          suggestions: data.items
        })
      })
    }
  }

  render () {
    const { state, props } = this
    const { placeholder, label, onSuggestionSelected, onBlur, onFocus, getSuggestionValue, renderSuggestion, error } = this.props

    return <Autosuggest
      theme={theme}
      suggestions={state.suggestions}
      getSuggestionValue={getSuggestionValue}
      onSuggestionsFetchRequested={this.requestSuggestions}
      renderSuggestion={renderSuggestion}
      onSuggestionsClearRequested={() => { this.setState({ suggestions: [] }) }}
      renderSuggestionsContainer={({ containerProps, children, ...props }) => {
        return <div{...containerProps}><Card>{ children }</Card></div>
      }}
      onSuggestionSelected={onSuggestionSelected}
      inputProps={
        {
          value: (props.value !== null && props.value !== undefined) ? props.value : (state.value || ''),
          placeholder,
          label: label,
          error,
          onChange: (event, { newValue }) => {
            if (props.onChange) {
              props.onChange(event, newValue)
            } else {
              this.setState({
                value: newValue
              })
            }
          },
          onBlur,
          onFocus
        }
      }
      renderInputComponent={(inputProps) => {
        return <MaterialInput {...inputProps} />
      }}
    />
  }
}

Autocomplete.propTypes = {
  requestSuggestions: PropTypes.func.isRequired,
  getSuggestionValue: PropTypes.func,
  renderSuggestion: PropTypes.func,
  defaultValue: PropTypes.string
}

Autocomplete.defaultProps = {
  getSuggestionValue: (suggestion) => suggestion.name || '',
  renderSuggestion: (suggestion) => suggestion.name || '',
  defaultValue: ''
}

class MultipleAutocomplete extends Component {
  constructor (props) {
    super()
    this.state = {
      array: props.array,
      string: props.array.map((specialty) => {
        return specialty[props.searchField]
      }).join(', ')
    }
  }
  render () {
    const { state, props } = this
    const { searchField, error } = props
    return (
      <Autocomplete
        label={props.label}
        defaultValue={state.array.map((specialty) => {
          return (specialty && specialty[searchField]) || ''
        }).join(', ')}
        getSuggestionValue={(suggestion) => suggestion[searchField] || ''}

        requestSuggestions={(q) => {
          q = q.split(',')
          return api.getReference(props.reference, { [searchField]: q[q.length - 1].trim() })
        }}

        onChange={(e, newValue) => {
          const valuesArr = newValue.split(',')
          let valuesString = null
          const _specialties = JSON.parse(JSON.stringify(state.array))

          valuesArr.map((value, i) => {
            if (_specialties[i] && newValue.length < state.string.length && (_specialties[i][searchField || 'name'] !== value.trim())) {
              _specialties.splice(i, 1)
              valuesArr.splice(i, 1)
              valuesString = valuesArr.map((specialty) => {
                return specialty
              }).join(', ')
              props.onChange(_specialties)
              this.setState({array: _specialties})
            }
          })
          this.setState({string: valuesString || newValue})
        }}

        onBlur={() => {
          let string = state.string.trim()
          if (string.slice(-1) === ',') {
            string = string.slice(0, -1)
            this.setState({string})
          }
        }}

        onFocus={() => {
          this.setState({string: state.string + ', '})
        }}

        value={state.string}

        error={error}

        onSuggestionSelected={(e, { suggestion }) => {
          const _array = JSON.parse(JSON.stringify(state.array))
          const inArr = _array.filter(item => item.id === suggestion.id).length
          if (!inArr) _array.push(suggestion)

          props.onChange(_array)
          this.setState({
            array: _array,
            string: _array.map((item) => {
              return (item && item[searchField])
            }).join(', ') + ', '
          })
        }}
      />
    )
  }
}

export default MultipleAutocomplete

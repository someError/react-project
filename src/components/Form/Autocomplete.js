import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Autosuggest from 'react-autosuggest'

import { MaterialInput } from '../Form'
import { Card } from '../Card'
import { noop } from '../../util'

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
    if (this.props.requestSuggestions) {
      this.props.requestSuggestions(data.value)
        .then((res) => {
          if (res.data) {
            return res.data.data.items
          } else {
            return res
          }
        })
        .then((items) => {
          this.setState({
            suggestions: items
          })
        })
    }
  }

  render () {
    const { state } = this
    const {
      placeholder,
      label,
      onSuggestionSelected,
      requestOnFocus,
      getSuggestionValue,
      highlightFirstSuggestion,
      renderSuggestion,
      shouldRenderSuggestions,
      inputProps
    } = this.props

    let { onChange, ...iProps } = inputProps

    if (!onChange) {
      onChange = noop
    }

    return <Autosuggest
      theme={theme}
      highlightFirstSuggestion={highlightFirstSuggestion}
      suggestions={state.suggestions}
      getSuggestionValue={getSuggestionValue}
      onSuggestionsFetchRequested={this.requestSuggestions}
      renderSuggestion={renderSuggestion}
      shouldRenderSuggestions={requestOnFocus ? () => true : shouldRenderSuggestions}
      onSuggestionsClearRequested={() => { this.setState({ suggestions: [] }) }}
      renderSuggestionsContainer={({ containerProps, children, ...props }) => {
        return <div {...containerProps}><Card>{ children }</Card></div>
      }}
      onSuggestionSelected={onSuggestionSelected}
      inputProps={{
        value: state.value || '',
        placeholder,
        label: label,
        onFocus: (e) => {
          if (requestOnFocus) {
            this.requestSuggestions({ value: e.target.value })
          }
        },
        onBlur: (e, { highlightedSuggestion }) => {
          if (highlightedSuggestion) {
            if (state.suggestions.length < 2) {
              onSuggestionSelected(e, {suggestion: highlightedSuggestion})

              this.setState({
                value: getSuggestionValue(highlightedSuggestion)
              })
            }
          }

          if (inputProps && inputProps.onBlur) {
            inputProps.onBlur(e, { highlightedSuggestion })
          }
        },
        onChange: (e, d) => {
          this.setState({
            value: d.newValue
          })
          if (onChange) {
            onChange(e, d)
          }
        },
        ...iProps
      }}
      renderInputComponent={(inputProps) => {
        return <MaterialInput {...inputProps} />
      }}
    />
  }
}

Autocomplete.propTypes = {
  requestSuggestions: PropTypes.func,
  getSuggestionValue: PropTypes.func,
  renderSuggestion: PropTypes.func,
  shouldRenderSuggestions: PropTypes.func,
  defaultValue: PropTypes.string,
  highlightFirstSuggestion: PropTypes.bool,
  requestOnFocus: PropTypes.bool
}

Autocomplete.defaultProps = {
  getSuggestionValue: (suggestion) => suggestion.name || '',
  renderSuggestion: (suggestion) => suggestion.name || suggestion.title || '',
  highlightFirstSuggestion: false,
  defaultValue: '',
  requestOnFocus: true,
  inputProps: {}
}

export default Autocomplete

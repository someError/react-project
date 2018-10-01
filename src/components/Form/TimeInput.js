import React, { Component } from 'react'
import moment from 'moment'

import MaterialInput from './MaterialInput'
import { noop } from '../../util'

const TIME_FORMAT = 'HH:mm'

class TimeInput extends Component {
  constructor (props) {
    super()
    this.state = {
      value: props.defaultValue || ''
    }

    this.handleChange = this.handleChange.bind(this)
    this.format = this.format.bind(this)

    this.prevVal = this.state.value
  }

  handleChange (e) {
    let { value } = e.target

    if (value.length === 2 && this.prevVal.length !== 3 && value.indexOf(':') === -1) {
      value = value + ':'
    }

    if (value.length === 2 && this.prevVal.length === 3) {
      value = value.slice(0, 1)
    }

    if (value.length > 5) {
      return false
    }

    this.prevVal = value

    this.setState({
      value
    })

    if (value.length === 5) {
      this.props.onChange(value)
    }
  }

  format (e) {
    let value = e.target.value
    const d = moment(value, TIME_FORMAT)

    if (d.isValid()) {
      value = d.format(TIME_FORMAT)
    } else {
      value = moment().format(TIME_FORMAT)
    }

    if (value === e.target.value) {
      return
    }

    this.setState({
      value
    })

    this.props.onChange(value)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.defaultValue === '') {
      this.setState({value: ''})
    }
    if (this.props.defaultValue !== nextProps.defaultValue) {
      this.setState({value: nextProps.defaultValue})
    }
  }

  render () {
    const { onChange, value, onBlur, width, label, icon = 'clock', defaultValue, ...props } = this.props

    return <MaterialInput
      label={typeof label === 'undefined' ? 'Время' : label}
      onChange={this.handleChange}
      onBlur={this.format}
      value={this.state.value}
      width='100px'
      icon={icon}
      {...props}
    />
  }
}

TimeInput.defaultProps = {
  onChange: noop
}

export default TimeInput

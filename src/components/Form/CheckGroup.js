import React, { Component } from 'react'
import isEqual from 'lodash/isEqual'

import { removeFromArray, noop } from '../../util'

import './CheckGroup.css'

class CheckGroup extends Component {
  constructor (props) {
    super()

    this.state = {
      checked: props.defaultValue || (props.valueOnEmpty ? [props.valueOnEmpty] : [])
    }

    this.handleChange = this.handleChange.bind(this)
  }

  componentWillUpdate (nextProps, nextState) {
    if (!nextState.checked.length) {
      this.setState({
        checked: [this.props.valueOnEmpty]
      })
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if (!isEqual(this.state.checked, prevState.checked)) {
      this.props.onChange(this.state.checked)
    }
  }

  handleChange (e) {
    const { target } = e
    const val = Number(target.value)
    const { checked } = this.state

    let newArray

    if (!target.checked) {
      if (this.props.valueOnEmpty) {
        if (checked.length === 1 && checked[0] === this.props.valueOnEmpty) {
          return
        }
      }

      newArray = removeFromArray(this.state.checked, (d) => d === val)
    } else {
      newArray = [].concat(this.state.checked)
      newArray.push(val)
    }

    this.setState({
      checked: newArray
    })
  }

  render () {
    const { children } = this.props

    return <div className='check-group'>
      { children.map((child, i) => React.cloneElement(child, { key: child.props.key || i, checked: this.state.checked.indexOf(child.props.value) > -1, onChange: this.handleChange })) }
    </div>
  }
}

CheckGroup.defaultProps = {
  onChange: noop,
  defaultValue: []
}

export default CheckGroup

export const CheckGroupButton = ({ children, ...props }) => {
  return <label className='check-group-item'>
    <input type='checkbox' {...props} />
    <span>{ children }</span>
  </label>
}

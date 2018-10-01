import React, { Component } from 'react'
import chunk from 'lodash/chunk'
import { noop, removeFromArray } from '../../util'
import isEqual from 'lodash/isEqual'

import Popper from 'popper.js'
import Template from '../Template/index'
import Card from '../Card/Card'

import './MonthDaysSelected.css'
import FeatherIcon from '../Icons/FeatherIcon'

const nums = (() => {
  const arr = []
  let i = 1

  while (i <= 31) {
    arr.push(i)
    i++
  }

  return arr
})()

class MonthDaysSelect extends Component {
  constructor (props) {
    super()

    this.state = {
      show: false,
      selected: props.selected
    }

    this.hide = this.hide.bind(this)
    this.toggleClick = this.toggleClick.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (!isEqual(this.props.selected, nextProps.selected)) {
      this.setState({
        selected: nextProps.selected
      })
    }
  }

  hide () {
    if (this.state.show) {
      this.setState({
        show: false
      })
    }
  }

  toggleClick (e) {
    e.stopPropagation()
    e.nativeEvent.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()

    this.setState({
      show: !this.state.show
    })
  }

  componentDidUpdate (nextProps, nextState) {
    if (nextState.show !== this.state.show) {
      this.popper.update()
    }

    if (!isEqual(this.state.selected, nextState.selected)) {
      this.props.onChange(this.state.selected)
    }
  }

  componentDidMount () {
    this.popper = new Popper(this.root, this.cal, {
      placement: 'bottom',
      modifiers: {
        flip: {
          behavior: ['left', 'bottom', 'top']
        }
      }
    })

    // if (this.state.show) {
    //   document.addEventListener('click', this.hide, true)
    // }
  }

  toggleDay (day) {
    let selected = [].concat(this.state.selected)

    if (selected.indexOf(day) > -1) {
      selected = removeFromArray(selected, (d) => d === day)
    } else {
      selected.push(day)
    }

    this.setState({
      selected
    })
  }

  getSortedSelected () {
    return this.state.selected.sort((a, b) => {
      if (a > b) {
        return 1
      } else if (a < b) {
        return -1
      } else {
        return 0
      }
    })
  }

  isDaySelected (d) {
    return this.state.selected.indexOf(d) > -1
  }

  hasSelected () {
    return this.state.selected.length > 0
  }

  render () {
    const daysChunks = chunk(this.getSortedSelected(), 5)

    return <Template>
      <span className='color-blue' onClick={this.toggleClick} ref={(root) => { this.root = root }}>
        {
          this.hasSelected()
            ? <Template>{ daysChunks[0].join(', ') }{ daysChunks.length > 1 ? '…' : null } числа</Template>
            : 'выбрать числа'
        }
        <FeatherIcon size={16} icon='chevron-down' />
      </span>
      <div
        style={{ display: !this.state.show ? 'none' : '', zIndex: 100 }}
        ref={(cal) => { this.cal = cal }}
        onClick={(e) => {
          e.stopPropagation()
          e.nativeEvent.stopPropagation()
          e.nativeEvent.stopImmediatePropagation()
        }}
      >
        <Card>
          <div className='days-selector'>
            {
              chunk(nums, 7)
                .map((row) => {
                  return <div key={row.join('-')}>
                    {
                      row.map((n) => <span
                        className={`${this.isDaySelected(n) ? 'active' : ''}`}
                        onClick={() => {
                          this.toggleDay(n)
                        }} key={n}
                      >
                        { n }
                      </span>)
                    }
                  </div>
                })
            }
          </div>
        </Card>
      </div>
    </Template>
  }
}

MonthDaysSelect.defaultProps = {
  onDayClick: noop,
  selected: []
}

export default MonthDaysSelect

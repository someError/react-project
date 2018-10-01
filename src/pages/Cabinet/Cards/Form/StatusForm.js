import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Tile, TileContent, TileAction } from '../../../../components/Tile'
import { RadioGroup, RadioGroupButton } from '../../../../components/Form'
import Button from '../../../../components/Button'
import { noop } from '../../../../util'

class StatusForm extends PureComponent {
  constructor (props) {
    super()

    this.state = {
      status: props.status
    }
  }

  render () {
    const { status } = this.state
    const { onSubmit, onStatusChange, disabled, className } = this.props

    return <form onSubmit={(e) => { e.preventDefault(); onSubmit(this.state, e) }} className={classNames('record-controls', className)}>
      <Tile centered>
        <TileContent>
          <RadioGroup name='status' label='Статус записи: ' onChange={(e) => { this.setState({ status: e.target.value }); onStatusChange(e) }}>
            <RadioGroupButton value='new' label='черновик' checked={status === 'new'} />
            <RadioGroupButton value='sign' label='публикация' checked={status === 'sign'} />
          </RadioGroup>
        </TileContent>
        <TileAction>
          <Button disabled={disabled} size='xs'>{ status === 'new' ? 'Сохранить' : 'Опубликовать' }</Button>
        </TileAction>
      </Tile>
    </form>
  }
}

StatusForm.propTypes = {
  onSubmit: PropTypes.func,
  onStatusChange: PropTypes.func,
  status: PropTypes.string,
  disabled: PropTypes.bool
}

StatusForm.defaultProps = {
  onSubmit: noop,
  onStatusChange: noop,
  disabled: false
}

export default StatusForm

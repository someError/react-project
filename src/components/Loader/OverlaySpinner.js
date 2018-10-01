import React from 'react'
import classNames from 'classnames'

import Spinner from './Spinner'

import './OverlaySpinner.css'

const OverlaySpinner = (props) => {
  return <div className={classNames('overlay-spinner', {'overlay-spinner--page': props.initial})}>
    <Spinner />
  </div>
}

export default OverlaySpinner

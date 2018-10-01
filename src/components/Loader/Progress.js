import React from 'react'
import classNames from 'classnames'

import './Progress.css'

const Progress = ({ percent, className, ...props }) => {
  return <div className='progress'><div className={classNames('progress-bar', className)} style={{ width: `${percent}%` }} {...props} /></div>
}

export default Progress

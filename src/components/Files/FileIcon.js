import React from 'react'
import PropTypes from 'prop-types'

import './FileIcon.css'

const FileIcon = ({ color, ext }) => {
  return <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 28 32' height='32' width='28'>
    <path className={`file-path file-color--${ext}`} d='M2 0h16.993L28 8.972V30a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2z' fill={color} />
    <path d='M28 9h-6.994A2.006 2.006 0 0 1 19 6.996V0l9 9z' fill='#000' style={{opacity: 0.3}} />
    <foreignObject style={{ width: '100%' }}>
      <span className='file-icon__ext'>
        { ext }
      </span>
    </foreignObject>
  </svg>
}

FileIcon.defaultProps = {
}

FileIcon.propTypes = {
  color: PropTypes.string
}

export default FileIcon

import React from 'react'

const Dropdown = ({ text, items }) => {
  return <div className='dropdown'>
    <span className='btn btn-link dropdown-toggle' tabIndex='0'>{ text } <i className='icon icon-caret' /></span>
    <ul className='menu'>
      {
        items.map((item, i) => <li key={i} className='menu-item'>{ item }</li>)
      }
    </ul>
  </div>
}

export default Dropdown

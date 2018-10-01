import React from 'react'
import classNames from 'classnames'
import './ServiceList.css'

const ServiceList = ({ children, className }) => {
  return (
    <ul className={`service-list ${classNames(className)}`}>
      { children }
    </ul>
  )
}

export default ServiceList

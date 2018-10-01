import React from 'react'
import './DoctorScheduleHeader.css'

const DoctorScheduleHeader = (props) => {
  return (
    <div className='doctor-schedule-header'>
      { props.title ? <h2 className='single-title'>{ props.title }</h2> : props.children }
    </div>
  )
}
export default DoctorScheduleHeader

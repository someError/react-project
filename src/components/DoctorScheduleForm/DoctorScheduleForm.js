import React from 'react'
import './DoctorScheduleForm.css'
import classNames from 'classnames'

const DoctorScheduleForm = (props) => {
  return (
    <form id={classNames(props.id)} className={`doctor-schedule-form ${classNames(props.className)}`} onSubmit={props.onSubmit}>
      { props.children }
    </form>
  )
}
export default DoctorScheduleForm

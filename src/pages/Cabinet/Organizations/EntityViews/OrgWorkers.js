import React, {Component} from 'react'
import { FormattedMessage } from 'react-intl'
import Button from '../../../../components/Button'
import ListItem from '../../Doctors/EntityViews/DoctorListItem'
import api from '../../../../api'
import { Spinner, OverlaySpinner } from '../../../../components/Loader'
import './OrgWorkers.css'

class Workers extends Component {
  constructor (props) {
    super()
    this.state = {
      doctors: props.initialDoctors,
      loading: false,
      specialties: JSON.parse(JSON.stringify(props.specialties)).splice(0, 4),
      specialty: props.specialties[0].id,
      itemIndex: null
    }
    this.fetchDoctors = this.fetchDoctors.bind(this)
  }

  fetchDoctors (specialty) {
    const { orgId } = this.props
    this.setState({
      loading: true,
      specialty: specialty
    })

    api.getDoctors({organizations: [orgId], specialties: [specialty]})
      .then(({data: {data}}) => {
        this.setState({
          doctors: data.items,
          loading: false,
          itemIndex: null
        })
      })
  }

  render () {
    const { props, state } = this
    if (!state.doctors) return <Spinner />
    return (
      <div className='l-workers'>
        <div className='l-workers__header'>
          {
            state.specialties.map((specialty) => {
              return (
                <Button
                  key={specialty.id}
                  size='xs'
                  ghost={specialty.id !== state.specialty}
                  onClick={() => specialty.id !== state.specialty && this.fetchDoctors(specialty.id)}>
                  {specialty.name}
                </Button>
              )
            })
          }
          {
            state.specialties.length !== props.specialties.length ? (
              <span onClick={() => { this.setState({specialties: props.specialties}) }}>Все специальности</span>
            ) : null
          }
        </div>
        <div className='l-workers__list' style={{position: 'relative'}}>
          {
            state.loading && <OverlaySpinner />
          }
          {
            state.doctors && state.doctors.length > 0
              ? state.doctors.map((doctor, i) => {
                return <ListItem
                  key={doctor.id}
                  {...doctor}
                  queueParams={{organization: props.orgId, specialty: state.specialty, doctor: doctor.id}}
                  showTimeBoxes={() => {
                    this.setState({itemIndex: i})
                  }}
                  showRequestModal={() => {
                    this.setState({showRequestModal: true})
                  }}
                  opened={this.state.itemIndex === i}
                />
              })
              : <FormattedMessage id='no_speciality_doctors' defaultMessage='Нет врачей данной специализации' />
          }
        </div>
      </div>
    )
  }
}

export default Workers

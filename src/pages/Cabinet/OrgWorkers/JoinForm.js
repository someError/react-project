import React, {Component} from 'react'
import axios from 'axios'
import qs from 'qs'
import { connect } from 'react-redux'
import classNames from 'classnames'
import Modal, {ModalHeader, ModalBody} from '../../../components/Modal'
import { Select, MaterialInput } from '../../../components/Form'
import { Avatar } from '../../../components/Avatar'
import FeatherIcon from '../../../components/Icons/FeatherIcon'
import Template from '../../../components/Template'
import { Tile, TileContent, TileIcon } from '../../../components/Tile'
import api from '../../../api'
import { fetchReference } from '../../../redux/reference/actions'
import Button from '../../../components/Button'
import { Spinner, OverlaySpinner } from '../../../components/Loader'

class JoinForm extends Component {
  constructor () {
    super()
    this.state = {
      workers: [],
      workersLoading: false
    }
    this.onSubmit = this.onSubmit.bind(this)
    // this.onChange = this.onChange.bind(this)
    this.onGetDoctors = this.onGetDoctors.bind(this)
  }

  componentDidMount () {
    const { reference, fetchReference } = this.props
    this.req = axios.all([
      !reference.specialties.length && fetchReference('specialties'),
      !reference.regions.length && fetchReference('regions')
    ])
  }

  onSubmit (e) {
    e.preventDefault()
    this.setState({postLoading: true})
    api.linkDoctor(this.state.worker)
      .then(({data: {data}}) => {
        // this.props.onLink(data)
        this.props.onClose()
      })
  }

  onGetDoctors (e) {
    e.preventDefault()
    const { state: { name, region, specialties } } = this
    const query = { name, specialties }

    if (this.state.region) {
      query.filter = {
        region: [
          {
            type: 'eq',
            value: region
          }
        ]
      }
    }

    this.setState({workersLoading: true})

    api.getDoctors(qs.stringify(query))
      .then(({ data: { data } }) => {
        this.setState({
          workers: data.items,
          workersLoading: false
        })
      })
  }

  render () {
    const { state, props } = this
    const { reference } = props
    return (
      <Modal
        onRequestClose={props.onClose}
      >
        <ModalHeader>
          <h1>Прикрепить врача</h1>
        </ModalHeader>
        <ModalBody>
          <form onSubmit={this.onSubmit} id='addAssistantForm' className='form-grid l-assistant-join'>
            <div className='columns'>
              <div className='column col-12'>
                <Select
                  material
                  label='Специальность'
                  value={state.specialties && state.specialties[0]}
                  onChange={e => this.setState({specialties: [e.target.value]})}
                >
                  {
                    reference.specialties.map(specialty => {
                      return (
                        <option key={specialty.id} value={specialty.id}>
                          { specialty.name }
                        </option>
                      )
                    })
                  }
                </Select>
              </div>
              <div className='column col-12'>
                <Select
                  material
                  label='Регион'
                  value={state.region}
                  onChange={e => this.setState({region: e.target.value})}
                >
                  {
                    reference.regions.map(region => {
                      return (
                        <option key={region.id} value={region.id}>
                          { region.name }
                        </option>
                      )
                    })
                  }
                </Select>
              </div>
              <div className='column col-12'>
                <MaterialInput
                  material
                  label='Фио'
                  value={state.name}
                  onChange={e => this.setState({name: e.target.value})}
                />
              </div>
              <div className='column col-12'>
                <Button
                  onClick={this.onGetDoctors}
                  size='sm'
                >
                  Показать
                </Button>
              </div>
            </div>
            <div className='spinner-wrap'>
              {
                state.workers && state.workers.length
                  ? this.renderAssistentsList()
                  : null
              }
              {
                state.workersLoading && (
                  state.workers && state.workers.length ? <OverlaySpinner /> : <Spinner />
                )
              }
            </div>
          </form>
        </ModalBody>
      </Modal>
    )
  }

  renderAssistentsList () {
    return (
      <Template>
        {
          this.state.workers.map(worker => {
            if (this.props.selfWorkers.indexOf(worker.id) + 1) return
            const active = this.state.worker === worker.id

            return (
              <div
                key={worker.id}
                className={classNames({ active }, 'c-assistant')}
                onClick={() => {
                  this.setState({worker: worker.id})
                }}
              >
                <Tile>
                  <TileIcon>
                    <Avatar
                      src={worker.avatar ? worker.avatar.url : null}
                      initial={worker.firstName.charAt(0) + worker.lastName.charAt(0)}
                    />
                  </TileIcon>
                  <TileContent>
                    <span className='c-assistant__name'>{worker.lastName} {worker.firstName} {worker.middleName}</span>
                    <FeatherIcon color='#1BBEB5' size={20} icon={'check'} />
                  </TileContent>
                </Tile>
                {
                  this.state.worker !== worker.id && <div className='c-assistant__mask' />
                }
              </div>
            )
          })
        }
        <Button
          loading={this.state.postLoading}
          disabled={!this.state.worker}
          size='sm'
        >
          Пригласить
        </Button>
      </Template>
    )
  }
}

const mapStateToProps = ({ user, reference }) => {
  return {
    user,
    reference
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchReference: function (type) {
      return dispatch(fetchReference(type))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(JoinForm)

import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { injectIntl, defineMessages } from 'react-intl'

import Template from '../../../components/Template'
import Button from '../../../components/Button'
import { Card } from '../../../components/Card'
import api from '../../../api'
import Worker from './Worker'
import AddForm from './AddForm'
import JoinForm from './JoinForm'
import { sort } from '../../../util'

import Spinner from '../../../components/Loader/Spinner'

import commonIntlMessages from '../../../i18n/common-messages'

const intlMessages = defineMessages({
  addWorker: {
    id: 'workers.add',
    defaultMessage: 'Добавить сотрудника'
  }
})

class OrgWorkers extends Component {
  constructor () {
    super()
    this.state = {
      loading: true,
      workers: null
    }
  }

  componentDidMount () {
    const { user: { organization } } = this.props
    axios.all([
      api.getExperts(),
      api.getDoctors({organizations: [organization.id]}),
      api.getRegistries()
    ])
      .then(axios.spread((experts, doctors, registries) => {
        const workers = sort([...experts.data.data.items, ...doctors.data.data.items, ...registries.data.data.items], 'lastName')
        this.setState({
          workers,
          loading: false
        })
      }))
  }

  addWorker (worker) {
    let workers = this.state.workers
    workers.push({...worker})

    this.setState({workers})
  }

  render () {
    const { state } = this
    const { intl } = this.props

    return (
      <Template>
        <h2>
          { intl.formatMessage(commonIntlMessages.workersTitle) }
          <div className='title-btns'>
            <Button
              size='sm'
              onClick={() => { this.setState({ showJoinForm: true }) }}
              disabled={state.loading}
            >
              { intl.formatMessage(commonIntlMessages.attachDoctor) }
            </Button>

            <Button
              size='sm'
              ghost
              onClick={() => { this.setState({ showAddForm: true }) }}
            >
              { intl.formatMessage(intlMessages.addWorker) }
            </Button>
          </div>

        </h2>

        {
          state.loading
            ? <Spinner />
            : (
              state.workers && state.workers.length
                ? (
                  <Card className='l-assistants-list'>
                    {
                      state.workers.map((worker, i) => {
                        return <Worker
                          key={worker.id}
                          {...worker}
                          onUnlink={() => {
                            const workers = state.workers
                            workers.splice(i, 1)
                            this.setState({workers})
                          }}
                          onDelete={(role) => {
                            const workers = state.workers
                            if (role === 'registry') {
                              api.deleteRegistry(worker.id)
                                .then(() => {
                                  workers.splice(i, 1)
                                  this.setState({workers})
                                })
                            } else {
                              api.deleteExpert(worker.id)
                                .then(() => {
                                  workers.splice(i, 1)
                                  this.setState({workers})
                                })
                            }
                          }}
                        />
                      })
                    }
                  </Card>
                ) : null
            )
        }

        {
          state.showAddForm && <AddForm
            onClose={() => {
              this.setState({showAddForm: false})
            }}
            onAdd={worker => this.addWorker(worker)}
          />
        }

        {
          state.showJoinForm && <JoinForm
            selfWorkers={state.workers.map(worker => { return worker.id })}
            onClose={() => this.setState({showJoinForm: false})}
            onLink={worker => this.addWorker(worker)}
          />
        }
      </Template>
    )
  }
}

const mapStateToProps = ({user}) => {
  return {
    user
  }
}

export default injectIntl(connect(mapStateToProps)(OrgWorkers))

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'

import Template from '../../../components/Template'
import Button from '../../../components/Button'
import { Card } from '../../../components/Card'
import api from '../../../api'
import Assistant from './Assistant'
import AddForm from './AddForm'
import JoinForm from './JoinForm'

import Spinner from '../../../components/Loader/Spinner'

class Assistants extends Component {
  constructor () {
    super()
    this.state = {
      loading: true
    }
  }

  componentDidMount () {
    api.getAssistants()
      .then(({data: {data}}) => {
        this.setState({
          assistants: data.items,
          loading: false
        })
      })
  }

  render () {
    const { state, props: { user } } = this
    return (
      <Template>
        <header className='page-header'>
          <h2>
            <FormattedMessage
              id='assistants.title'
              description='Заголовок страницы "Ассистенты"'
              defaultMessage='Ассистенты'
            />
            <div className='title-btns'>
              {
                user.organizations && user.organizations.length
                  ? (
                    <Button
                      size='sm'
                      onClick={() => { this.setState({ showJoinForm: true }) }}
                    >
                      <FormattedMessage
                        id='assistants.attach'
                        description='Текст кнопки "прикрепить"'
                        defaultMessage='Прикрепить'
                      />
                    </Button>
                  )
                  : null
              }

              <Button
                size='sm'
                ghost
                onClick={() => { this.setState({ showAddForm: true }) }}
              >
                <FormattedMessage
                  id='assistants.add'
                  description='Текст кнопки "Добавить своего" на странице ассистентов'
                  defaultMessage='Добавить своего'
                />
              </Button>
            </div>
          </h2>
        </header>

        {
          state.loading
            ? <Spinner />
            : (
              state.assistants && state.assistants.length
                ? (
                  <Card className='l-assistants-list'>
                    {
                      state.assistants.map((assistant, i) => {
                        return <Assistant
                          key={assistant.id}
                          {...assistant}
                          onUnlink={() => {
                            const assistants = state.assistants
                            assistants.splice(i, 1)
                            this.setState({assistants})
                          }}
                          onDelete={() => {
                            const assistants = state.assistants
                            api.deleteAssistant(assistant.id)
                              .then(() => {
                                assistants.splice(i, 1)
                                this.setState({assistants})
                              })
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
            onAdd={(assistant) => {
              const assistants = state.assistants
              assistants.push({...assistant})
              this.setState({assistants})
            }}
          />
        }

        {
          state.showJoinForm && <JoinForm
            selfAssistants={state.assistants.map(assistant => { return assistant.id })}
            onClose={() => this.setState({showJoinForm: false})}
            onLink={assistants => this.setState({assistants})}
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

export default connect(mapStateToProps)(Assistants)

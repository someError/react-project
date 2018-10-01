import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'

import api from '../../../api'
import { removeFromArray, replaceArrayElement } from '../../../util'

import Access from './EntityViews/Access'
import Button from '../../../components/Button'
import CreateAccessModal from './Form/CreateAccess'
import withUser from '../../../redux/util/withUser'

class CardAccess extends Component {
  constructor () {
    super()

    this.state = {
      loading: true,
      items: [],
      showAddModal: false
    }
  }

  componentDidMount () {
    this.setState({
      loading: true
    })

    this.req = api.getAccessRules()

    this.req
      .then(({ data: { data } }) => {
        this.setState({
          items: data.items
        })
      })
  }

  componentWillUnmount () {
    if (this.req) {
      this.req.cancel()
    }
  }

  render () {
    const { items } = this.state

    return <header className='page-header'>
      <h1><FormattedMessage id='page.access.header' defaultMessage='Доступы к медкарте' /> <Button onClick={() => { this.setState({ showAddModal: true }) }}>добавить доступ</Button></h1>
      {
        items.map((access) => {
          return <Access
            onRemove={() => {
              this.setState({
                items: removeFromArray(this.state.items, (item) => item.id === access.id)
              })
            }}
            onConfirm={(responseData) => {
              this.setState({
                items: replaceArrayElement(this.state.items, (item) => item.id === access.id, responseData)
              })
            }}
            key={access.id}
            {...access}
          />
        })
      }

      {
        this.state.showAddModal
          ? <CreateAccessModal
            onSuccess={(data) => {
              this.state.items.unshift(data)

              this.setState({
                items: this.state.items,
                showAddModal: false
              })
            }}
            cardId={this.props.user.card.id}
            onRequestClose={() => { this.setState({ showAddModal: false }) }}
          />
          : null
      }
    </header>
  }
}

export default withUser(CardAccess)

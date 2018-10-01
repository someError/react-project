import React, { Component } from 'react'
import { createPortal } from 'react-dom'
import store from 'store'
import api from '../../api'
import Card from '../Card/Card'
import Button from '../Button'
import CardBody from '../Card/CardBody'

const Notification = window.Notification
const firebase = window.firebase

class Firebase extends Component {
  constructor () {
    super()

    this.state = {
      permission: store.get('pushDismissed') ? 'denied' : Notification && Notification.permission.toLowerCase()
    }

    this.subscribe = this.subscribe.bind(this)
  }

  dismiss () {
    this.setState({
      permission: 'denied'
    })
    store.set('pushDismissed', true, (new Date().getTime()) + (2 * 30 * 24 * 60 * 60 * 1000))
  }

  subscribe () {
    const { messaging } = this

    // запрашиваем разрешение на получение уведомлений
    messaging.requestPermission()
      .then(() => {
        // получаем ID устройства
        messaging.getToken()
          .then((currentToken) => {
            console.log(currentToken)
            if (currentToken) {
              sendTokenToServer(currentToken)
            } else {
              console.warn('Не удалось получить токен.')
              setTokenSentToServer(false)
            }
          })
          .catch((err) => {
            console.warn('При получении токена произошла ошибка.', err)
            setTokenSentToServer(false)
          })
      })
      .catch((err) => {
        console.warn('Не удалось получить разрешение на показ уведомлений.', err)
        this.setState({
          permission: Notification && Notification.permission.toLowerCase()
        })
      })

    // отправка ID на сервер
    function sendTokenToServer (currentToken) {
      if (!isTokenSentToServer(currentToken)) {
        console.log('Отправка токена на сервер...')
        console.log(currentToken)

        api.postDevice(currentToken)

        setTokenSentToServer(currentToken)
      } else {
        console.log('Токен уже отправлен на сервер.')
      }
    }

    // используем localStorage для отметки того,
    // что пользователь уже подписался на уведомления
    function isTokenSentToServer (currentToken) {
      return store.get('sentFirebaseMessagingToken') === currentToken
    }

    function setTokenSentToServer (currentToken) {
      store.set(
        'sentFirebaseMessagingToken',
        currentToken || ''
      )
    }
  }

  componentDidMount () {
    this.messaging = firebase.messaging()

    this.messaging.onMessage((payload) => {
      console.log('receive message', payload)
    })
  }

  render () {
    if (!this.state.permission) {
      return null
    }

    if (this.state.permission === 'default') {
      return createPortal(<div style={{position: 'fixed', zIndex: 20, bottom: 0, width: '100%', display: 'flex', justifyContent: 'center'}}>
        <Card style={{ margin: '0 auto', textAlign: 'center' }}>
          <CardBody>
            <h4>Получать уведомления в браузер?</h4>
            <br />
            <div>
              <Button size={'sm'} onClick={this.subscribe}>Да</Button>{' '}
              <Button ghost size={'sm'} onClick={() => { this.dismiss() }}>Нет</Button>
            </div>
          </CardBody>
        </Card>
      </div>, document.body)
    } else {
      return null
    }
  }
}

export default Firebase

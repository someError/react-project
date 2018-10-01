/* global firebase */

import 'core-js/es6/map'
import 'core-js/es6/set'
import 'intersection-observer'

import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'

// Initialize Firebase
const config = {
  apiKey: 'key',
  authDomain: 'phrkz5.firebaseapp.com',
  databaseURL: 'https://phrkz5.firebaseio.com',
  projectId: 'phrkz5',
  storageBucket: 'phrkz5.appspot.com',
  messagingSenderId: '532219592997'
}
firebase.initializeApp(config)

// document.body.addEventListener('touchmove', (e) => {
//   try {
//     if (document.body.classList.contains('portal-opened')) {
//       e.preventDefault()
//     }
//   } catch (e) {}
// }, true)

ReactDOM.render(<App />, document.getElementById('root'))

import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { IntlProvider, addLocaleData } from 'react-intl'
import moment from 'moment'
import 'moment/locale/ru'
import 'moment/locale/en-gb'
import 'moment/locale/kk'

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom'

import Cabinet from './pages/Cabinet'

import store from './redux/store'

import api from './api'

import './styles/main.css'
import ActivateByInvite from './pages/Authorization/ActivateByInvite'
import Public from './pages/Public'
import Sos from './pages/Sos'
import PublicRecord from './pages/Public/PublicRecord'
import { getUserLocale } from './util/intl'
import OverlaySpinner from './components/Loader/OverlaySpinner'

const locale = getUserLocale()

api.init(locale)

moment.locale(locale)

class App extends Component {
  constructor () {
    super()

    this.state = {
      loadingLocales: true
    }
  }

  async componentDidMount () {
    let localeData
    let messages

    // т.к. ru считается дефолтной(хотя это и неправильно, за дефолтную в нормальном мире берут en – правило хорошего тона такое),
    // то её грузим в любом случае
    const ruLocaleData = await import(`react-intl/locale-data/ru`)
    addLocaleData([...ruLocaleData])

    // А потому что подругому билдить только нужные localeData низя (либо билдит всё, что не надо, либо ничего)
    if (locale === 'en') {
      localeData = await import(`react-intl/locale-data/en`)
      messages = await import(`./i18n/locales/en.json`)
    } else if (locale === 'kk') {
      localeData = await import(`react-intl/locale-data/kk`)
      messages = await import(`./i18n/locales/kk.json`)
    } else {
      messages = await import(`./i18n/locales/ru.json`)
    }

    if (localeData) {
      addLocaleData([...localeData])
    }

    this.setState({
      locale: locale,
      intlMessages: messages,
      loadingLocales: false
    })
  }

  render () {
    if (this.state.loadingLocales) {
      return <OverlaySpinner />
    }

    return (
      <IntlProvider
        defaultLocale='ru'
        locale={this.state.locale}
        messages={this.state.intlMessages}
      >
        <Provider store={store}>
          <Router>
            <Switch>
              <Redirect exact from='/' to='/public' />
              {/* <Route exact path='/' render={() => <div><Link to='/auth/login'>login</Link> <Link to='/auth/register'>reg</Link> <Link to='/auth/reset'>reset</Link></div>} /> */}
              <Route path='/public' component={Public} />
              <Route path='/cabinet' component={Cabinet} />
              <Route path={`/sos/:token`} component={Sos} />
              <Route path='/shared-record/:token' component={PublicRecord} />
              <Route
                path='/activate/user/:userId/email-token/:token'
                component={ActivateByInvite}
              />
            </Switch>
          </Router>
        </Provider>
      </IntlProvider>
    )
  }
}

export default App

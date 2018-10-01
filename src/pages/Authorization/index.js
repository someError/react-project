import React from 'react'
import { Switch, Redirect, Route, NavLink } from 'react-router-dom'
import Login from './Login'
import Register from './Register'
import Reset from './Reset'
import Card from '../../components/Card/Card'
import { ModalBody, ModalHeader } from '../../components/Modal/index'

const Auth = ({ match, location }) => {
  return <div style={{display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center'}}>
    <Card>
      <ModalHeader>
        <div className='add-nav'>
          <NavLink className={`add-nav__link`} to={`${match.url}/login`}>Логин</NavLink>
          <NavLink className={`add-nav__link`} to={`${match.url}/register`}>Регистрация</NavLink>
          <NavLink className={`add-nav__link`} to={`${match.url}/reset`}>Восстановить пароль</NavLink>
        </div>
      </ModalHeader>
      <ModalBody>
        <Switch>
          {location.pathname === '/auth' ? <Redirect from='/auth' to='/auth/login' /> : null}
          <Route path={`${match.url}/login`} component={Login} />
          <Route path={`${match.url}/register`} component={Register} />
          <Route path={`${match.url}/reset`} component={Reset} />
        </Switch>
      </ModalBody>
    </Card>
  </div>
}

export default Auth

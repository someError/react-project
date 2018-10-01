import React from 'react'

import './Header.css'

const Header = (props) => {
  return (
    <div className='header'>
      <div className='container container-flex'>
        <a href='/' className='header-logo'>
          <img src={require('../../images/logo.svg')} alt='Мособгаз САУПГ' />
        </a>
        <ul className='header-nav'>
          <li className='header-nav__item'><a href='#'>Для пациентов</a></li>
          <li className='header-nav__item'><a href='#'>Медкарта</a></li>
          <li className='header-nav__item'><a href='#'>Для врачей</a></li>
          <li className='header-nav__item'><a href='#'>Партнёры</a></li>
          <li className='header-nav__item'><a href='#'>Контакты</a></li>
          <li className='header-nav__item'><a href='#'>Политика безопасности</a></li>
        </ul>
        <div className='header-auth'>
          <a className='header-auth__link' href='#'>Войти</a>
        </div>
      </div>
    </div>
  )
}

export default Header

import React from 'react'
import { injectIntl } from 'react-intl'
import { switchLocale } from '../util/intl'

const LangSwitcher = ({ className, intl }) => {
  return <span className={className}>
    <a onClick={() => { switchLocale('ru') }} className={`lang-switch ${intl.locale === 'ru' ? 'active' : ''}`}>RU</a>
    <a onClick={() => { switchLocale('en') }} className={`lang-switch ${intl.locale === 'en' ? 'active' : ''}`}>EN</a>
    <a onClick={() => { switchLocale('kk') }} className={`lang-switch ${intl.locale === 'kk' ? 'active' : ''}`}>KZ</a>
  </span>
}

export default injectIntl(LangSwitcher)

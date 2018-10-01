import store from 'store'

function getBrowserLocale () {
  return getLocaleFromLanguages() || navigator.language
}

function getLocaleFromLanguages () {
  return navigator.languages && navigator.languages.length ? navigator.languages[0] : null
}

function getUserLocale () {
  const foundLocale = getSimpleLocale(store.get('locale') || getBrowserLocale())

  if (!['ru', 'en', 'kk'].find((l) => l === foundLocale)) {
    return 'ru'
  } else {
    return foundLocale
  }
}

function getSimpleLocale (locale) {
  return typeof locale === 'string' ? locale.split('-')[0] : null
}

function switchLocale (locale) {
  // Тупо пишем локаль в localStorage и перезагружаем страницу – так надёжнее,
  // ибо локаль надо устанавливать в нескольких местах (reactIntl, moment, api)
  store.set('locale', locale)
  document.location.reload()
}

export { getBrowserLocale, getSimpleLocale, getUserLocale, switchLocale }

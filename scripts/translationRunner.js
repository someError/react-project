const translationManager = require('react-intl-translations-manager')
const manageTranslations = translationManager.default
const { readMessageFiles, getDefaultMessages } = translationManager
const defaultLanguage = 'ru'
const messagesDirectory = 'intl/messages'

manageTranslations({
  singleMessagesFile: true,
  messagesDirectory,
  translationsDirectory: 'src/i18n/locales/',
  whitelistsDirectory: 'src/i18n/locales/whitelists/',
  languages: ['en', 'kk'],
  overrideCoreMethods: {
    provideWhitelistFile: (lang) => {
      // Avoid reporting untranslated stuff in defaultLanguage
      if (lang === defaultLanguage) {
        const messageFiles = readMessageFiles(messagesDirectory)
        const messages = getDefaultMessages(messageFiles).messages
        return Object.keys(messages)
      } else {
        // This is no good, unfortunately :(
        // You could do your own whitelist retrieval here..
        return []
      }
    }
  }

})

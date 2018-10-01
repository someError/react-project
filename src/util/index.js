import React from 'react'
import qs from 'qs'
import isArray from 'lodash/isArray'
import cloneDeep from 'lodash/cloneDeep'
import remove from 'lodash/remove'
import mergeWith from 'lodash/mergeWith'
import memoize from 'memoizejs'
import moment from 'moment'

import Template from '../components/Template'
import { defineMessages } from 'react-intl'
import { format, isValidNumber, parse } from 'libphonenumber-js'
import is from 'is_js'

// TODO: Выпилить
export function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min)) + min
}

export const RATING_DESCR_LIST = [
  'без оценки',
  'безобразно',
  'плохо',
  'средненько',
  'хорошо',
  'отлично'
]

export const ORG_ROLES = {
  'expert': 'Эксперт по качеству',
  'doctor': 'Врач',
  'registry': 'Регистратура',
  'administrator': 'Администратор'
}

export const CURRENCY_SYMBOLS = {
  'KZT': '₸',
  'RUB': '₽',
  'USD': '$'
}

export function linkValueToState (inst, key) {
  return (e) => {
    inst.setState({
      [key]: e.target.value
    })
  }
}

export function linkEvent (data, handler) {
  if (typeof handler === 'function') {
    return (e) => {
      handler(data, e)
    }
  }
  return null
}

export const noop = () => {}

export const parseSearchString = (str = '') => {
  return qs.parse(str.replace(/^\?/, ''))
}

export function isInstanceOfComponent (inst, Comp) {
  return inst.type === Comp
}

export const getFileExt = (url = '') => {
  if (url) {
    return url.match(/\.(.*)$/)[1]
  }
}

export const isImageMime = (type = '') => {
  if (type) {
    return type.split('/')[0] === 'image'
  }
}

export const recordToSend = (data) => {
  return {
    record: {
      ...data,
      section: data.section.id,
      measurements: measurementsToSend(data.measurements),
      conclusionDoctor: data.conclusionDoctor ? data.conclusionDoctor.id : '',
      conclusionOrganization: data.conclusionOrganization ? data.conclusionOrganization.id : '',
      files: (data.files || []).map((f) => f.id),
      medications: (data.medications || []).map((m) => ({ ...m, drug: m.drug.id })),
      force: true
    }
  }
}

export const measurementsToSend = (data = []) => {
  return data.map((m) => ({
    ...m,
    parameter: m.parameter ? m.parameter.id : null,
    parameterName: m.parameter ? m.parameter.name : null,
    unit: m.unit ? m.unit.id : null
  }))
}

export const recordToEdit = (data, parameters) => {
  return {
    ...data,
    measurements: data.measurements.reduce((res, m) => {
      // FIXME: проверить херню с parameter: null
      if (m.parameter) {
        res.push({
          ...m,
          normalValueTo: m.normalValueTo || '',
          normalValueFrom: m.normalValueFrom || '',
          units: parameters.find((param) => param.id === m.parameter.id).units
        })
      }

      return res
    }, [])
  }
}

export const errorsToObj = (errors) => {
  let q = Object.keys(errors).map((k) => {
    let val = errors[k]

    if (isArray(val)) {
      val = val.join(',')
    }

    return `${k}=${val}`
  }).join('&')

  return qs.parse(q, { parseArrays: false })
}

export const mergeFilters = (filter, ext) => {
  function customizer (objValue, srcValue) {
    if (isArray(objValue) && srcValue) {
      const newArr = objValue.concat(srcValue)

      return newArr.reduceRight((res, obj) => {
        const dup = res.find((o) => o.type === obj.type)

        if (!dup) {
          res.push(obj)
        }

        return res
      }, [])
    }
  }

  return mergeWith(filter, ext, customizer)
}

export const getFilterValue = (filters = {}, key, type) => {
  if (!filters[key]) {
    return undefined
  }

  const filter = filters[key].find((f) => f.type === type)

  if (filter) {
    return filter.value
  }
}

export const isResponseError = (data) => {
  return data instanceof Error
}

export const canEditRecord = (author, user) => {
  return author.id === user.id
}

export const reduceParametersToTable = (data) => {
  return data.map((collection) => {
    return [
      {
        label: 'Параметр',
        value: (collection.parameter && collection.parameter.name) || collection.parameterName
      },
      {
        label: 'Значение',
        // value: `${collection.value} ${collection.unit && collection.unit.name}`
        value: <Template><span key={1} className={collection.value < collection.normalValueFrom || collection.value > collection.normalValueTo ? 'text-red' : ''}>{collection.value} </span> { collection.unit && collection.unit.name }</Template>
      },
      {
        label: 'Норма, от – до',
        value: [collection.normalValueFrom, collection.normalValueTo].filter((v) => !!v).join(' – ')
      },
      {
        label: 'Примечание',
        value: collection.comment
      }
    ]
  })
}

const medicationTypesIntl = defineMessages({
  pill: {
    id: 'medications.pills',
    defaultMessage: `{count, plural, 
    one {таблетка}
    few {таблетки}
    other {таблеток}
    }`
  },
  milliliter: {
    id: 'medications.milliliters',
    defaultMessage: `{count, plural, 
    one {миллилитр}
    few {миллилитра}
    other {миллитров}
    }`
  },
  milligram: {
    id: 'medications.milligrams',
    defaultMessage: `{count, plural, 
    one {миллиграмм}
    few {миллиграмма}
    other {миллиграммов}
    }`
  }
})

export const reduceMedicationToTable = (data, formatMessage) => {
  return data.map((collection) => {
    return [
      {
        label: 'Препарат',
        key: 'drug',
        value: (collection.drug && collection.drug.name) || collection.drugName
      },
      {
        label: 'Количество',
        key: 'drug',
        value: `${collection.value} ${formatMessage ? formatMessage(medicationTypesIntl[collection.type], { count: collection.value }) : collection.type}`
      },
      {
        label: 'Примечание',
        key: 'comment',
        value: collection.comment
      }
    ]
  })
}

const removeFromArray = (array, fn) => {
  const arrayClone = cloneDeep(array)

  remove(arrayClone, fn)

  return arrayClone
}

export { removeFromArray }

const replaceArrayElement = (array, fn, newEl) => {
  return array.map((el, i) => {
    if (fn(el, i)) {
      return newEl
    } else {
      return el
    }
  })
}

export { replaceArrayElement }

export const downloadFile = (url, fileName) => {
  let a = document.createElement('a')
  a.href = url
  a.download = fileName
  a.style.display = 'none'
  document.body.appendChild(a)
  a.click()
}

export const taskListToSend = (item) => {
  let itm = cloneDeep(item)

  delete itm.author
  itm.patient = itm.patient.id

  return itm
}

const linkStateArray = (inst, field) => {
  let values = inst.state[field]

  return (e) => {
    const val = e.target.value
    const checked = e.target.checked

    if (checked) {
      values.push(val)
    } else {
      values = removeFromArray(values, (v) => v === val)
    }

    console.log(values)

    inst.setState({
      [field]: values
    })
  }
}

export { linkStateArray }

const capitalize = memoize((str) => {
  if (str) {
    return str.substring(0, 1).toUpperCase() + str.substring(1, str.length)
  } else {
    return str
  }
})

export { capitalize }

const breakTime = (dates) => {
  const obj = {}
  obj.morning = dates.filter((time) => {
    return Math.ceil(parseFloat(moment.utc(time.startTime).format('HH.m'))) <= 12
  })
  obj.afternoon = dates.filter((time) => {
    return Math.ceil(parseFloat(moment.utc(time.startTime).format('HH.m'))) > 12 && Math.ceil(parseFloat(moment.utc(time.startTime).format('HH.m'))) < 17
  })
  obj.evening = dates.filter((time) => {
    return Math.ceil(parseFloat(moment.utc(time.startTime).format('HH.m'))) >= 17
  })

  return obj
}
export { breakTime }

const declOfNum = (number, titles) => {
  const cases = [2, 0, 1, 1, 1, 2]
  return titles[ (number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5] ]
}

export { declOfNum }

const transliterate = (text, engToRus) => {
  const rus = 'щ ш ч ц ю я ё ж ъ ы э а б в г д е з и й к л м н о п р с т у ф х ь'.split(/ +/g)
  const eng = "shh sh ch cz yu ya yo zh `` y' e` a b v g d e z i j k l m n o p r s t u f x `".split(/ +/g)
  let x
  for (x = 0; x < rus.length; x++) {
    text = text.split(engToRus ? eng[x] : rus[x]).join(engToRus ? rus[x] : eng[x])
    text = text.split(engToRus ? eng[x].toUpperCase() : rus[x].toUpperCase()).join(engToRus ? rus[x].toUpperCase() : eng[x].toUpperCase())
  }
  return text
}

export { transliterate }

export const owaspMessages = {
  'The password must be at least 6 characters long.': 'Пароль должен содержать не менее 6 символов.',
  'The password may not contain sequences of three or more repeated characters.': 'Пароль не может содержать последовательности из трех или более повторяющихся символов.',
  'The password must contain at least one number.': 'Пароль должен содержать не менее одной цифры.',
  'The password must contain at least one uppercase letter.': 'Пароль должен содержать хотя бы одну заглавную букву.',
  'The password must contain at least one special character.': 'Пароль должен содержать хотя бы один специальный символ.',
  'The password must contain at least one lowercase letter.': 'Пароль должен содержать хотя бы одну строчную букву.'
}

export const sort = (items, field) => {
  items.sort(function (a, b) {
    if (a[field] > b[field]) {
      return 1
    }
    if (a[field] < b[field]) {
      return -1
    }
    return 0
  })
  return items
}

export const mapGroupsToSend = (groups) => {
  return groups.map(({ id, title, completed, position }) => ({ id, title, completed, position }))
}

export function getStorageFileUrl (url, filter) {
  if (!/phr\//.test(url)) {
    return url
  }

  if (url.indexOf('cache') < 0) {
    return `${url.replace(/phr\//, 'phr/cache/')}${filter ? `/${filter}` : ''}`
  } else {
    return `${url}${filter ? `/${filter}` : ''}`
  }
}

export function validatePhone (string) {
  const regexp = /^(8|\+7)\s\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{2}[.-]\d{2}$/
  return regexp.test(string)
}

export function buildShareLink (token) {
  return `${document.location.origin}/shared-record/${token}`
}

export function normalizeLogin (login) {
  if (is.not.email(login)) {
    // if (!/^(\+7|7|8)/.test(login)) {
    //   login = '+7' + login
    // }

    login = login.replace(/^8/, '+7').replace(/^7/, '+7')
    if (isValidNumber(login, 'KZ')) {
      login = format(parse(login, 'KZ'), 'E.164').replace(/^\+/, '')
    }
  }

  return login
}

// export function getUtcString (time, utcVal) {
//   const hour = Number(time.substring(0, 2))
//   utcVal = utcVal / 3600
//   let utcHour = hour - utcVal
//   if (utcHour > 24) utcHour = hour - utcVal - 24
//   if (utcHour < 0) utcHour = 24 - utcVal + hour
//
//   return utcHour + ':' + time.substring(3, 5)
// }

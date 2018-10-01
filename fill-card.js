const axios = require('axios')
const faker = require('faker')
const moment = require('moment')

const axi = axios.create({
  // TODO: не забыть про интернационализацию
  baseURL: `http://phr.kr.digital/api/ru`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'x-token': 'p-1-1'
  }
})

const recordToSend = (data) => {
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

const measurementsToSend = (data = []) => {
  return data.map((m) => ({
    ...m,
    parameter: m.parameter ? m.parameter.id : null,
    parameterName: m.parameter ? m.parameter.name : null,
    unit: m.unit ? m.unit.id : null
  }))
}

const params = [
  {
    'id': '71abdae4-6274-4524-86c3-7a8b9ab312ef',
    'code': 'pressure',
    'units': [
      {
        'id': '1f91bfbc-3325-4a7f-a077-d70759f87035',
        'name': 'Паскаль'
      },
      {
        'id': 'a08ab3c2-71a9-4881-a4d2-af40bff4c701',
        'name': 'миллиметр ртутного столба'
      }
    ],
    'name': 'Давление'
  },
  {
    'id': '64f93f2a-0525-4406-a700-24ddc849daf3',
    'code': 'pulse',
    'units': [
      {
        'id': 'fd63195c-607d-41c1-8129-ee0349251b75',
        'name': 'Градус цельсия'
      }
    ],
    'name': 'Пульс'
  },
  {
    'id': '171e90d8-85d3-4139-abe3-56e82a850d2d',
    'code': 'temperature',
    'units': [
      {
        'id': 'a95a916e-a5a5-4360-b0b8-03655cad3924',
        'name': 'Ударов в минуту'
      }
    ],
    'name': 'Температура'
  }
]

const roundFloat = (n, p = 1) => {
  const factor = p * 10
  return Math.round(n * factor) / factor
}

const startDate = moment().utc().subtract(2, 'months')

const generateData = (param, count = 1) => {
  let i = 0
  const res = []

  while (i < count) {
    const param = faker.random.arrayElement(['71abdae4-6274-4524-86c3-7a8b9ab312ef', '64f93f2a-0525-4406-a700-24ddc849daf3', '171e90d8-85d3-4139-abe3-56e82a850d2d'])

    let minNorm
    let maxNorm
    let min
    let max
    let precision = 1

    if (param === '171e90d8-85d3-4139-abe3-56e82a850d2d') {
      minNorm = 36
      maxNorm = 36.9
      min = 35
      max = 40
      precision = 0.1
    } else if (param === '71abdae4-6274-4524-86c3-7a8b9ab312ef') {
      minNorm = 110
      maxNorm = 120
      min = 100
      max = 130
      precision = 1
    } else if (param === '64f93f2a-0525-4406-a700-24ddc849daf3') {
      minNorm = 60
      maxNorm = 80
      min = 50
      max = 100
    }

    const record = {
      section: {
        id: 'cc9e3c39-e911-48f6-9e50-3330a69e1d74'
      },
      status: 'sign',
      accessType: 'standard',
      title: faker.random.words(),
      text: faker.lorem.sentence(),
      recordDate: moment(startDate).add(i, 'day').utc().format(),
      measurements: [{
        parameter: {
          id: param,
          name: params.find((p) => p.id === param).id
        },
        unit: {
          id: params.find((p) => p.id === param).units[0].id
        },
        value: roundFloat(faker.random.number({ min, max, precision })),
        normalValueFrom: minNorm,
        normalValueTo: maxNorm
      }],
      force: true
    }

    res.push(recordToSend(record))

    i++
  }

  return res
}

const cardId = `e993f50e-cb13-3f84-8ae6-33c911269fc6`

// console.log(generateData()[0].record.measurements)

generateData('171e90d8-85d3-4139-abe3-56e82a850d2d', 50).forEach((r) => {
  axi.post(`/medical-cards/${cardId}/records`, r)
    .then(({ data: { data } }) => {
      // console.log(data)
    })
    .catch((err) => {
      console.error(err.response.data.data)
    })
})

// `/medical-cards/${cardId}/records`, {
//   method: 'post',
//   data
// }

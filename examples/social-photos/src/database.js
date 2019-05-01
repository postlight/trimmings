const csvParse = require('csv-parse/lib/sync')
const fs = require('fs')

const DATA_DIRECTORY = './data'

const DATA =
  fs.readdirSync(DATA_DIRECTORY).reduce((acc, filename) => {
    const records =
      csvParse(
        fs
          .readFileSync(`${DATA_DIRECTORY}/${filename}`)
          .toString(),
        { columns: true }
      )

    const type = filename.replace(/\.csv/, '')

    acc[type] = records.reduce((rAcc, record) => {
      rAcc[record.id] = Object.assign({ type }, record)
      return rAcc
    }, {})
    return acc
  }, {})

const database = {
  get: (type, id) => {
    return DATA[type][id]
  },

  all: (type) => {
    return Object.values(DATA[type])
  }
}

module.exports = database

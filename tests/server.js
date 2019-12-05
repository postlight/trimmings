const express = require('express')
const fs = require('fs')

fs.copyFile('./dist/trimmings.js', './tests/server/trimmings.js', (error) => {
  if (error) {
    throw error
  }
})

const app = express()
app.use(express.static('./tests/server'))

app.listen(process.env.TEST_SERVER_PORT)

const express = require('express')

const app = express()
app.use(express.static('./tests/server'))

app.listen(process.env.TEST_SERVER_PORT)

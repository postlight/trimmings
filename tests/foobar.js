const puppeteer = require('puppeteer')
const express = require('express')

const app = express()
app.use(express.static('./tests/server'))

const foobar = {
  initialized: false,
  browser: null,
  page: null,
  server: null,
  serverAddress: null,

  start: async () => {
    if (foobar.initialized) {
      return
    }

    foobar.initialized = true

    foobar.server = app.listen()
    const { port } = foobar.server.address()
    foobar.serverAddress = `http://localhost:${port}`

    foobar.browser = await puppeteer.launch()
    foobar.page = await foobar.browser.newPage()
  },

  stop: async () => {
    foobar.initialized = false
    await foobar.browser.close()
    foobar.server.close()
  }
}

module.exports = foobar

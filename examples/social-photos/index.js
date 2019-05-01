const express = require('express')
const handlebars = require('handlebars')
const fs = require('fs')

const TEMPLATES_DIRECTORY = './templates'

const templates = fs.readdirSync(TEMPLATES_DIRECTORY).reduce((acc, filename) => {
  acc[filename.replace(/\.html$/, '')] =
    handlebars.compile(
      fs
        .readFileSync(`${TEMPLATES_DIRECTORY}/${filename}`)
        .toString()
    )

  return acc
}, {})

const render = (template, context, { layout = null } = {}) => {
  const content = templates[template](context)

  if (!layout) {
    return content
  }

  return templates[layout]({ ...context, content })
}

const app = express()
const port = process.env.PORT || 3000

app.use(express.static('public'))

app.get('/', (req, res) =>
  res.send(
    render(
      'root',
      { thing: 'fresh pizza pie', title: 'Welcome!' },
      { layout: 'layout' }
    )
  )
)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

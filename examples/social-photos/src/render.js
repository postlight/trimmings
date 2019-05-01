const handlebars = require('handlebars')
const fs = require('fs')

const TEMPLATES_DIRECTORY = './templates'

const loadTemplates = () =>
  fs.readdirSync(TEMPLATES_DIRECTORY).reduce((acc, filename) => {
    acc[filename.replace(/\.html$/, '')] =
      handlebars.compile(
        fs
          .readFileSync(`${TEMPLATES_DIRECTORY}/${filename}`)
          .toString()
      )

    return acc
  }, {})

let templates = loadTemplates()

const render = (template, context, { layout = 'layout' } = {}) => {
  if (process.env.NODE_ENV === 'development') {
    templates = loadTemplates()
  }

  const content = templates[template](context)

  if (!layout) {
    return content
  }

  return templates[layout]({ ...context, content })
}

module.exports = render

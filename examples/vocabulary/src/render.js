const handlebars = require('handlebars')
const fs = require('fs')

const TEMPLATES_DIRECTORY = './templates'

const loadTemplates = () =>
  fs.readdirSync(TEMPLATES_DIRECTORY).reduce((acc, filename) => {
    const name = filename.replace(/\.html$/, '')
    const template =
      fs
        .readFileSync(`${TEMPLATES_DIRECTORY}/${filename}`)
        .toString()

    if (name.indexOf('_') === 0) {
      handlebars.registerPartial(name.replace(/^_/, ''), template)
    } else {
      acc[name] = handlebars.compile(template)
    }

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

import features from '../features/index'

const renderers =
  Object
    .values(features)
    .filter(f => typeof f.render === 'function')
    .map(f => f.render)

const render = (container) => {
  renderers.forEach((render) => {
    render(container)
  })
}

export default render

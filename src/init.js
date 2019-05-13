import features from './features/index'
import observe from './utils/observe'
import render from './utils/render'

const checkEligibility = (e, dataKeys) => {
  if (dataKeys.join(',').indexOf('redact') === -1) {
    if (e.type === 'click') {
      const parent = e.target.closest('[data-redact-inline]')
      if (parent) {
        return { keys: ['redactInline'] }
      }
    }

    if (['change', 'input'].includes(e.type)) {
      const form = e.target.closest('form')
      if (form && typeof form.dataset.redactAutosubmit !== 'undefined') {
        return { keys: ['redactAutosubmit'] }
      }
    }

    return null
  }

  return { keys: dataKeys }
}

const featureHandles =
  Object
    .values(features)
    .filter(f => f.key && f.eventNames && f.handle)
    .map(f => ({ key: f.key, eventNames: f.eventNames, handle: f.handle }))

const init = () => {
  Object
    .values(features)
    .filter(f => typeof f.listen === 'function')
    .forEach(f => { f.listen() })
  observe()
  render(document)

  const events = [
    [window, 'DOMContentLoaded'],
    [document, 'turbolinks:render'],
    [window, 'hashchange'],
    [window, 'popstate'],
    [window, 'pushstate'],
    [window, 'onorientationchange']
  ]

  events.forEach(([context, eventName]) => {
    context.addEventListener(eventName, () => { render(document) })
  })

  const handleEvent = (e) => {
    const dataKeys = Object.keys(e.target.dataset)

    const eligibility = checkEligibility(e, dataKeys)

    if (!eligibility) {
      return true
    }

    featureHandles.forEach(({ key, eventNames, handle }) => {
      if (eligibility.keys.includes(key) && eventNames.includes(e.type)) {
        handle(e)
      }
    })
  }

  featureHandles
    .reduce((acc, h) => acc.concat(h.eventNames), [])
    .filter((m, i, a) => a.indexOf(m) === i)
    .forEach((type) => {
      document.addEventListener(type, handleEvent)
    })
}

export default init

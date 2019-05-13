import { listen as hotkeysListen } from './features/hotkeys'
import observe from './utils/observe'
import render from './utils/render'

import { handle as toggleHandle } from './features/toggle'
import { handle as replaceHandle } from './features/replace'
import { handle as removeHandle } from './features/remove'
import { handle as inlineHandle, listen as inlineListen } from './features/inline'
import { handle as autosubmitHandle } from './features/autosubmit'

const handlers = [
  ['redactToggle', ['click', 'input', 'change'], toggleHandle],
  ['redactReplace', ['submit', 'click'], replaceHandle],
  ['redactRemove', ['click'], removeHandle],
  ['redactInline', ['submit', 'click'], inlineHandle],
  ['redactAutosubmit', ['change'], autosubmitHandle]
]

const checkEligibility = (e, dataKeys) => {
  if (dataKeys.join(',').indexOf('redact') === -1) {
    if (e.type === 'click') {
      const parent = e.target.closest('[data-redact-inline]')
      if (parent) {
        return { keys: 'redactInline' }
      }
    }

    if (['change', 'input'].includes(e.type)) {
      const form = e.target.closest('form')
      if (form && typeof form.dataset.redactAutosubmit !== 'undefined') {
        return { keys: 'redactAutosubmit' }
      }
    }

    return null
  }

  return { keys: dataKeys }
}

const init = () => {
  hotkeysListen()
  inlineListen()
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

    handlers.forEach(([key, types, handle]) => {
      if (eligibility.keys.includes(key) && types.includes(e.type)) {
        handle(e)
      }
    })
  }

  ;['click', 'submit', 'input', 'change'].forEach((type) => {
    document.addEventListener(type, handleEvent)
  })
}

export default init

import isRegularClick from '../utils/isRegularClick'
import loadElement from '../utils/loadElement'
import parseArgs from '../utils/parseArgs'

export const key = 'redactReplace'

export const eventNames = ['submit', 'click']

export const handle = (e) => {
  if (e.type === 'click' && !isRegularClick(e)) {
    return
  }

  e.preventDefault()

  const element = e.target

  const replacementSelectors = parseArgs(element.dataset.redactReplace).args

  loadElement(element).then((doc) => {
    replacementSelectors.forEach((selector) => {
      const newEl = doc.querySelector(selector)
      const oldEl = document.querySelector(selector)

      if (oldEl && oldEl.parentNode) {
        oldEl.parentNode.replaceChild(newEl, oldEl)
      }
    })
  })
}

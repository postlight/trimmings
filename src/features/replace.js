import loadElement from '../utils/loadElement'
import parseArgs from '../utils/parseArgs'

export const key = 'redactReplace'

export const eventNames = ['submit', 'click']

export const handle = (e) => {
  e.preventDefault()

  const element = e.target
  const replacementSelectors = parseArgs(element.dataset.redactReplace).args

  loadElement(element).then((doc) => {
    replacementSelectors.forEach((selector) => {
      const newEl = doc.querySelector(selector)
      const oldEl = document.querySelector(selector)
      oldEl.parentNode.replaceChild(newEl, oldEl)
    })
  })
}

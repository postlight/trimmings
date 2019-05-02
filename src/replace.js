import loadElement from './loadElement'

export const selectors = [
  'a[data-redact-replace]',
  'form[data-redact-replace]'
]

export const bind = (element) => {
  if (typeof element.dataset.redactReplace !== 'undefined') {
    const replacementSelectors = element.dataset.redactReplace.split(', ')

    const eventName = element.nodeName === 'FORM' ? 'submit' : 'click'

    element.addEventListener(eventName, (e) => {
      e.preventDefault()
      loadElement(element).then((doc) => {
        replacementSelectors.forEach((selector) => {
          const newEl = doc.querySelector(selector)
          const oldEl = document.querySelector(selector)
          oldEl.parentNode.replaceChild(newEl, oldEl)
        })
      })
    })

    element.removeAttribute('data-redact-replace')
  }
}

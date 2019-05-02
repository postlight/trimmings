import loadElement from './loadElement'
import parseArgs from './parseArgs'

export const selectors = [
  'a[data-redact-inline]',
  'form[data-redact-inline]'
]

export const bind = (element) => {
  if (typeof element.dataset.redactInline !== 'undefined') {
    const [targetSelector, destinationSelector, templateSelector] =
      parseArgs(element.dataset.redactInline)

    const eventName = element.nodeName === 'FORM' ? 'submit' : 'click'

    element.addEventListener(eventName, (e) => {
      e.preventDefault()
      loadElement(element).then((doc) => {
        const destination = document.querySelector(destinationSelector)
        destination.innerHTML = ''
        let content = doc.querySelector(targetSelector)
        if (templateSelector) {
          const template = document.querySelector(templateSelector)
          const holder = document.createElement('div')
          holder.innerHTML = template.innerHTML
          const target = holder.querySelector('[data-redact-inline-target]')
          target.parentNode.replaceChild(content, target)
          const fragment = document.createDocumentFragment()
          fragment.innerHTML = holder.innerHTML
          content = fragment
        }
        destination.innerHTML = content.innerHTML
      })
    })

    element.removeAttribute('data-redact-inline')
  }
}

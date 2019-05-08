import loadElement from './loadElement'
import parseArgs from './parseArgs'

export const selectors = [
  'a[data-redact-inline]',
  'form[data-redact-inline]'
]

const followElement = (element, eventName) => {
  element.dataset.redactDisableInline = 'true'
  element[eventName]()
}

export const bind = (element) => {
  if (typeof element.dataset.redactInline !== 'undefined') {
    const [targetSelector, destinationSelector, templateSelector] =
      parseArgs(element.dataset.redactInline)

    const eventName = element.nodeName === 'FORM' ? 'submit' : 'click'

    element.addEventListener(eventName, (e) => {
      if (element.dataset.redactDisableInline === 'true') {
        return true
      }

      e.preventDefault()
      const destination = document.querySelector(destinationSelector)

      if (!destination) {
        followElement(element, eventName)
        return
      }

      element.classList.add('redact-loading')

      loadElement(element).then((doc) => {
        let content = doc.querySelector(targetSelector)

        if (!content) {
          followElement(element, eventName)
          return
        }

        if (templateSelector) {
          const template = document.querySelector(templateSelector)

          if (!template) {
            followElement(element, eventName)
            return
          }

          const holder = document.createElement('div')
          holder.innerHTML = template.innerHTML
          const target = holder.querySelector('[data-redact-inline-target]')

          if (!target) {
            followElement(element, eventName)
            return
          }

          target.parentNode.replaceChild(content, target)
          const fragment = document.createDocumentFragment()
          fragment.innerHTML = holder.innerHTML
          content = fragment
        }

        element.classList.remove('redact-loading')
        destination.innerHTML = content.innerHTML
      })
    })

    element.removeAttribute('data-redact-inline')
  }
}

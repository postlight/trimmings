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
    const args = parseArgs(element.dataset.redactInline)
    const [targetSelector, destinationSelector] = args.args
    const { template: templateSelector, method = 'replace' } = args.options

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

        if (method.indexOf('reduce') === 0) {
          Array.prototype.forEach.call(destination.children, (child) => {
            child.dataset.redactChild = 'true'
          })

          const savedChild = element.closest('[data-redact-child]')

          if (savedChild) {
            savedChild.removeAttribute('data-redact-child')
          }

          Array.prototype.forEach.call(destination.querySelectorAll('[data-redact-child]'), (child) => {
            child.parentNode.removeChild(child)
          })
        }

        const html = content instanceof window.DocumentFragment ? content.innerHTML : content.outerHTML

        switch (method) {
          case 'replace':
            destination.innerHTML = html
            break

          case 'reduce-prepend': // fall through
          case 'prepend': // fall through
            destination.innerHTML = `${html}${destination.innerHTML}`
            break

          case 'reduce-append': // fall through
          case 'append':
            destination.innerHTML = `${destination.innerHTML}${html}`
            break

          default:
            followElement(element, eventName)
            break
        }

        element.classList.remove('redact-loading')
      })
    })

    element.removeAttribute('data-redact-inline')
  }
}

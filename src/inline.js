import getDestination from './getDestination'
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

const updateState = () => {
  const { content, tag, title } = window.history.state
  document.title = title
  document.querySelector(`[data-redact-location-tag="${tag}"]`).innerHTML =
    content
}

export const listen = () => {
  window.addEventListener('popstate', updateState)
}

export const bind = (element) => {
  if (typeof element.dataset.redactInline === 'undefined') {
    return
  }

  const args = parseArgs(element.dataset.redactInline)
  const [targetSelector, destinationSelector] = args.args
  const {
    method = 'replace',
    template: templateSelector,
    updateLocation,
    updateTitle
  } = args.options

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

    const previousState = destination.innerHTML

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

      const newTitle = updateTitle === 'true' ? doc.querySelector('title').innerHTML : null

      if (updateLocation === 'true') {
        destination.dataset.redactLocationTag = destination.dataset.redactLocationTag || Math.random().toString()
        window.history.replaceState(
          {
            title: document.title,
            tag: destination.dataset.redactLocationTag,
            content: previousState
          },
          null,
          window.location.href
        )
        window.history.pushState(
          {
            title: newTitle || document.title,
            tag: destination.dataset.redactLocationTag,
            content: destination.innerHTML
          },
          null,
          getDestination(element)
        )
        updateState()
      }

      if (newTitle) {
        document.title = newTitle
      }

      element.classList.remove('redact-loading')
    })
  })

  element.removeAttribute('data-redact-inline')
}

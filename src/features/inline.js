import isHidden from '../utils/isHidden'
import getDestination from '../utils/getDestination'
import loadElement from '../utils/loadElement'
import parseArgs from '../utils/parseArgs'

export const key = 'redactInline'

export const eventNames = ['submit', 'click']

const followElement = (element, boundElement, eventName) => {
  boundElement.removeAttribute('data-redact-inline')
  element[eventName]()
}

const updateState = () => {
  const { content, tag, title } = window.history.state
  if (title) {
    document.title = title
  }
  const taggedEl = document.querySelector(`[data-redact-location-tag="${tag}"]`)
  if (taggedEl) {
    taggedEl.innerHTML = content
  }
}

export const listen = () => {
  window.addEventListener('popstate', updateState)
}

export const handle = (e) => {
  const originalElement = e.target
  let element = originalElement

  if (typeof element.dataset.redactInline === 'undefined') {
    element = e.target.closest('[data-redact-inline]')
  }

  if (element.dataset.redactDisableInline === 'true') {
    return true
  }

  const eventName = e.type

  const args = parseArgs(element.dataset.redactInline)
  const [targetSelector, destinationSelector] = args.args
  const {
    method = 'replace',
    template: templateSelector,
    updateLocation,
    updateTitle
  } = args.options

  const destination = document.querySelector(destinationSelector)

  if (!destination || isHidden(destination)) {
    return true
  }

  e.preventDefault()

  const fallback = () => {
    followElement(originalElement, element, eventName)
  }

  if (element.classList.contains('redact-loading')) {
    return false
  }

  const previousState = destination.innerHTML

  element.classList.add('redact-loading')

  loadElement(element).then((doc) => {
    let content = doc.querySelector(targetSelector)

    if (!content) {
      fallback()
      return
    }

    if (templateSelector) {
      const template = document.querySelector(templateSelector)

      if (!template) {
        fallback()
        return
      }

      const holder = document.createElement('div')
      holder.innerHTML = template.innerHTML
      const target = holder.querySelector('[data-redact-inline-target]')

      if (!target) {
        fallback()
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
        fallback()
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
}

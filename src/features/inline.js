import isHidden from '../utils/isHidden'
import isRegularClick from '../utils/isRegularClick'
import getDestination from '../utils/getDestination'
import loadElement from '../utils/loadElement'
import parseArgs from '../utils/parseArgs'

export const key = 'trimInline'

export const eventNames = ['submit', 'click']

const followElement = (element, boundElement, eventName) => {
  boundElement.removeAttribute('data-trim-inline')
  element[eventName]()
}

const updateState = () => {
  const { content, tag, title } = window.history.state
  if (title) {
    document.title = title
  }
  const taggedEl = document.querySelector(`[data-trim-location-tag="${tag}"]`)
  if (taggedEl && taggedEl.innerHTML !== content) {
    taggedEl.innerHTML = content
  }
}

export const listen = () => {
  window.addEventListener('popstate', updateState)
}

export const handle = (e) => {
  if (e.type === 'click' && !isRegularClick(e)) {
    return
  }

  const originalElement = e.target
  let element = originalElement

  if (typeof element.dataset.trimInline === 'undefined') {
    element = e.target.closest('[data-trim-inline]')
  }

  if (element.dataset.trimDisableInline === 'true') {
    return true
  }

  const eventName = e.type

  const args = parseArgs(element.dataset.trimInline)
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

  if (element.classList.contains('trim-loading')) {
    return false
  }

  const previousState = destination.innerHTML

  element.classList.add('trim-loading')

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
      const target = holder.querySelector('[data-trim-inline-target]')

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
        child.dataset.trimChild = 'true'
      })

      const savedChild = element.closest('[data-trim-child]')

      if (savedChild) {
        savedChild.removeAttribute('data-trim-child')
      }

      Array.prototype.forEach.call(destination.querySelectorAll('[data-trim-child]'), (child) => {
        child.parentNode.removeChild(child)
      })
    }

    switch (method) {
      case 'replace':
        const html = content instanceof window.DocumentFragment ? content.innerHTML : content.outerHTML
        destination.innerHTML = html
        break

      case 'reduce-prepend': // fall through
      case 'prepend': // fall through
        if (destination.hasChildNodes()) {
          destination.insertBefore(content, destination.firstChild)
        } else {
          destination.appendChild(content)
        }
        break

      case 'reduce-append': // fall through
      case 'append':
        destination.appendChild(content)
        break

      default:
        fallback()
        break
    }

    const newTitle = updateTitle === 'true' ? doc.querySelector('title').innerHTML : null

    if (updateLocation === 'true') {
      destination.dataset.trimLocationTag = destination.dataset.trimLocationTag || Math.random().toString()
      window.history.replaceState(
        {
          title: document.title,
          tag: destination.dataset.trimLocationTag,
          content: previousState
        },
        null,
        window.location.href
      )
      window.history.pushState(
        {
          title: newTitle || document.title,
          tag: destination.dataset.trimLocationTag,
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

    element.classList.remove('trim-loading')
  })
}

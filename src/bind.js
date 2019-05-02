import load from './load'
import loadElement from './loadElement'
import match from './match'
import { bind as hotkeysBind } from './hotkeys'

const bind = (element) => {
  if (match(element, 'A', 'redactPrefetch')) {
    const targetSelector = element.dataset.redactPrefetch || 'body'
    load(element.getAttribute('href')).then((doc) => {
      const newNode = doc.querySelector(targetSelector)
      element.parentNode.replaceChild(newNode, element)
    })
    element.removeAttribute('data-redact-prefetch')
  }

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

  if (typeof element.dataset.redactInline !== 'undefined') {
    const [targetSelector, destinationSelector, templateSelector] =
      element.dataset.redactInline.split(', ')

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

  if (match(element, 'BUTTON', 'redactToggle')) {
    const [targetSelector, className] = element.dataset.redactToggle.split(', ')
    element.addEventListener('click', () => {
      document.querySelector(targetSelector).classList.toggle(className)
    })
    element.removeAttribute('data-redact-toggle')
  }

  if (match(element, 'INPUT', 'redactToggle')) {
    const [targetSelector, className] = element.dataset.redactToggle.split(', ')
    element.addEventListener('change', () => {
      // TODO: this is not un-toggling for the previously-checked radio
      document.querySelector(targetSelector).classList.toggle(className, element.checked)
    })
    element.removeAttribute('data-redact-toggle')
  }

  if (match(element, 'BUTTON', 'redactRemove')) {
    const selector = element.dataset.redactRemove
    element.addEventListener('click', () => {
      const toRemove = document.querySelector(selector)
      toRemove.parentNode.removeChild(toRemove)
    })
    element.removeAttribute('data-redact-remove')
  }

  if (match(element, ['INPUT', 'BUTTON', 'FORM', 'SELECT', 'TEXTAREA'], 'redactAutosubmit')) {
    element.addEventListener('change', () => {
      // TODO: IE does not support Element.closest()
      const form = (element.nodeName === 'FORM') ? element : element.closest('form')
      form.submit()
    })
    element.removeAttribute('data-redact-autosubmit')
  }

  hotkeysBind(element)
}

export default bind

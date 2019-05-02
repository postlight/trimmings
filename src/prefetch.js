import load from './load'
import match from './match'

export const selectors = [
  'a[data-redact-prefetch]'
]

export const bind = (element) => {
  if (match(element, 'A', 'redactPrefetch')) {
    const targetSelector = element.dataset.redactPrefetch || 'body'
    load(element.getAttribute('href')).then((doc) => {
      const newNode = doc.querySelector(targetSelector)
      element.parentNode.replaceChild(newNode, element)
    })
    element.removeAttribute('data-redact-prefetch')
  }
}

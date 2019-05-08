import load from './load'
import match from './match'

export const selectors = [
  'a[data-redact-embed]'
]

export const bind = (element) => {
  if (match(element, 'A', 'redactEmbed')) {
    const targetSelector = element.dataset.redactEmbed || 'body'
    element.classList.add('redact-loading')
    load(element.getAttribute('href')).then((doc) => {
      const newNode = doc.querySelector(targetSelector)
      element.parentNode.replaceChild(newNode, element)
    })
    element.removeAttribute('data-redact-embed')
  }
}

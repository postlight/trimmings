import load from './load'

export const render = (container) => {
  Array.prototype.forEach.call(container.querySelectorAll('a[data-redact-embed]'), element => {
    if (window.getComputedStyle(element).display === 'none' || element.classList.contains('redact-loading')) {
      return
    }
    const targetSelector = element.dataset.redactEmbed || 'body'
    element.classList.add('redact-loading')
    load(element.getAttribute('href')).then((doc) => {
      const newNode = doc.querySelector(targetSelector)
      element.parentNode.replaceChild(newNode, element)
    })
  })
}

(() => {
  const load = (url) => {
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest()
      xhr.onload = function () {
        resolve(this.responseXML.documentElement)
      }
      // TODO: Ensure href is same hostname and different path
      xhr.open('GET', url)
      xhr.responseType = 'document'
      xhr.send()
    })
  }

  const match = (element, nodeName, datasetKey) =>
    (element.nodeName === nodeName && typeof element.dataset[datasetKey] !== 'undefined')

  const bind = (element) => {
    if (match(element, 'A', 'redactPrefetch')) {
      const targetSelector = element.dataset.redactPrefetch || 'body'
      load(element.getAttribute('href')).then((doc) => {
        const newNode = doc.querySelector(targetSelector)
        element.parentNode.replaceChild(newNode, element)
      })
    } else if (match(element, 'A', 'redactInline')) {
      const [targetSelector, destinationSelector] = element.dataset.redactInline.split(', ')
      element.addEventListener('click', (e) => {
        e.preventDefault()
        load(element.getAttribute('href')).then((doc) => {
          const destination = document.querySelector(destinationSelector)
          destination.innerHTML = ''
          destination.appendChild(doc.querySelector(targetSelector))
        })
      })
    } else if (match(element, 'BUTTON', 'redactToggle')) {
      const [targetSelector, className] = element.dataset.redactToggle.split(', ')
      element.addEventListener('click', () => {
        document.querySelector(targetSelector).classList.toggle(className)
      })
    } else if (match(element, 'INPUT', 'redactToggle')) {
      const [targetSelector, className] = element.dataset.redactToggle.split(', ')
      element.addEventListener('change', () => {
        // TODO: this is not un-toggling for the previously-checked radio
        document.querySelector(targetSelector).classList.toggle(className, element.checked)
      })
    }
  }

  addEventListener('load', () => {
    const selectors = [
      'a[data-redact-prefetch]',
      'a[data-redact-inline]',
      'button[data-redact-toggle]',
      'input[data-redact-toggle]'
    ]

    Array.prototype.forEach.call(document.querySelectorAll(selectors.join(',')), (element) => {
      bind(element)
    })

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName.indexOf('data-redact') === 0) {
          console.log('oh uh oh we have a new one here')
          bind(mutation.target)
        }
        console.log(mutation)
      })
    })

    observer.observe(
      document.querySelector('body'),
      { attributes: true, childList: true, subtree: true }
    )
  })
})()

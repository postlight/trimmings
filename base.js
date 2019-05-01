(() => {
  const hotkeys = []

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

  const match = (element, nodeNameArg, datasetKey) => {
    const nodeNames = (nodeNameArg instanceof String) ? [nodeNameArg] : nodeNameArg
    return nodeNames.includes(element.nodeName) && typeof element.dataset[datasetKey] !== 'undefined'
  }

  const bind = (element) => {
    if (match(element, 'A', 'redactPrefetch')) {
      const targetSelector = element.dataset.redactPrefetch || 'body'
      load(element.getAttribute('href')).then((doc) => {
        const newNode = doc.querySelector(targetSelector)
        element.parentNode.replaceChild(newNode, element)
      })
    }

    if (match(element, 'A', 'redactInline')) {
      const [targetSelector, destinationSelector] = element.dataset.redactInline.split(', ')
      element.addEventListener('click', (e) => {
        e.preventDefault()
        load(element.getAttribute('href')).then((doc) => {
          const destination = document.querySelector(destinationSelector)
          destination.innerHTML = ''
          destination.appendChild(doc.querySelector(targetSelector))
        })
      })
    }

    if (match(element, 'BUTTON', 'redactToggle')) {
      const [targetSelector, className] = element.dataset.redactToggle.split(', ')
      element.addEventListener('click', () => {
        document.querySelector(targetSelector).classList.toggle(className)
      })
    }

    if (match(element, 'INPUT', 'redactToggle')) {
      const [targetSelector, className] = element.dataset.redactToggle.split(', ')
      element.addEventListener('change', () => {
        // TODO: this is not un-toggling for the previously-checked radio
        document.querySelector(targetSelector).classList.toggle(className, element.checked)
      })
    }

    if (match(element, 'BUTTON', 'redactRemove')) {
      const selector = element.dataset.redactRemove
      element.addEventListener('click', () => {
        const toRemove = document.querySelector(selector)
        toRemove.parentNode.removeChild(toRemove)
      })
    }

    if (match(element, ['INPUT', 'BUTTON', 'FORM', 'SELECT', 'TEXTAREA'], 'redactAutosubmit')) {
      element.addEventListener('change', () => {
        // TODO: IE does not support Element.closest()
        const form = (element.nodeName === 'FORM') ? element : element.closest('form')
        form.submit()
      })
    }

    if (typeof element.dataset.redactHotkey !== 'undefined') {
      hotkeys.push([element, element.dataset.redactHotkey.toLowerCase().split(/,\s+/g).sort()])
    }
  }

  addEventListener('keydown', (e) => {
    const { controlKey, shiftKey, altKey, metaKey, keyCode } = e

    const input =
      `${String.fromCharCode(keyCode)} ${controlKey ? 'ctrl' : ''} ${shiftKey ? 'shift' : ''} ${metaKey ? 'meta' : ''} ${altKey ? 'alt' : ''}`
        .trim()
        .toLowerCase()
        .split(/\s+/g)
        .sort()

    const [element,] = hotkeys.find(hotkey => hotkey[1].join(',') === input.join(',')) || [null]

    if (element) {
      element.click()
    }
  })

  addEventListener('load', () => {
    const selectors = [
      'a[data-redact-prefetch]',
      'a[data-redact-inline]',
      'button[data-redact-toggle]',
      'input[data-redact-toggle]',
      'button[data-redact-remove]',
      'form[data-redact-autosubmit]',
      'button[data-redact-autosubmit]',
      'input[data-redact-autosubmit]',
      'select[data-redact-autosubmit]',
      'textarea[data-redact-autosubmit]'
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

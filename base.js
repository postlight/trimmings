(() => {
  const hotkeys = []

  const serialize = (form) => {
    const pairs = []

    Array.prototype.forEach.call(form, (element) => {
      if (element.disabled || !element.name || !element.value) {
        return
      }

      if (['checkbox', 'radio'].includes(element.type) && !element.checked) {
        return
      }

      if (!/^(?:input|select|textarea|keygen)/i.test(element.nodeName) || /^(?:submit|button|image|reset|file)$/i.test(element.type)) {
        return
      }

      if (element.type === 'select-multiple') {
        Array
          .prototype
          .filter
          .call(element.options, o => o.selected && o.value)
          .forEach((o) => { pairs.push([element.name, o.value]) })

        return
      }

      pairs.push([element.name, element.value])
    })

    const result =
      pairs
        .map(([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value.replace(/(\r)?\n/g, '\r\n')).replace(/%20/g, '+')}`
        )
        .join('&')

    return result
  }

  const load = (url, options = {}) =>
    fetch(url, options)
      .then(response => response.text())
      .then((text) => {
        const html = document.createElement('html')
        html.innerHTML = text
        return html
      })

  const loadElement = (element) => {
    if (element.nodeName === 'A') {
      return load(element.getAttribute('href'))
    } else if (element.nodeName === 'FORM') {
      return load(
        element.getAttribute('action'),
        {
          method: element.getAttribute('method'),
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: serialize(element)
        }
      )
    } else {
      throw new Error(`Unexpected nodename ${element.nodeName} for loadElement`)
    }
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

  const bindingSelectors = [
    'a[data-redact-prefetch]',
    'a[data-redact-inline]',
    'form[data-redact-inline]',
    'a[data-redact-replace]',
    'form[data-redact-replace]',
    'button[data-redact-toggle]',
    'input[data-redact-toggle]',
    'button[data-redact-remove]',
    'form[data-redact-autosubmit]',
    'button[data-redact-autosubmit]',
    'input[data-redact-autosubmit]',
    'select[data-redact-autosubmit]',
    'textarea[data-redact-autosubmit]'
  ]

  const BINDING_SELECTORS = bindingSelectors.join(',')

  const bindChildren = (container) => {
    Array.prototype.forEach.call(container.querySelectorAll(BINDING_SELECTORS), (element) => {
      bind(element)
    })
  }

  addEventListener('load', () => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName.indexOf('data-redact') === 0) {
          bind(mutation.target)
        }

        if (mutation.type === 'childList') {
          bindChildren(mutation.target)
        }
      })
    })

    observer.observe(
      document.querySelector('body'),
      { attributes: true, childList: true, subtree: true }
    )

    bindChildren(document)
  })
})()

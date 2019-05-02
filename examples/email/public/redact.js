(function () {
  'use strict';

  const parseArgs = (argString) =>
    argString.trim().split(/,\s*/g);

  const registered = [];

  const selectors = [
    'a[data-redact-hotkey]',
    'button[data-redact-hotkey]'
  ];

  const listen = () => {
    window.addEventListener('keydown', (e) => {
      const { controlKey, shiftKey, altKey, metaKey, keyCode } = e;

      const input =
        `${String.fromCharCode(keyCode)} ${controlKey ? 'ctrl' : ''} ${shiftKey ? 'shift' : ''} ${metaKey ? 'meta' : ''} ${altKey ? 'alt' : ''}`
          .trim()
          .toLowerCase()
          .split(/\s+/g)
          .sort();

      const element = (registered.find(hotkey => hotkey[1].join(',') === input.join(',')) || [])[0];

      if (element) {
        element.click();
      }
    });
  };

  const bind = (element) => {
    if (typeof element.dataset.redactHotkey !== 'undefined') {
      registered.push([element, parseArgs(element.dataset.redactHotkey.toLowerCase()).sort()]);
    }
  };

  const match = (element, nodeNameArg, datasetKey) => {
    const nodeNames = (nodeNameArg instanceof String) ? [nodeNameArg] : nodeNameArg;
    return nodeNames.includes(element.nodeName) && typeof element.dataset[datasetKey] !== 'undefined'
  };

  const selectors$1 = [
    'form[data-redact-autosubmit]',
    'button[data-redact-autosubmit]',
    'input[data-redact-autosubmit]',
    'select[data-redact-autosubmit]',
    'textarea[data-redact-autosubmit]'
  ];

  const bind$1 = (element) => {
    if (match(element, ['INPUT', 'BUTTON', 'FORM', 'SELECT', 'TEXTAREA'], 'redactAutosubmit')) {
      element.addEventListener('change', () => {
        // TODO: IE does not support Element.closest()
        const form = (element.nodeName === 'FORM') ? element : element.closest('form');
        form.submit();
      });
      element.removeAttribute('data-redact-autosubmit');
    }
  };

  const load = (url, options = {}) =>
    window.fetch(url, options)
      .then(response => response.text())
      .then((text) => {
        const html = document.createElement('html');
        html.innerHTML = text;
        return html
      });

  const serialize = (form) => {
    const pairs = [];

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
          .forEach((o) => { pairs.push([element.name, o.value]); });

        return
      }

      pairs.push([element.name, element.value]);
    });

    const result =
      pairs
        .map(([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value.replace(/(\r)?\n/g, '\r\n')).replace(/%20/g, '+')}`
        )
        .join('&');

    return result
  };

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
  };

  const selectors$2 = [
    'a[data-redact-inline]',
    'form[data-redact-inline]'
  ];

  const bind$2 = (element) => {
    if (typeof element.dataset.redactInline !== 'undefined') {
      const [targetSelector, destinationSelector, templateSelector] =
        parseArgs(element.dataset.redactInline);

      const eventName = element.nodeName === 'FORM' ? 'submit' : 'click';

      element.addEventListener(eventName, (e) => {
        e.preventDefault();
        loadElement(element).then((doc) => {
          const destination = document.querySelector(destinationSelector);
          destination.innerHTML = '';
          let content = doc.querySelector(targetSelector);
          if (templateSelector) {
            const template = document.querySelector(templateSelector);
            const holder = document.createElement('div');
            holder.innerHTML = template.innerHTML;
            const target = holder.querySelector('[data-redact-inline-target]');
            target.parentNode.replaceChild(content, target);
            const fragment = document.createDocumentFragment();
            fragment.innerHTML = holder.innerHTML;
            content = fragment;
          }
          destination.innerHTML = content.innerHTML;
        });
      });

      element.removeAttribute('data-redact-inline');
    }
  };

  const selectors$3 = [
    'a[data-redact-prefetch]'
  ];

  const bind$3 = (element) => {
    if (match(element, 'A', 'redactPrefetch')) {
      const targetSelector = element.dataset.redactPrefetch || 'body';
      load(element.getAttribute('href')).then((doc) => {
        const newNode = doc.querySelector(targetSelector);
        element.parentNode.replaceChild(newNode, element);
      });
      element.removeAttribute('data-redact-prefetch');
    }
  };

  const selectors$4 = [
    'button[data-redact-remove]'
  ];

  const bind$4 = (element) => {
    if (match(element, 'BUTTON', 'redactRemove')) {
      const selector = element.dataset.redactRemove;
      element.addEventListener('click', () => {
        const toRemove = document.querySelector(selector);
        toRemove.parentNode.removeChild(toRemove);
      });
      element.removeAttribute('data-redact-remove');
    }
  };

  const selectors$5 = [
    'a[data-redact-replace]',
    'form[data-redact-replace]'
  ];

  const bind$5 = (element) => {
    if (typeof element.dataset.redactReplace !== 'undefined') {
      const replacementSelectors = parseArgs(element.dataset.redactReplace);

      const eventName = element.nodeName === 'FORM' ? 'submit' : 'click';

      element.addEventListener(eventName, (e) => {
        e.preventDefault();
        loadElement(element).then((doc) => {
          replacementSelectors.forEach((selector) => {
            const newEl = doc.querySelector(selector);
            const oldEl = document.querySelector(selector);
            oldEl.parentNode.replaceChild(newEl, oldEl);
          });
        });
      });

      element.removeAttribute('data-redact-replace');
    }
  };

  const selectors$6 = [
    'button[data-redact-toggle]',
    'input[data-redact-toggle]'
  ];

  const bind$6 = (element) => {
    if (typeof element.dataset.redactToggle === 'undefined') {
      return
    }

    const [targetSelector, className] = parseArgs(element.dataset.redactToggle);

    if (element.nodeName === 'BUTTON') {
      element.addEventListener('click', () => {
        document.querySelector(targetSelector).classList.toggle(className);
      });
    } else if (element.nodeName === 'INPUT') {
      element.addEventListener('change', () => {
        // TODO: this is not un-toggling for the previously-checked radio
        document
          .querySelector(targetSelector)
          .classList
          .toggle(className, element.checked);
      });
    }

    element.removeAttribute('data-redact-toggle');
  };

  const bind$7 = (element) => {
    bind$3(element);
    bind$5(element);
    bind$2(element);
    bind$6(element);
    bind$4(element);
    bind$1(element);
    bind(element);
  };

  const selectors$7 =
    []
      .concat(selectors$1)
      .concat(selectors)
      .concat(selectors$2)
      .concat(selectors$3)
      .concat(selectors$4)
      .concat(selectors$5)
      .concat(selectors$6)
      .join(',');

  const bindChildren = (container) => {
    Array.prototype.forEach.call(container.querySelectorAll(selectors$7), (element) => {
      bind$7(element);
    });
  };

  const observe = () => {
    const observer = new window.MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName.indexOf('data-redact') === 0) {
          bind$7(mutation.target);
        }

        if (mutation.type === 'childList') {
          bindChildren(mutation.target);
        }
      });
    });

    observer.observe(
      document.querySelector('body'),
      { attributes: true, childList: true, subtree: true }
    );
  };

  const init = () => {
    listen();
    observe();
    bindChildren(document);
  };

  window.addEventListener('load', init);

}());

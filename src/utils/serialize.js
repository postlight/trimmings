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

export default serialize

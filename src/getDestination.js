const getDestination = (element) => {
  if (element.nodeName === 'A') {
    return element.getAttribute('href')
  } else if (element.nodeName === 'FORM') {
    const action = element.getAttribute('action')
    const method = element.getAttribute('method')

    if (!method || method.toLowerCase() === 'get') {
      const body = serialize(element)
      return `${action}?${body}`
    }

    return action
  }
}

export default getDestination

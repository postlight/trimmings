import getDestination from './getDestination'
import load from './load'
import serialize from './serialize'

const POST_HEADERS = { 'Content-Type': 'application/x-www-form-urlencoded' }

const loadElement = (element) => {
  const url = getDestination(element)

  if (element.nodeName === 'A') {
    return load(url)
  } else if (element.nodeName === 'FORM') {
    const method = element.getAttribute('method')

    if (!method || method.toLowerCase() === 'get') {
      return load(url)
    }

    const body = serialize(element)
    return load(url, { method, body, headers: POST_HEADERS })
  } else {
    throw new Error(`Unexpected nodename ${element.nodeName} for loadElement`)
  }
}

export default loadElement

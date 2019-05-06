import load from './load'
import serialize from './serialize'

const POST_HEADERS = { 'Content-Type': 'application/x-www-form-urlencoded' }

const loadElement = (element) => {
  if (element.nodeName === 'A') {
    return load(element.getAttribute('href'))
  } else if (element.nodeName === 'FORM') {
    const url = element.getAttribute('action')
    const method = element.getAttribute('method')
    const body = serialize(element)

    if (!method || method.toLowerCase() === 'get') {
      return load(`${url}?${body}`)
    }

    return load(url, { method, body, headers: POST_HEADERS })
  } else {
    throw new Error(`Unexpected nodename ${element.nodeName} for loadElement`)
  }
}

export default loadElement

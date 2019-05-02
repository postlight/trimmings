import load from './load'
import serialize from './serialize'

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

export default loadElement

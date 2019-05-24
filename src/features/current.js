import toggleClass from '../utils/toggleClass'

export const key = 'trimToggle'

export const eventNames = ['click', 'input', 'change']

let path = ''
let fragment = ''

const matchLocation = (href) => {
  if (href.indexOf(path) !== 0) {
    return false
  }

  if (href.length !== path.length && href.substring(path.length, path.length + 1) !== '#') {
    return false
  }

  return true
}

const matchFragment = (href) => {
  if (fragment.match(/^#?$/)) {
    return (href.indexOf('#') === -1 || href.match(/#$/))
  }

  if (href.indexOf('#') === -1) {
    return false
  }

  return `#${href.split('#')[1]}` === fragment
}

export const render = (parent) => {
  const { pathname, search, hash } = window.location

  path = `${pathname}${search}`
  fragment = hash

  Array.prototype.forEach.call(parent.querySelectorAll('a'), (link) => {
    const href = link.getAttribute('href')
    const currentPath = matchLocation(href)
    const currentFragment = currentPath && matchFragment(href)
    toggleClass(link, 'trim-current', currentPath)
    toggleClass(link, 'trim-current--fragment', currentFragment)
  })
}

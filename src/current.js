let currentPath = ''
let currentFragment = ''

const matchLocation = (href) => {
  if (href.indexOf(currentPath) !== 0) {
    return false
  }

  if (href.length !== currentPath.length && href.substring(currentPath.length, currentPath.length + 1) !== '#') {
    return false
  }

  return true
}

const matchFragment = (href) => {
  console.log('check', href, currentFragment)
  if (currentFragment.match(/^#?$/)) {
    return (href.indexOf('#') === -1 || href.match(/#$/))
  }

  if (href.indexOf('#') === -1) {
    return false
  }

  return `#${href.split('#')[1]}` === currentFragment
}

const update = () => {
  const { pathname, search, hash: newFragment } = window.location
  const newPath = `${pathname}${search}`

  if (newPath === currentPath && newFragment === currentFragment) {
    return
  }

  if (newPath === currentPath) {
    currentFragment = newFragment

    Array.prototype.forEach.call(document.querySelectorAll('.redact-current'), (link) => {
      link.classList.toggle('redact-current--fragment', matchFragment(link.getAttribute('href')))
    })

    return
  }

  currentPath = newPath
  currentFragment = newFragment

  Array.prototype.forEach.call(document.querySelectorAll('.redact-current'), (link) => {
    link.classList.remove('redact-current')
    link.classList.remove('redact-current--fragment')
  })
  Array.prototype.forEach.call(document.querySelectorAll('a'), (link) => {
    const href = link.getAttribute('href')

    if (!matchLocation(href)) {
      return
    }

    link.classList.add('redact-current')

    if (matchFragment(href)) {
      link.classList.add('redact-current--fragment')
    }
  })
}

const events = [
  [window, 'DOMContentLoaded'],
  [document, 'turbolinks:render'],
  [window, 'hashchange'],
  [window, 'popstate'],
  [window, 'pushstate']
]

export const listen = () => {
  update()
  events.forEach(([context, eventName]) => {
    context.addEventListener(eventName, update)
  })
}

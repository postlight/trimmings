// IE does not support Element.classList.toggle so let's write our own!
const toggleClass = (element, className, state) => {
  if (state && !element.classList.contains(className)) {
    element.classList.add(className)
  } else if (!state && element.classList.contains(className)) {
    element.classList.remove(className)
  }
}

export default toggleClass

// Assuming that the supplied event is a click, determine whether we should
// react to it—specifically, make sure the user isn't trying to invoke some
// other feature of their user agent, like opening a link in a new tab.
//
// Inspired by Controller#clickEventIsSignificant in Turbolinks:
// https://github.com/turbolinks/turbolinks/blob/26f42b148b624115b97e4d083f3a1f47d72a242f/src/controller.ts#L287
const isRegularClick = (event) => {
  return !(
    (event.target && event.target.isContentEditable)
    || event.defaultPrevented
    || event.which > 1
    || event.altKey
    || event.ctrlKey
    || event.metaKey
    || event.shiftKey
  )
}

export default isRegularClick

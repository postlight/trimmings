---
layout: default
title: Features
---
## Embed

Replaces an `<a>` tag with the contents of the link it points to. Must be the same host but a different path. If the element’s `display` style property is `none`, it will not be replaced. If its `display` property changes as the result of a DOM change (like adding a class), its `embed` hint will be followed immediately.

    <a data-redact-embed="main">Thumbnails</a>

### Arguments

- selector in target document to use (optional, defaults to `body`)

## Inline loading

When the link is followed or form is submitted, load the target document into a specified selector on the current page. Used for modals, partial page changes, preserving state in i.e. sidebar, etc. If the destination does not exist or its `display` property is `none`, Redact will fall back to standard link behavior—that is, the link will just navigate to wherever it’s pointing.

    <a data-redact-inline=".sidebar, main">Menu</a>

### Arguments

- selector for target in current document to replace (optional, defaults to `body`)
- selector in target document to use (optional, defaults to `body`)
- `updateTitle`: when this is `true`, the document title will be replace with the title of the target document after loading. (optional, defaults to false)
- `template`: selector for a template that will wrap your loaded content. If this argument is present, the _children_ of the selected node will be cloned, an element within the cloned nodes with the `data-redact-inline-target` property will be _replaced_ with the loaded content, and all of this will replace the target specified in the first argument. (optional)
- `method`: One of `replace`, `prepend`, `append`, `reduce-prepend`, or `reduce-append`. (Optional, defaults to `replace`)
  - `replace`: The children of your destination element will be removed and your new inline content will be inserted instead.
  - `prepend`: The children of your destination element will be preserved and your new inline content will be inserted before it.
  - `append`: The children of your destination element will be preserved and your new inline content will be inserted after it.
  - `reduce-prepend`: If the triggering element is inside the destination element, the immediate child of the destination element that includes the triggering element will be preserved and your new inline content will be inserted before it. Otherwise, this works identically to `replace`.
  - `reduce-append`: If the triggering element is inside the destination element, the immediate child of the destination element that includes the triggering element will be preserved and your new inline content will be inserted after it. Otherwise, this works identically to `replace`.

## Replacement

When the link is followed or form is submitted, replace all of the selected elements in the current document with their respective elements in the target document. Useful when the user takes an action that updates some data, like a shopping cart count, but shouldn’t replace the entire page.

    <form data-redact-replace=".like-count, .flash-message">
      <button>Like</button>
    </form>

### Arguments

- selector for target in current document to replace (optional, defaults to `body`)
- selector in target document to use (optional, defaults to `body`)
- selector for a template that will wrap your loaded content. If this argument is present, the _children_ of the selected node will be cloned, an element within the cloned nodes with the `data-redact-inline-target` property will be _replaced_ with the loaded content, and all of this will replace the target specified in the first argument. (optional)

## Autosubmit

Submits a form automatically on change. When applied to a form, any change within the form will submit; when applied to indidual elements, only changes on those elements will submit.

    <form data-redact-autosubmit>

    <select data-redact-autosubmit>

## Toggle

Controls a class on a target element when the user interacts with the current element. When used on a `<button>`, the class is toggled. On a text `<input>`, the class's presence is synced with the presence of a field value. On an `<input>` of type `checkbox` or `radio`, the class's presence is synced with the checked state of the input (i.e. if the input is checked, the class is added). Note that other `radio` element with the same `name` attribute will be _un_-toggled.

    <button data-redact-toggle=".menu, menu--visible">

### Arguments

- selector of element to modify
- class to toggle

## Remove

When a `<button>` with this hint is clicked, the target node is removed from the DOM.

    <button data-redact-remove=".modal">

### Arguments

- selector of element to remove

## Hotkey

Treat the user pressing the specified keyboard shortcut as a click on this button or link. If multiple elements match the shortcut, only the first one (as matched by document.querySelector) will be clicked.

    <button data-redact-hotkey="Ctrl+KeyS">

### Arguments

One or more key combinations, separated by spaces (**No commas!**). The keys in a combination must be separated by plus signs (`+`). If you wish to include modifiers, they must be present in this order: Alt, Control, Meta, Shift. Your non-modifer keys must exactly match the values returned by [`KeyboardEvent.code`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code).

## Current (auto feature)

Any `<a>` whose `href` matches the current URL will automatically receive the `redact-current` class. A `<a>` whose `href` matches the current URL _including the fragment_ will additionally receive the `redact-current--fragment` class. If the location or fragment changes, these links will be updated on all `<a>` tags as necessary.

## Enabled (auto feature)

When Redact begins scanning your page, it will add the `redact` class to `<body>`. Useful for toggling visibility of Javascript-enabled features with CSS.

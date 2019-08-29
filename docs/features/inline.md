---
layout: default
title: Inline
---
When the link is followed or form is submitted, load the target document into a specified selector on the current page. Useful for things like modals and tabs, especially when you don't want to interrupt changes elsewhere on the page.

    <a data-trimmings-inline="from: .sidebar, to: main">Menu</a>

## Arguments

Arguments for Inline are **named** and separated by commas. The name and value for an argument must be separated by a colon. Neither names nor values should be wrapped in quotes (`"`) or apostrophes (`'`).

- `from`: A selector targeting an element in the current document where our content will be inserted. (required)
- `to`: A selector targeting the linked page where our content will come from. (required)
- `updateTitle`: When this is `true`, the document title will be replace with the title of the target document after loading. (optional, defaults to `false`)
- `updateLocation`: When this is `true`, the current URL will be replaced with the target URL. (optional, defaults to `false`)
- `template`: A selector targeting a template in the current document that will wrap your loaded content. See Templates, below. (optional)
- `method`: Specifies how the linked content should interact with existing content in the destination element. See Replacement methods, below. (optional, defaults to `replace`)

## Templates

If a link's Inline arguments include a template selector, the _children_ of the selected node will be cloned, an element within the cloned nodes with the `data-trimmings-inline-target` property will be _replaced_ with the loaded content, and all of this will be inserted into the the target element.

## Replacement methods

### `replace`

The children of your destination element will be removed and your new inline content will be inserted instead.

### `prepend`

The children of your destination element will be preserved and your new inline content will be inserted before it.

### `append`

The children of your destination element will be preserved and your new inline content will be inserted after it.

### `reduce-prepend`

If the triggering element is inside the destination element, the immediate child of the destination element that includes
the triggering element will be preserved and your new inline content will be inserted before it. Otherwise, this works identically to `replace`.

### `reduce-append`

If the triggering element is inside the destination element, the immediate child of the destination element that includes
the triggering element will be preserved and your new inline content will be inserted after it. Otherwise, this works identically to `replace`.

## Fail-proof

If the destination does not exist or its `display` property is `none`, Trimmings will fall back to standard link behavior—that is, the link will just navigate to wherever it’s pointing.

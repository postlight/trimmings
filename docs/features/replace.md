---
layout: default
title: Replace
---

When the link is followed or form is submitted, replace all of the selected elements in the current document with their respective elements in the target document.

    <form method="post" action="/photos/123" data-trim-replace=".like-count, .flash-message">
      <button>Like</button>
    </form>

## Arguments

- One or more selectors to fetch from the target document and replace in the current document. Any selectors that don't exist in the target or current documents will be ignored.

## In with the new

Replace is handy for interactions that will modify data that is already displayed on the page, like a shopping cart or like count. If the interactive element returns the user to the current page, you can confidently replace just the elements that you know will be different without requiring a full page load.

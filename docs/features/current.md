---
layout: default
title: Current (auto feature)
---

On page load and every time the URL changes, any `<a>` whose `href` matches the current URL will automatically receive the `trimmings-current` class. A `<a>` whose `href` matches the current URL _including the fragment_ will additionally receive the `trimmings-current--fragment` class.

After URL changes, `<a>` tags with the `trimmings-current` or `trimmings-current--fragment` whose URLs no longer match the current URL or fragment will have their respective classes removed.

## Examples

In each example, an `<a>` with the specified `href` and a "Yes" in the "Current" column will receive the `trimmings-current` class. An `<a>` with a "Yes" in the "Fragment" column will _also_ receive the `trimmings-current--fragment` class.

| Current page URL | Link `href` | Current | Fragment |
-|-
| http://example.com/about | /contact | No | No |
| http://example.com/about | http://example.com/about | Yes | Yes |
| http://example.com/about | http://google.com/about | No | No |
| http://example.com/about | /about | Yes | Yes |
| http://example.com/about#history | /about | Yes | No |
| http://example.com/about#history | /about#contact | Yes | No |
| http://example.com/about#history | /about#history | Yes | Yes |

Note that this feature also works with Turbolinks—it listens for the `turbolinks:render` event.

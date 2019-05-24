---
layout: default
title: Embed
---
Replaces an `<a>` tag with the contents of the link it points to.

    <a data-trim-embed="main" href="/thumbnails">
      Thumbnails
    </a>

## Arguments

- A selector pointing to an element in the target document with which to replace the `<a>`. If no argument is specified, the selector is `body`, meaning the entire the entire body of the target document will be embedded in the current document. If the selected element does not exist in the target document, the original `<a>` will be left unchanged.

## Internal only

A link that does not point at an internal page will not be embedded. The link's `href` must either not specify a host or it must match the current host. Additionally, the path must not match the current path.

| Current page URL | Link `href` | Embeddable? |
-|-
| http://example.com/about | /contact | Yes |
| http://example.com/about | /about?query=hours | Yes |
| http://example.com/about | http://example.com/about | No |
| http://example.com/about | http://google.com/  | No |
| http://example.com/about | /about | No |

## Disabling embedded links

If the element’s `display` style property is `none`, it will not be replaced. If its `display` property changes as the result of a DOM change (like adding a class), its `embed` hint will be followed immediately. If the element is hidden by other means (for example, a parent element has the `display: none` style) but this `<a>`’s `display` property is not `none`, _it will still be fetched and embedded_.


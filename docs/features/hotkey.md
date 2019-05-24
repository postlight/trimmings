---
layout: default
title: Hotkey
---

Treat the user pressing the specified keyboard shortcut as a click on this button or link.

    <a href="/page/2" data-trim-hotkey="Space Enter Alt+KeyC">
      Press Space, Enter, or Alt-C to continue
    </a>

## Arguments

One or more key combinations, separated by whitespace **without commas**. The keys in a combination must be separated by plus signs (`+`). If you wish to include any modifiers, they **must** be specified in this order: Alt, Control, Meta, Shift. Your non-modifer keys must exactly match the values returned by [`KeyboardEvent.code`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code).

## I'm #1

If multiple elements have the same hotkey specified, only the first one (as matched by document.querySelector) will be clicked.
